//get files uploading
const imageUpload = document.getElementById('imageUpload')

//load models and APIs to be using--loading from models folder
Promise.all([ //promise.all means return all together / synchronize
  //loading 3 different libraries
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  //allows algorithm to detect where actual character's faces are
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  //allows algorithm to detect which ones are faces
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start) //after finishing all of it, call method start() which starts program

async function start() {
  //creating the boxes that go on the characters
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6) //.6 stands for as long as value > 60% accept the face as that face
  let image
  let canvas
  document.body.append('Loaded')
  imageUpload.addEventListener('change', async () => {
    if(image) image.remove()
    if(canvas) canvas.remove ()
    //get image from file uploaded and then connect to the face API
    const image = await faceapi.bufferToImage(imageUpload.files[0])
    //show the image (append to container instead now)
    container.append(image)
    
    
    //now make the canvas & customize
    const canvas = faceapi.createCanvasFromMedia(image)

    //append to the container
    container.append(canvas)

    //edit the width and height
    const displaySize = { width: image.width, height: image.height}

    //give the api the canvas and displaySize to display detections in canvas
    faceapi.matchDimensions(canvas, displaySize)

    //detecting the faces of the image
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    document.body.append("There are this number of faces in the image:")
    document.body.append(detections.length)
    //resize all boxes to be correct size of the displaySize to fit in canvas
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    //either find the best match (greatest prob) or any face detected over 60%
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

    //draw the box on the face
    results.forEach(detection => {
        const box = resizedDetections[i].detection.box
        //intead of label just being face, now return the name of the person
        const drawBox = new faceapi.draw.DrawBox(box, {label: results.toString()})
        //give box the canvas to draw onto
        drawBox.draw(canvas)
    })
    
  })
}

//train images on the labeled images
function loadLabeledImages()
{
    console.log("hi")
    const labels = ['Alex Guevara', 'Ava Biery', 'Black Widow','Captain America', 'Captain Marvel', 'Hawkeye', 'Jessica Peng', 'Jim Rhodes', 'Juliana Fogg', 'Thor', 'Tony Stark']
    //go through all labels, return array
    return Promise.all(
        labels.map(async label => {
            const descriptions = [] //initliaze empty array
            var personDiv = document.getElementById('person');
            console.log('PERSON: ' + label)
            personDiv.textContent(label)
            for(let i = 1; i <= 2; i++) //because there's 2 images of every character
            {
                //liveserver doesn't actually take image straight from path of folder, need it hosted on a website (he has it on github)
                //put in label and also i stands for 1 or 2 either 1st or 2nd image of character
                const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/jessicapeng/FacialRecTraining/master/labeled_images/${label}/${i}.jpg`) 
                console.log("IMG: ", img)
                const detections = await faceapi.detectSingleFace(img)
                .withFaceLandmarks().withFaceDescriptors()
                descriptions.push(detections.descriptor) //push the recognized faces
            }

            //return the label and the descriptions (return all labels and different promises)
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}