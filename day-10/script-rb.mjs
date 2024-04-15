// Advent of Code - Day 10 - RB
import SimpleGrid from "./simple-grid.js";
import { readFileSync } from 'node:fs';

const isStartPosition = value => value === 'S';

const solvePuzzles = puzzleGrid => {
    const startingCell = puzzleGrid.findAll(isStartPosition);
    console.log(startingCell);
}

// MAIN
const main = () => {
    const filename = process.argv[2];
    const puzzleGrid = new SimpleGrid({ data: readFileSync(filename).toString() });

    const puzzleResults = solvePuzzles(puzzleGrid);
    // console.log(`Puzzle One Result: ${puzzleResults[0]}`);
    // console.log(`Puzzle Two Result: ${puzzleResults[1]}`);
}

main();