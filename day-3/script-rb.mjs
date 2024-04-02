// Advent of Code - Day 03 - RB
import { readFileSync } from "node:fs";
import SimpleGrid from "./simple-grid.js";

// Helper functions
const isSymbol = value => value !== '.' && (value < '0' || value > '9');
const isDigit = value => value >= '0' && value <= '9';

/**
 * Solve both parts of the puzzle
 * 
 * @param {SimpleGrid} puzzleGrid 
 * @returns {number} - the results
 */
const solvePuzzles = (puzzleGrid) => {
    const partNumberCoords = new Set();
    const gearPartCoords = [];

    // Find and loop through all the symbols in the puzzle grid
    puzzleGrid.findAll(isSymbol).forEach(({ r, c }) => {
        // Create a new set to hold the unique part numbers next to each symbol
        const partNumberCoordsForThisSymbol = new Set();

        // Check surrounding cells for digits to confirm that it is a valid symbol
        puzzleGrid.forEachNear(r, c, (value, r, c) => {
            if (isDigit(value)) {
                // Logic to retrieve the full number 
                while (c > 0 && isDigit(puzzleGrid.get(r, c - 1))) {
                    c--;
                }

                // Store the part number coordinates in the set
                partNumberCoordsForThisSymbol.add(`${r},${c}`);
            }
        });

        // If exactly two part numbers next to symbol it is a valid gear and add to the 
        // gear parts array
        if (partNumberCoordsForThisSymbol.size === 2) {
            gearPartCoords.push([ ...partNumberCoordsForThisSymbol ]);
        }

        // Add the part number coords to the master set
        partNumberCoordsForThisSymbol.forEach(coords => partNumberCoords.add(coords));
    });

    // Extract the valid part numbers into a new array
    const partNumbers = [ ...partNumberCoords ].map((coords) => coordsToPartNumber(puzzleGrid, coords));

    // Using the locations of the gear part numbers, extract and multiply them to 
    // compute the gear ratios.
    const gearRatios = gearPartCoords.map(([ coords1, coords2 ]) => {
        return coordsToPartNumber(puzzleGrid, coords1) * coordsToPartNumber(puzzleGrid, coords2);
    });

    // Puzzle 01 - Return the sum of the part numbers
    // Puzzle 02 - Return the sum of the gear ratios
    return [partNumbers.reduce((a, b) => a + b), gearRatios.reduce((a, b) => a + b)];
}

// Obtain the part number at the coordinates given
const coordsToPartNumber = (puzzleGrid, coords) => {
    let [ r, c ] = coords.split(',').map(Number);
    let value = 0;
    let cell = puzzleGrid.get(r,c);

    do {
      value = value * 10 + Number(cell);

      c++;
      if (r < 0 || r > puzzleGrid.rows || c < 0 || c > puzzleGrid.cols) {
        break;
      }

      cell = puzzleGrid.get(r,c);
    } while (isDigit(cell));

    return value;    
}

// MAIN
const main = () => {
    const filename = process.argv[2];
    const puzzleGrid = new SimpleGrid({ data: readFileSync(filename).toString() });

    const puzzleResults = solvePuzzles(puzzleGrid);
    console.log(`Puzzle One Result: ${puzzleResults[0]}`);
    console.log(`Puzzle Two Result: ${puzzleResults[1]}`);
}

main();