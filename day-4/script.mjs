// Advent of Code - Day 04
import { readFileSync } from "node:fs";

// Read the file
const parseFile = filename => {
  const fileInput = readFileSync(filename).toString();
  const fileInputArray = fileInput.split('\n').filter(line => line.length > 0);
  return fileInputArray;
}

// Check entries and return final score 
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

// Main
const main = () => {
  const filename = process.argv[2];
  const fileInputArray = parseFile(filename);
  const result = checkEntries(fileInputArray);
  return result;
}

console.log(main());