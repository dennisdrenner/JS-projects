let addSubjectFee = 100; 
let distance = 33; 
let freeDistance = 20; 
let mileageRate = .60; 
let looks = 3; 
let minPrice = 300; 
let retouchFee = 35; 
let extraRetouch = 3; 

function travelCalc (distance, mileageRate) {
  if (distance < freeDistance + 1 ) { return 0; }   //first 20 miles are free 
  else {
  let fee = ((distance - freeDistance) * mileageRate)
  return fee; 
  }                                   
}

function calcHeadshotPrice () {
  var price = minPrice + (addSubjectFee * addSubjects) ;
  //price += addSubjects * addSubjectFee; 
  var extraRetouchFees = retouchFee * extraRetouch; 
  //var extraLookFee = ((looks - 1) * retouchFee);
  //console.log(looks, retouchFee, extraLookFee); 
  var travelFee = travelCalc(distance, mileageRate);
  return [price, travelFee, extraRetouchFees]; 
}

console.log(calcHeadshotPrice()); 