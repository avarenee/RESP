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
                   {$or : [{$and : [{last: person.last},
                                    {$or : [{$and : [{age_min : {$lte : person_age}}, {age_max : {$gte : person_age}}]},
                                            {$and : [{weight_min : {$lte : person.weight}}, {weight_max : {$gte : person.weight}}]},
                                            {$and : [{height_min : {$lte : person.height}}, {height_max : {$gte : person.height}}]}] }]},
                           {$and : [{$and : [{age_min : {$lte : person_age}}, {age_max : {$gte : person_age}}]},
                                    {$or : [{$and : [{weight_min : {$lte : person.weight}}, {weight_max : {$gte : person.weight}}]},
                                            {$and : [{height_min : {$lte : person.height}}, {height_max : {$gte : person.height}}]}] }] }] }
           ]
         }
}
