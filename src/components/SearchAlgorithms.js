export function checkInAlgorithm(person) {
  if(person.dob) {
    var dt = new Date();
    const [current_y, current_m, current_d] = dt.toISOString().slice(0, 9).split('-');
    const [y, m, d] = person.dob.split('-');
    const greater_month = (parseInt(current_m) - parseInt(m)) > 0;
    const greater_day = (parseInt(current_d) - parseInt(d)) > 0;
    var person_age = (greater_month && greater_day) ? parseInt(current_y) - parseInt(y)
                                                    : parseInt(current_y) - parseInt(y) - 1;
  } else {
    var person_age = null;
  }
  return {
           $and : [{first : person.first},
                   {$or : [{sex : person.sex}, {sex : "Undefined"}]},
                   {$or : [{$or : [{last: person.last},
                                    {$or : [{$and : [{age_min : {$lte : person_age}}, {age_max : {$gte : person_age}}]},
                                            {$and : [{weight_min : {$lte : person.weight}}, {weight_max : {$gte : person.weight}}]},
                                            {$and : [{height_min : {$lte : person.height}}, {height_max : {$gte : person.height}}]}] }]},
                           {$or : [{$and : [{age_min : {$lte : person_age}}, {age_max : {$gte : person_age}}]},
                                    {$or : [{$and : [{weight_min : {$lte : person.weight}}, {weight_max : {$gte : person.weight}}]},
                                            {$and : [{height_min : {$lte : person.height}}, {height_max : {$gte : person.height}}]}] }] }] }
           ]
         }
}

export function searchAlgorithm(person) {
  return {
           $and : [{$or : [{sex : person.sex}, {sex : "Undefined"}]},
                   {$or : [{first : person.first}, {last : person.last}]}
                  ]
         }
}

export function advancedSearchAlgorithm(person) {
  if(person.dob) {
    var dt = new Date();
    const [current_y, current_m, current_d] = dt.toISOString().slice(0, 9).split('-');
    const y_min = current_y - person.age_min;
    const y_max = current_y - person.age_max;
    var [age_min, age_max] = [[y_min, current_m ,current_d].join('-'), [y_max, current_m, current_d].join('-')];
  } else {
    var [age_min, age_max] = [null, null];
  }
  return {
           $and : [{$or : [{sex : person.sex}, {sex : "Undefined"}]},
                   {$or : [{first : person.first}, {last : person.last}]},
                   {$or : [{$and : [{dob : {$lte : age_min} }, {dob : {$gte : age_max}}]},
                           {$and : [{height : {$lte : person.height_max}}, {height : {$gte : person.height_min}}]},
                           {$and : [{weight : {$lte : person.weight_max}}, {weight : {$gte : person.weight_min}}]}
                           ]}
                  ]
         }
}
