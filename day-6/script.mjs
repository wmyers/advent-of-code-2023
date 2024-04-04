// Advent of Code - Day 06 - RB
import fs from "node:fs";

// Function which does the actual calculation of the number of ways to win the race
// given an array of the race times and distance to exceed
const calculateWaysToWin = (raceTimes, distances) => {
    const waysToWin = [];

    raceTimes.forEach((raceTime, index) => {
        let distancesTravelled = new Array(raceTime - 1);
        for (let timeButtonPressed = 1; timeButtonPressed < raceTime; timeButtonPressed++) {
            distancesTravelled[timeButtonPressed - 1] = timeButtonPressed * (raceTime - timeButtonPressed);
        }
        waysToWin.push(distancesTravelled.filter(distanceTravelled => distanceTravelled > distances[index]).length);
    });

    return waysToWin;
}

// Function to calculate the answers for puzzle one and puzzle two
const calculateAnswers = (raceTimes, distances) => {
    const waysToWinPuzzleOne = calculateWaysToWin(raceTimes, distances);
    const puzzleOneAnswer = waysToWinPuzzleOne.reduce((a, b) => a * b);

    const puzzleTwoRaceTime = Number(raceTimes.reduce((a, b) => String(a).concat(b)));
    const puzzleTwoRaceDistance = Number(distances.reduce((a, b) => String(a).concat(b)));

    const waysToWinPuzzleTwo = calculateWaysToWin([puzzleTwoRaceTime], [puzzleTwoRaceDistance]);
    const puzzleTwoAnswer = waysToWinPuzzleTwo[0];

    return [puzzleOneAnswer, puzzleTwoAnswer];
}

// Main function
const main = () => {
    let puzzleOneAnswer, puzzleTwoAnswer;

    // Parse the simple input file 
    const fileInput = fs.readFileSync(process.argv[2]).toString().split('\n');
    const raceTimes = fileInput[0].split(':')[1].match(/\d+/g).map(Number);
    const distances = fileInput[1].split(':')[1].match(/\d+/g).map(Number);
    
    [puzzleOneAnswer, puzzleTwoAnswer] = calculateAnswers(raceTimes, distances);
    console.log(`Puzzle One Answer: ${puzzleOneAnswer}`);
    console.log(`Puzzle Two Answer: ${puzzleTwoAnswer}`);
}

main();