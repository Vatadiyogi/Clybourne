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

export function roundOffNumber(numbers, finData) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    console.error("Input is not a valid array of numbers");
    return;
  }

  // Find the largest number in the array
  const largestNumber = Math.max(...numbers.filter(num => !isNaN(num)));
  const digitCount = Math.floor(Math.log10(Math.abs(largestNumber))) + 1;

  let currencyValues = finData.valueType[0];

  // Determine the divisor based on the digit count
  let divisor;
  if (digitCount >= 4 && digitCount <= 6) {
    divisor = 1000;
    currencyValues = currencyValues === 'Absolute' 
        ? 'Thousands' 
        : (currencyValues === 'Thousands' 
          ? 'Millions' 
          : (currencyValues === 'Millions' 
            ? 'Billions' 
            : 'Trillions'));
  } else if (digitCount >= 7 && digitCount <= 9) {
    divisor = 1000000;
    currencyValues = currencyValues === 'Absolute' 
        ? 'Millions' 
        : (currencyValues === 'Thousands' 
          ? 'Billions' 
          : (currencyValues === 'Millions' 
            ? 'Trillions' 
            : 'Trillions'));
  } else if (digitCount >= 10) {
    divisor = 1000000000;
    currencyValues = currencyValues === 'Absolute' 
    ? 'Billions' 
    : (currencyValues === 'Thousands' 
      ? 'Trillions' 
      : 'Trillions');
  } else {
    divisor = 1; // No division if digit count is less than 4
  }

  // Divide all numbers by the divisor
  const roundedNumbers = numbers.map(num => {
    const validNum = isNaN(num) ? 0 : num;
    return Math.round((validNum / divisor) * 100) / 100;
  });

  // Return multiple values in an object
  return {
    roundedNumbers,
    valueType : currencyValues
  };
}
