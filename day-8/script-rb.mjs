// Advent of Code - Day 08 - RB
import fs from "node:fs";
import { start } from "node:repl";

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

const processNodeQueue = (instx, nodeQueue, nodeMap) => {
    let nextNodeQueue = [];
    let allNodesEnd = true;

    nodeQueue.map(node => {
        let nextNode = instx === 'L' ? nodeMap.get(node)[0] : nodeMap.get(node)[1];
        nextNodeQueue.push(nextNode);

        if (!nextNode.endsWith('Z')) {
            allNodesEnd = false;
        } else {
            console.log(`One path ended: ${nextNode}`);
        }
    }); 

    return allNodesEnd ? [] : nextNodeQueue;
}

const findGhostSolution = (instxString, nodeMap) => {
    const instxStringOriginal = instxString;
    let stepCount = 0;
    let nodeQueue = Array.from(nodeMap.keys()).filter(node => node.endsWith('A'));

    while (nodeQueue.length > 0) {
        console.log(`Step ${stepCount}: NodeQueue: ${nodeQueue}`);
        nodeQueue = processNodeQueue(instxString[0], nodeQueue, nodeMap);
        instxString = instxString.length > 1 ? instxString.slice(1) : instxStringOriginal;
        stepCount++;
    }

    return stepCount;
}

const main = () => {
    const fileInput = fs.readFileSync(process.argv[2]).toString().split('\n');
    const instxString = fileInput[0];
    const nodeMap = readNodes(fileInput.slice(2));
    
    // const result = findSolution(instxString, nodeMap);
    // console.log(`Puzzle 1: Number of steps from AAA to ZZZ: ${result}`);

    const ghostResult = findGhostSolution(instxString, nodeMap);
    console.log(`Puzzle 2: Number of steps from Starting nodes to ZZZ: ${ghostResult}`);
}

main();
