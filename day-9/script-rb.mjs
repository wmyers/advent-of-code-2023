import fs, { read } from 'node:fs';

const calculateNextNumberPuzzleOne = readings => {
    let nextNumber = 0;
    let allReadings = calculateAllStepsPuzzleOne(readings);

    for (let j = 0; j < allReadings.length; j++) {
        nextNumber += allReadings[j].at(-1);
    }

    return nextNumber;
}

const calculateAllStepsPuzzleOne = readings => {
    let nextReadings = [];
    
    for (let i = 1; i < readings.at(-1).length; i++) {
        nextReadings.push(readings.at(-1)[i] - readings.at(-1)[i - 1]);
    };

    readings.push(nextReadings);

    if (nextReadings.filter(number => number !== 0).length > 0) {
        readings = calculateAllStepsPuzzleOne(readings);
    } 

    return readings;
}

const main = () => {
    let puzzleOneResult = 0;
    let puzzleTwoResult = 0;
    const reportData = fs.readFileSync(process.argv[2]).toString().split('\n');

    reportData.map(row => {
        let thisRowAnswer = calculateNextNumberPuzzleOne([row.split(' ').map(Number)]);
        puzzleOneResult += thisRowAnswer;
    });
    
    
    console.log(`Puzzle One: ${puzzleOneResult}, Puzzle Two: ${puzzleTwoResult}`);
}

main();