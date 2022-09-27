// Weekly workout planner 

//let test = prompt(); 

/* 

How to structure the data? 

exercise categories are push, pull, hinge, squat, abs
categories can be broken down into compound and accessory (e.g deadlift is 
	compound while calf raise or tib raise is accessory)

Or more flexible?
exercise name (e.g. pull up), category (pull), sub-category (compound),
info url (youtube.com/...), notes("the pull up.."), 

Export weekly plans as full body split, push/pull/legs, push/pull, bw vs. gym 

*/

var push = {};
var pull = {};
var hinge = {};
var abs = {}; 
var carry = {}; 



pull.compound = ["pull up", "row machine", "db row"];
pull.accessory = ["db curl", "straight bar curl", "forearm curl", "finger spreaders", "dead hangs"];



var legs = {};
legs["quads"] = ["bw squats", "goblet squats", "barbell squats", "dumbbell suitcase squats"]
legs["hamstrings"] = ["leg curls", "nordics", "floor sliders"]
legs["calves"] = ["standing bw calf raise", "bent leg calf raise", "bent leg calf machine", "leg press calf raises"]



//console.log(legs);

var hiit = ['peleton', 'hill sprints', 'elliptical', 'burpees']

function chooseRandomExercise (array) {
    return array[Math.floor(Math.random()*array.length)]; 
}

//console.log(chooseRandomExercise(hiit));
//console.log(chooseRandomExercise(legs.calves));
console.log(chooseRandomExercise(pull.compound));

