// AoC - Day 02
// Before the call
// 1. Start VS Code
// 2. Active coder - Create a new directory for today's puzzle
// 3. Read the puzzle description
// 4. Start pairing!

import { readFileSync } from "node:fs";

const filename = process.argv[2];
const fileInput = readFileSync(filename).toString();
const fileInputArray = fileInput.split('\n').filter(line => line.length > 0);

const preProcessFileArray = (file) => {
    const fileInputMap = new Map();

    file.forEach(line => {
        // Retrieve key
        const gameNumber = Number(line.substring(line.indexOf(' ') + 1, line.indexOf(':')));
        // console.log(gameNumber);

        // Calculate largest occurrence of each colour
        const gameColourOccurrences = line.substring(line.indexOf(':') + 2).split(';');
        let blueMax = 0;
        let redMax = 0;
        let greenMax = 0;

        gameColourOccurrences.forEach(game => {
            // Split colours
            const singleGameColours = game.split(',');

            singleGameColours.forEach(sg => {
                // console.log(sg);
                const num = Number(sg.match(/\d+/)[0]);
                // console.log(num);

                if (sg.indexOf('blue') > 0) {
                    blueMax = num > blueMax ? num : blueMax;
                } else if (sg.indexOf('red') > 0) {
                    redMax = num > redMax ? num : redMax;
                } else if (sg.indexOf('green') > 0) {
                    greenMax = num > greenMax ? num : greenMax;          
                }
            });
        });

        fileInputMap.set(gameNumber, [redMax, greenMax, blueMax]);
    });    

    return fileInputMap;
}

const validateGames = (gameInputMap) => {
    let result = 0;

    gameInputMap.forEach((v, k) => {
        if (v[0] <= 12 && v[1] <= 13 && v[2] <= 14) {
            result += k;
        }
    });

    return result;
}


const fileInputMap = preProcessFileArray(fileInputArray);
const total = validateGames(fileInputMap);
console.log(total);
