import {readFileSync} from 'node:fs';

const file = process.argv[2];
const input = readFileSync(file).toString();
const inputArr = input.split('\n').filter(line => line.length > 0);

const getConcatenatedFirstAndLastNumbersFromLine = (line) => {
  const digitsInLine = line.match(/\d/g);
  return Number(`${digitsInLine[0]}${digitsInLine.at(-1)}`);  
}

const foo = inputArr.map(line => getConcatenatedFirstAndLastNumbersFromLine(line)).reduce((c, n) => c + n);
console.log(foo);


