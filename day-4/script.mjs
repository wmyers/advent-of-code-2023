// Advent of Code - Day 04
import { readFileSync } from "node:fs";

// Read the file
const parseFile = filename => {
  const fileInput = readFileSync(filename).toString();
  const fileInputArray = fileInput.split('\n').filter(line => line.length > 0);
  return fileInputArray;
}

// Puzzle 01 - Check entries and return final score 
const checkEntries = fileInputArray => {
  let total = 0;

  // Iterate through each Card
  fileInputArray.map(line => {
    // Remove card number and split winning numbers and entries
    const [winningNumbersString, entryNumbersString] = line.split(': ')[1].split('|');    
    const winningNumbers = winningNumbersString.match(/\d+/g);      // Convert to an array of winning numbers
    const entryNumbers = entryNumbersString.match(/\d+/g);          // Convert to an array of entry numbers
  
    // Check each of the entry numbers against the winning numbers producing a 1 if matched, then sum these 1's
    const numWinningEntries = entryNumbers.map(n => winningNumbers.includes(n) ? 1 : 0).reduce((a, b) => a + b);

    // Total is incremented by 2^(Matching entries - 1)
    total += numWinningEntries > 0 ? Math.pow(2, numWinningEntries - 1) : 0;
  });  

  return total;
}

const setOrIncrementCardCount = (mapObj, key, val) => {
  if (mapObj.has(key)) {
    mapObj.set(key, mapObj.get(key) + val);
  } else {
    mapObj.set(key, val);
  }
}

// Puzzle 02 - Check entries, duplicate cards and return number of scratchcards
const calculateTotalCards = fileInputArray => {
  let total = 0;
  let finalScratchcardsMap = new Map();     // Map to store the count of each scratchcard

  // Iterate through each Card
  fileInputArray.map((line, index) => {
    setOrIncrementCardCount(finalScratchcardsMap, index + 1, 1)

    // Remove card number and split winning numbers and entries
    const [winningNumbersString, entryNumbersString] = line.split(': ')[1].split('|');    
    const winningNumbers = winningNumbersString.match(/\d+/g);      // Convert to an array of winning numbers
    const entryNumbers = entryNumbersString.match(/\d+/g);          // Convert to an array of entry numbers
  
    // Check each of the entry numbers against the winning numbers producing a 1 if matched, then sum these 1's
    const numWinningEntries = entryNumbers.map(n => winningNumbers.includes(n) ? 1 : 0).reduce((a, b) => a + b);

    if (numWinningEntries > 0) {
      // Increment the card count for each subsequent scratchcard
      for (let i = 1; i <= numWinningEntries; i++) {
        setOrIncrementCardCount(finalScratchcardsMap, index + 1 + i, 1 * finalScratchcardsMap.get(index + 1));
      }
    }
  });  

  // Sum the total of all scratchcards and return
  total = Array.from(finalScratchcardsMap.values()).reduce((a, b) => a + b);
  return total;
}

// Main
const main = () => {
  const filename = process.argv[2];
  const fileInputArray = parseFile(filename);
  const result = calculateTotalCards(fileInputArray);
  return result;
}

console.log(main());