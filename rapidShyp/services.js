function getWeightSlab(weight) {
  if (weight <= 0.5) return "0.5";
  if (weight <= 1) return "1 Kgs"; 
  if (weight <= 2) return "2 Kgs";
  if (weight <= 5) return "5 Kgs";
  if (weight <= 10) return "10 Kgs";
  return "10 Kgs"; // Default for heavier packages
}


function calculateCODCharges(orderValue, fixedCOD, percentageCOD) {

  if (!(orderValue || fixedCOD || percentageCOD)) {

    console.log("Cant clacutaleCOD Charges");
  }


  const percentageAmount = orderValue * percentageCOD;
  return Math.max(fixedCOD, percentageAmount);
}

module.exports = { getWeightSlab,calculateCODCharges}