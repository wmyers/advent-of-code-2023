// Advent of Code - Day 06 - RB
import fs from "node:fs";

// Time:      7  15   30
// Distance:  9  40  200

const fileInput = fs.readFileSync(process.argv[2]).toString().split('\n');
const raceTimes = fileInput[0].split(':')[1].match(/\d+/g).map(Number);
const distances = fileInput[1].split(':')[1].match(/\d+/g).map(Number);

const waysToWin = [];
const result = 0;

raceTimes.forEach((raceTime, index) => {
    let distancesTravelled = new Array(raceTime - 1);
    for (let timeButtonPressed = 1; timeButtonPressed < raceTime; timeButtonPressed++) {
        distancesTravelled[timeButtonPressed - 1] = timeButtonPressed * (raceTime - timeButtonPressed);
    }
    waysToWin.push(distancesTravelled.filter(distanceTravelled => distanceTravelled > distances[index]).length);
});

console.log(waysToWin.reduce((a, b) => a * b));