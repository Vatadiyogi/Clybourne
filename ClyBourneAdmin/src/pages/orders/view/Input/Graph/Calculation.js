export function CalculateGraphData(salesNumber, percentage) {
    let number = 0;
    number = salesNumber * (1 + percentage / 100);
    return number;  
}

export function calculateNetProfitMargin(salesNumber, netProfit) {
  let number = 0;
  number = ( parseFloat(salesNumber) / parseFloat(netProfit) ) * 100;
  return number;
}
export function roundOffNumber(numbers, unitOfNumber) {
  console.log(" funcyion unit number",unitOfNumber)
  if (!Array.isArray(numbers) || numbers.length === 0) {
    console.error("Input is not a valid array of numbers");
    return {
      roundedNumbers: numbers.map(() => 0),
      valueType: unitOfNumber || 'Millions'
    };
  }

  // Find the largest number
  const largestNumber = Math.max(...numbers);
  
  // Start with user's selected unit
  let displayUnit = unitOfNumber || 'Millions';
  let divisor = 1;
  
  // Define unit thresholds (when to move to next unit)
  // When number is 1000 or more in current unit, move up
  if (largestNumber >= 1000) {
    if (unitOfNumber === 'Thousands') {
      displayUnit = 'Millions';
      divisor = 1000; // 1000 Thousands = 1 Million
    } else if (unitOfNumber === 'Millions') {
      displayUnit = 'Billions';
      divisor = 1000; // 1000 Millions = 1 Billion
    } else if (unitOfNumber === 'Billions') {
      displayUnit = 'Trillions';
      divisor = 1000; // 1000 Billions = 1 Trillion
    }
    // Trillions stays as Trillions (no higher unit)
  }
  
  // Divide all numbers by the divisor
  const roundedNumbers = numbers.map(num => 
    Math.round((num / divisor) * 100) / 100
  );

  return {
    roundedNumbers,
    valueType: displayUnit
  };
}
// NEW FUNCTION: Convert numbers based on unitOfNumber
export function convertNumbersByUnit(numbers, unitOfNumber) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    console.error("Input is not a valid array of numbers");
    return { convertedNumbers: [], unit: unitOfNumber || '' };
  }

  // Determine divisor based on unitOfNumber
  let divisor;
  
  // Handle case-insensitive comparison
  const unit = unitOfNumber ? unitOfNumber.toLowerCase() : '';
  
  if (unit.includes('trillion')) {
    divisor = 1000000000000;
  } else if (unit.includes('billion')) {
    divisor = 1000000000;
  } else if (unit.includes('million')) {
    divisor = 1000000;
  } else if (unit.includes('thousand')) {
    divisor = 1000;
  } else {
    // Default: no conversion
    divisor = 1;
  }

  // Convert all numbers by the divisor and round to 2 decimal places
  const convertedNumbers = numbers.map(num => {
    if (num === null || num === undefined || isNaN(num)) {
      return 0;
    }
    const scaledValue = num / divisor;
    return Math.round(scaledValue * 100) / 100; // Round to 2 decimal places
  });

  // Return the converted numbers and the unit used
  return {
    convertedNumbers,
    unit: unitOfNumber || ''
  };
}