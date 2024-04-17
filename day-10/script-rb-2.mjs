import SimpleGrid from './simple-grid.js';
import { readFileSync } from 'node:fs';

const Direction = {
    NORTH: { r: -1, c: 0 },
    EAST: { r: 0, c: 1 },
    SOUTH: { r: 1, c: 0 },
    WEST: { r: 0, c: -1 },
};

Direction.NORTH.opposite = Direction.SOUTH;
Direction.EAST.opposite = Direction.WEST;
Direction.SOUTH.opposite = Direction.NORTH;
Direction.WEST.opposite = Direction.EAST;

const Directions = [ Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST ];

const Pipes = {
    '|': [ Direction.NORTH, Direction.SOUTH ],
    '-': [ Direction.WEST, Direction.EAST ],
    'L': [ Direction.NORTH, Direction.EAST ],
    'J': [ Direction.NORTH, Direction.WEST ],
    '7': [ Direction.WEST, Direction.SOUTH ],
    'F': [ Direction.EAST, Direction.SOUTH ],
};

class PipeGrid extends SimpleGrid {
    #start;

    /** 
     * Parses the grid into our grid.
     * 
     * @param {string} input - the puzzle input
     */
    constructor(input) {
        super({ data: input });
        this.#detectStartPipe();
    }

    /**
     * Determine which cell is the furthest from the starting cell following the pipeline loop, and
     * returns the distance to that cell.
     * 
     * @returns {number} - the distance to the furthest cell
     */
    seekFurthestDistance() {
        const queue = [ { coords: this.#start, distance: 0 }];
        let last;

        while (queue.length) {
            const entry = queue.shift();
            let { coords, distance } = entry;
            const pipe = this.get(coords.r, coords.c);

            if (typeof(pipe) === 'object') {
                continue;
            }

            this.set(coords.r, coords.c, { pipe });
            last = entry;
            distance++;
            Pipes[pipe].forEach(direction => {
                const newCoords = { r: coords.r + direction.r, c: coords.c + direction.c };
                queue.push({
                    coords: newCoords,
                    distance,
                });
            });
        }

        return last.distance;
    }

    /**
     * Counts how many cells are within the pipeline loop.
     * 
     * @returns {number} - the number of enclosed cells
     */
    countEnclosed() {
        let enclosed = 0;

        for (let r = 0; r < this.rows; r++) {
            let inside = { north: false, south: false };

            for (let c = 0; c < this.cols; c++) {
                const cell = this.get(r, c);
                
                if (typeof cell === 'object') {
                    const directions = Pipes[cell.pipe];

                    if (directions.includes(Direction.NORTH)) {
                        inside.north = !inside.north;
                    }

                    if (directions.includes(Direction.SOUTH)) {
                        inside.south = !inside.south;
                    }

                } else if ((inside.north && inside.south)) {
                    enclosed++;
                }
            }
        }

        return enclosed;
    }

    /**
     * Locates the starting pipe and determines its shape.
     */
    #detectStartPipe() {
        let { r, c } = this.coordsOf('S');
        const connections = Directions.reduce((connections, direction) => {
            const adjacent = this.get(r + direction.r, c + direction.c);
            const adjacentDirections = Pipes[adjacent];

            if (!adjacentDirections) {
                return connections;
            }

            if (adjacentDirections.includes(direction.opposite)) {
                connections.push(direction);
            }

            return connections;
        }, []);
        const [ pipe ] = Object.entries(Pipes).find(( [ , directions ]) => {
            return directions.every(
                direction => connections.includes(direction)
            );
        });
        this.set(r, c, pipe);
        this.#start = { r, c };
    }
}

const main = () => {
    const filename = process.argv[2];
    const puzzleGrid = new PipeGrid(readFileSync(filename).toString());

    const puzzleOneAnswer = puzzleGrid.seekFurthestDistance();
    console.log(puzzleOneAnswer);

    const puzzleTwoAnswer = puzzleGrid.countEnclosed();
    console.log(puzzleTwoAnswer);
};

main();

