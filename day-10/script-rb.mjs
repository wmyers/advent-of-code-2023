// Advent of Code - Day 10 - RB
import SimpleGrid from "./simple-grid.js";
import { readFileSync } from 'node:fs';

const isStartPosition = value => value === 'S';

// Direction movement 
const DIRECTIONS = {
    NORTH: [-1, 0],
    EAST: [0, 1],
    SOUTH: [1, 0],
    WEST: [0, -1],
}

// Valid entry points for each type of pipe
const VALID_ENTRY = {
    NORTH: ['|', '7', 'F'],
    EAST: ['-', 'J', '7'],
    SOUTH: ['|', 'L', 'J'],
    WEST: ['-', 'L', 'F'],
}

// Valid connections from each type of pipe
const validPipeConnections = {
    '|': [DIRECTIONS.NORTH, DIRECTIONS.SOUTH],
    '-': [DIRECTIONS.EAST, DIRECTIONS.WEST],
    'L': [DIRECTIONS.NORTH, DIRECTIONS.EAST],
    'J': [DIRECTIONS.NORTH, DIRECTIONS.WEST],
    '7': [DIRECTIONS.SOUTH, DIRECTIONS.WEST],
    'F': [DIRECTIONS.EAST, DIRECTIONS.SOUTH],
    'S': [DIRECTIONS.NORTH, VALID_ENTRY.EAST, VALID_ENTRY.SOUTH, VALID_ENTRY.WEST],
}

// Valid pipe transitions
const validPipeTransitions = {
    '|': [VALID_ENTRY.NORTH, [], VALID_ENTRY.SOUTH, [], ['S']],
    '-': [[], VALID_ENTRY.EAST, [], VALID_ENTRY.WEST, ['S']],
    'L': [VALID_ENTRY.NORTH, VALID_ENTRY.EAST, [], [], ['S']],
    'J': [VALID_ENTRY.NORTH, [], [], VALID_ENTRY.WEST, ['S']],
    '7': [[], [], VALID_ENTRY.SOUTH, VALID_ENTRY.WEST, ['S']],
    'F': [[], VALID_ENTRY.EAST, VALID_ENTRY.SOUTH, [], ['S']],
    'S': [VALID_ENTRY.NORTH, VALID_ENTRY.EAST, VALID_ENTRY.SOUTH, VALID_ENTRY.WEST, ['S']],
}

const isValidPosition = (currentVal, nextVal) => {
    const validMappings = validPipeTransitions[currentVal];
    let validPosition = false;

    validMappings.map(mapping => {
        if (mapping.includes(nextVal)) {
            validPosition = true;
        }
    });

    return validPosition;
}

const findValidNextPosition = (puzzleGrid, previousRow, previousCol, thisRow, thisCol) => {
    const currentVal = puzzleGrid.get(thisRow, thisCol);
    let allDirections = [];
    let allValidDirections = [];
    let foundValidNextPosition = false;
    let nextValidPosition = {};

    if (currentVal === 'S') {
        allDirections = [DIRECTIONS.NORTH, DIRECTIONS.EAST, DIRECTIONS.SOUTH, DIRECTIONS.WEST];
    } else {
        allDirections = validPipeConnections[currentVal];
    }

    allDirections.map(direction => {
        if (puzzleGrid.inBounds(thisRow + direction[0], thisCol + direction[1])) {
            allValidDirections.push(direction);
        }
    })

    while (!foundValidNextPosition) {
        for (let i = 0; i < allValidDirections.length; i++) {
            let newRow = thisRow + allValidDirections[i][0];
            let newCol = thisCol + allValidDirections[i][1];
            let nextVal = puzzleGrid.get(newRow, newCol);
    
            if (!(previousRow === newRow && previousCol === newCol) && isValidPosition(currentVal, nextVal)) {
                nextValidPosition = {
                    nextVal, 
                    newRow, 
                    newCol,
                };
                foundValidNextPosition = true;
                break;
            }
    
        }
    }

    return nextValidPosition;
}

const solvePuzzles = puzzleGrid => {
    const startingCell = puzzleGrid.coordsOf('S');
    let currentRow = startingCell.r;
    let currentCol = startingCell.c;
    let inProgress = true;
    let stepCount = 1;
    let previousRow = -1;
    let previousCol = -1; 

    while (inProgress) {
        const nextPositionDetails = findValidNextPosition(puzzleGrid, previousRow, previousCol, currentRow, currentCol);
        if (nextPositionDetails.nextVal !== 'S') {
            stepCount++;
            previousRow = currentRow;
            previousCol = currentCol;         
            currentRow = nextPositionDetails.newRow;
            currentCol = nextPositionDetails.newCol;
        } else {
           inProgress = false; 
        }
    
    }

    return [stepCount / 2, 0];
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