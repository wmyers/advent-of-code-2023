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

const gcd = (a, b) => b == 0 ? a : gcd (b, a % b);
const lcm = (a, b) =>  a / gcd (a, b) * b;
const lcmAll = (ns) => ns .reduce (lcm, 1);

const processNextInstx = (ghostTracker, nodeMap) => {
    let allNodesEnd = true;
    let nextNodes = '';

    ghostTracker.map(ghost => {
        if (!ghost.foundExit) {
            ghost.currentNode = ghost.instx[0] === 'L' ? nodeMap.get(ghost.currentNode)[0] : nodeMap.get(ghost.currentNode)[1];
            ghost.pathTravelled = ghost.pathTravelled.concat(ghost.instx[0]);
            ghost.instx = ghost.instx.slice(1)
            ghost.solutionSteps++;
    
            if (ghost.currentNode.endsWith('Z')) {
                ghost.foundExit = true;
                ghost.instx = ghost.pathTravelled;
                ghost.pathTravelled = '';
            } else {
                allNodesEnd = false;
    
                if (ghost.instx.length === 0) {
                    ghost.instx = ghost.pathTravelled;
                    ghost.pathTravelled = '';
                }    
            }    
        }

        nextNodes = `${nextNodes} ${ghost.currentNode} `;
    }); 

    console.log(nextNodes);
    return ghostTracker.filter(ghost => ghost.foundExit !== true).length > 0 ? false : true;
}

const calcLowestFactor = ghostTracker => {
    const ghostSteps = ghostTracker.map(ghost => ghost.solutionSteps);
    const lowestMultiple = lcmAll(ghostSteps);
    return lowestMultiple;
}

const findGhostSolution = (instxString, nodeMap) => {
    let solutionFound = false;
    let stepCount = 0;
    let nodeQueue = Array.from(nodeMap.keys()).filter(node => node.endsWith('A'));
    let ghostTracker = [];
    let result = 0;
    
    nodeQueue.forEach((node, index) => {
        ghostTracker.push({
            currentNode: node,
            instx: instxString,
            pathTravelled: '',
            foundExit: false,
            solutionSteps: 0,
        });
    });

    while (!solutionFound) {        
        solutionFound = processNextInstx(ghostTracker, nodeMap);
        stepCount++;
    }

    result = calcLowestFactor(ghostTracker);
    return result;
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
