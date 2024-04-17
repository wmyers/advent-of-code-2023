import fs, { read } from 'node:fs';

const calculateNextNumberPuzzleOne = readings => {
    let nextNumber = 0;
    let allReadings = calculateAllSteps(readings);
    nextNumber = allReadings.map(reading => reading.at(-1)).reduce((a, b) => a + b)
    return nextNumber;
}

const calculateNextNumberPuzzleTwo = readings => {
    let nextNumber = 0;
    let allReadings = calculateAllSteps(readings);
    allReadings[allReadings.length - 1] = [0].concat(allReadings.at(-1));

    for (let j = allReadings.length - 2; j >= 0; j--) {
        allReadings[j] = [allReadings[j][0] - allReadings[j + 1][0]].concat(allReadings[j]);
    }

    nextNumber = allReadings[0][0];
    return nextNumber;    
}

const calculateAllSteps = readings => {
    let nextReadings = [];
    
    for (let i = 1; i < readings.at(-1).length; i++) {
        nextReadings.push(readings.at(-1)[i] - readings.at(-1)[i - 1]);
    };

    readings.push(nextReadings);

    if (nextReadings.filter(number => number !== 0).length > 0) {
        readings = calculateAllSteps(readings);
    } 

    return readings;
}

const main = () => {
    let puzzleOneResult = 0;
    let puzzleTwoResult = 0;
    let thisRowAnswer = 0;

    const reportData = fs.readFileSync(process.argv[2]).toString().split('\n');

    reportData.map(row => {
        thisRowAnswer = calculateNextNumberPuzzleOne([row.split(' ').map(Number)]);
        puzzleOneResult += thisRowAnswer;
    });
    
    reportData.map(row => {
        thisRowAnswer = calculateNextNumberPuzzleTwo([row.split(' ').map(Number)]);
        puzzleTwoResult += thisRowAnswer;
    });
    
    console.log(`Puzzle One: ${puzzleOneResult}, Puzzle Two: ${puzzleTwoResult}`);
}

main();