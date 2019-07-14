import {
  Stitch,
  RemoteMongoClient
} from 'mongodb-stitch-browser-sdk';

const APP_ID = 'resp-nqkab';

const stitchClient = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID);

const db = stitchClient
  .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  .db('sample_disaster');

const found = db.collection('found');
const missing = db.collection('mising');

export {stitchClient, found, missing};
