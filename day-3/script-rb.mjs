// Advent of Code - Day 03 - RB
import { readFileSync } from "node:fs";

// Read the file
const parseFile = filename => {
    const fileInput = readFileSync(filename).toString();
    const fileInputArray = fileInput.split('\n').filter(line => line.length > 0);
    return fileInputArray;
}

// Process the input text to check for gear parts
const checkInputGearParts = textInput => {
    let total = 0;

    textInput.forEach((line, lineNumber) => {
        let workingLine = line;
        let currentNumberStartingPosition = 0;
        // Extract numbers from line
        let number = workingLine.match(/\d+/) ? workingLine.match(/\d+/)[0] : null;
        
        // If there are numbers in the current line then find
        // starting position and length of it
        while (number) {
            currentNumberStartingPosition += workingLine.indexOf(number);
            const numberLength = number.length;

            workingLine = workingLine.substring(workingLine.indexOf(number) + number.length);
            const gearCheck = checkGearPart(textInput, lineNumber, currentNumberStartingPosition, numberLength);
            currentNumberStartingPosition += numberLength;

            if (gearCheck) total += parseInt(number);

            number = workingLine.match(/\d+/) ? workingLine.match(/\d+/)[0] : null;
        }
    });

    return total;
}

const checkGearPart = (textInput, lineNumber, startPosition, numberLength) => {
    const numberRows = textInput.length;
    const numberColumns = textInput[0].length;
    const endBoundsCheckRow = numberRows - 1;
    const endBoundsCheckColumn = numberColumns - 1;
    
    let linesToCheck = [];
    let gearPart = false;

    // Retrieve previous line string to check
    if (lineNumber > 0) {
        linesToCheck.push(textInput[Math.max(lineNumber - 1, 0)].substring(Math.max(0, startPosition - 1), Math.min(startPosition + numberLength + 1, endBoundsCheckColumn + 1)));
    }

    // Retrieve next line string to check
    if (lineNumber < endBoundsCheckRow) {
        linesToCheck.push(textInput[Math.max(lineNumber + 1, 0)].substring(Math.max(0, startPosition - 1), Math.min(startPosition + numberLength + 1, endBoundsCheckColumn + 1)));
    }

    // Retrieve characters on current line
    linesToCheck.push(textInput[lineNumber].substring(Math.max(0, startPosition - 1), Math.min(startPosition + numberLength + 1, endBoundsCheckColumn + 1)));

    // Check if there is a special character any of the lines to check
    linesToCheck.map(line => { if (/[^\d.]/.test(line)) { gearPart = true } });

    return gearPart;
};


// MAIN
const main = () => {
    const textInput = parseFile(process.argv[2]);
    const result = checkInputGearParts(textInput);
    console.log(`Result: ${result}`);
}

main();