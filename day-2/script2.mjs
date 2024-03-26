import { readFileSync } from "node:fs";

const filename = process.argv[2];
const fileInput = readFileSync(filename).toString();
const fileInputArray = fileInput.split('\n').filter(line => line.length > 0);
const colours = ['red', 'green', 'blue'];

const generateMap = (fileArray) => {
    return new Map(
        fileArray.map(line => {
            const gameNumber = Number(line.match(/\d+/)[0]);
            const gameColourOccurrences = line.split(':')[1].split(';').reduce((curr, next) => {
                colours.forEach(colour => {
                    const pattern = `(\\d+)\\s+${colour}`;
                    const result = new RegExp(pattern).exec(next);
                    const nextColourVal = Number(result?.[1] || 0);
                    const prevColourVal = curr.get(colour);
                    curr.set(colour, Math.max(nextColourVal, prevColourVal));
                });
                return curr;
            }, new Map(colours.map(col => [col, 0])));
            return [gameNumber, gameColourOccurrences]
        })
    );
}

const sumPlayableGames = (gameInputMap) => {
    let result = 0;
    gameInputMap.forEach((v, k) => {
        if (v.get('red') <= 12 && v.get('green') <= 13 && v.get('blue') <= 14) {
            result += k;
        }
    });
    return result;
}

const sumPowerMinimumSets = (gameInputMap) => {
  return Array.from(gameInputMap.values()).reduce((curr, valMap) => {
      const power =  valMap.get('red') * valMap.get('green') * valMap.get('blue');
      return curr + power;
  }, 0);
}

// console.log(sumPlayableGames(generateMap(fileInputArray)));
console.log(sumPowerMinimumSets(generateMap(fileInputArray)));
// console.log(generateMap(fileInputArray));