// Advent of Code - Day 08 - RB
import fs from "node:fs";

const readNodes = (nodeData) => {
    const nodeMap = new Map();

    nodeData.map(node => {
        const nodeName = node.split(' ')[0];
        const nodeLeft = node.split(' ')[2].slice(1, -1);
        const nodeRight = node.split(' ')[3].slice(0, -1);
        nodeMap.set(nodeName, [nodeLeft, nodeRight]);
    });

    return nodeMap;
}

const findSolution = (instxString, nodeMap) => {
    const instxStringOriginal = instxString;
    let stepCount = 0;
    let currentNode = 'AAA';
    let currentNodePaths = nodeMap.get('AAA');
    
    while (currentNode !== 'ZZZ') {
        currentNode = instxString[0] === 'L' ? currentNodePaths[0] : currentNodePaths[1];
        currentNodePaths = nodeMap.get(currentNode);
        instxString = instxString.length > 1 ? instxString.slice(1) : instxStringOriginal;
        stepCount++;
    }

    return stepCount;
}

const main = () => {
    const fileInput = fs.readFileSync(process.argv[2]).toString().split('\n');
    const instxString = fileInput[0];
    const nodeMap = readNodes(fileInput.slice(2));
    const result = findSolution(instxString, nodeMap);

    console.log(`Number of steps from AAA to ZZZ: ${result}`);
}

main();
