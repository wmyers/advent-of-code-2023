import 'core-js/actual/set/index.js';
import { readFileSync } from "node:fs";

const filename = process.argv[2];
const fileInput = readFileSync(filename).toString();
const fileInputArray = fileInput.split('\n').filter(line => line.length > 0);

// create two dimensional array
const twoDArr = fileInputArray.map(line => Array.from(line));
const partNumbers = [];
const gearRecord = new Map();

const processNeighbours = (neighboursPositions, tdArr) => {
  const adjacentGearPositions = new Set();
  const neighbourSymbols = neighboursPositions.map(([row, col]) => {
    const symbol = tdArr[row][col];
    if(symbol === '*'){
      const key = `[${row}, ${col}]`;
      adjacentGearPositions.add(key);
    }
    return symbol;
  });

  // check if the number is adjacent any symbol (not '.' or a digit)
  const isPartNumber = !!(neighbourSymbols.find(n => (n !== '.' && !/\d/.test(n))));
  return [isPartNumber, adjacentGearPositions];
}

const checkPartNumber = (rowIndex, colIndex, rowLength, tdArr) => {
  const neighbours = [];
  // add above row neighbours
  if (rowIndex > 0){
    // above-middle
    neighbours.push([rowIndex-1, colIndex]);
    if (colIndex > 0){
      // above-left
      neighbours.push([rowIndex-1, colIndex-1]);
    }
    if (colIndex < rowLength-1){
      // above-right
      neighbours.push([rowIndex-1, colIndex+1]);
    }
  }
  // add below neighbours
  if (rowIndex < tdArr.length-1){
    // below-middle
    neighbours.push([rowIndex+1, colIndex]);
    if (colIndex > 0){
      // below-left
      neighbours.push([rowIndex+1, colIndex-1]);
    }
    if (colIndex < rowLength-1){
      // below-right
      neighbours.push([rowIndex+1, colIndex+1]);
    }
  }
  // add left and right neighbours 
  if (colIndex > 0){
    // left
    neighbours.push([rowIndex, colIndex-1]);
  }
  if (colIndex < rowLength-1){
    // right
    neighbours.push([rowIndex, colIndex+1]);
  }
  return processNeighbours(neighbours, tdArr);
}

twoDArr.forEach((row, rowIndex) => {
  let numberInRow = '';
  let numberInRowGearRecord = new Set();
  let isPartNumber = false;
  row.forEach((val, colIndex) => {
    // is that row/col entry a digit?
    if(/\d/.test(val)){
      // add the digit to a row number
      numberInRow = numberInRow.concat(val);
      // check for a partNumber
      if(!isPartNumber){
        const [isPartNumberCalculated, adjacentGearPositions] = checkPartNumber(rowIndex, colIndex, row.length, twoDArr);
        isPartNumber = isPartNumberCalculated;
        
        if(adjacentGearPositions.size > 0){
          // update the current gear record for the current numberInRow
          numberInRowGearRecord = numberInRowGearRecord.union(adjacentGearPositions);
        }
      }
      // check if the digit is in the last col in the row
      if(colIndex === row.length-1 && isPartNumber){
        partNumbers.push(Number(numberInRow));

        // also update the main gearRecord map for this numberInRow
        if(numberInRowGearRecord.size > 0){
          numberInRowGearRecord.forEach(val => {
            gearRecord.set(val, (gearRecord.get(val) || []).concat([Number(numberInRow)]))
          })
        }
      }
    } else {
      // check when you have moved from a digit val to a non-digit val if there is a partNumber now ready to be recorded. 
      // NB see also the check above if the digit is in the last column in the row.
      if (numberInRow !== '' && isPartNumber){
        // add any part number to the array
        partNumbers.push(Number(numberInRow));

        // also update the main gearRecord map for this numberInRow
        if(numberInRowGearRecord.size > 0){
          numberInRowGearRecord.forEach(val => {
            gearRecord.set(val, (gearRecord.get(val) || []).concat([Number(numberInRow)]))
          })
        }
      }
      // reset flags
      numberInRow = '';
      numberInRowGearRecord = new Set();
      isPartNumber = false;
    }
  })
})

const sumPartNumbers = partNumbers.reduce((curr, next) => curr + next, 0 );
const sumGearRatios = Array.from(gearRecord.values()).filter(arr => arr.length === 2).reduce((c, n) => c + (n[0] * n[1]), 0);

// console.log('>> twoDArr', twoDArr);
// console.log('>> partNumbers', partNumbers, partNumbers.length);
console.log('>> sumPartNumbers',sumPartNumbers);
// console.log('>> gearRecord', gearRecord);
console.log('>> sumGearRatios', sumGearRatios);