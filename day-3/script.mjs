import { readFileSync } from "node:fs";

const filename = process.argv[2];
const fileInput = readFileSync(filename).toString();
const fileInputArray = fileInput.split('\n').filter(line => line.length > 0);

// create two dimensional array
const twoDArr = fileInputArray.map(line => Array.from(line));
const partNumbers = [];

const checkPartNumber = (rowIndex, colIndex, rowLength) => {
  const neighbours = [];
  const arr = twoDArr;
  // add above row neighbours
  if (rowIndex > 0){
    // above-middle
    neighbours.push(arr[rowIndex-1][colIndex]);
    if (colIndex > 0){
      // above-left
      neighbours.push(arr[rowIndex-1][colIndex-1]);
    }
    if (colIndex < rowLength-1){
      // above-right
      neighbours.push(arr[rowIndex-1][colIndex+1]);
    }
  }
  // add below neighbours
  if (rowIndex < arr.length-1){
    // below-middle
    neighbours.push(arr[rowIndex+1][colIndex]);
    if (colIndex > 0){
      // below-left
      neighbours.push(arr[rowIndex+1][colIndex-1]);
    }
    if (colIndex < rowLength-1){
      // below-right
      neighbours.push(arr[rowIndex+1][colIndex+1]);
    }
  }
  // add left and right neighbours 
  if (colIndex > 0){
    // left
    neighbours.push(arr[rowIndex][colIndex-1]);
  }
  if (colIndex < rowLength-1){
    // right
    neighbours.push(arr[rowIndex][colIndex+1]);
  }
  return !!(neighbours.find(n => (n !== '.' && !/\d/.test(n))));
}

twoDArr.forEach((row, rowIndex) => {
  let numberInRow = '';
  let isPartNumber = false;
  row.forEach((val, colIndex) => {
    // is that row/col entry a digit?
    if(/\d/.test(val)){
      // add the digit to a row number
      numberInRow = numberInRow.concat(val);
      // check for a partNumber
      if(!isPartNumber){
        isPartNumber = checkPartNumber(rowIndex, colIndex, row.length)
      }
      // check if the digit is in the last col in the row
      if(colIndex === row.length-1 && isPartNumber){
        partNumbers.push(Number(numberInRow));
      }
    } else {
      // check when you have moved from a digit val to a non-digit val if there is a partNumber now ready to be recorded. 
      // NB see also the check above if the digit is in the last column in the row.
      if (numberInRow !== '' && isPartNumber){
        // add any part number to the array
        partNumbers.push(Number(numberInRow));
      }
      // reset flags
      numberInRow = '';
      isPartNumber = false;
    }
  })
})

const sumPartNumbers = partNumbers.reduce((curr, next) => curr + next, 0 )

// console.log('>> twoDArr', twoDArr);
// console.log('>> partNumbers', partNumbers, partNumbers.length);
console.log('>> sumPartNumbers',sumPartNumbers);
