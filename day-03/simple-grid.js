class SimpleGrid {
    #rows
    #cols
    #grid

    /**
     * Creates a new `SimpleGrid` instance.
     * 
     * Options:
     * 
     * * -  `data` (`string`): Data with which to populate the grid. Carriage returns will be stripped 
     *      first. If it contains one or more instances of the separator character, the data will be 
     *      split into rows on those characters.
     * * -  `separator` (`string`, default = `'\n`): If this character is found in the string, it will
     *      be used as the row separator. If the `data` string ends with this character, it will be
     *      stripped off. 
     * 
     * @param {*} options - the options object
     */    

    constructor(options) {
        options = {
            separator: `\n`,
            ...options,
        }

        if ('data' in options) {
            this.#populateGrid(options);
        }
    }

    // Provide simple getter functions for number of columns and rows
    get rows() {
        return this.#rows;
    }

    get cols() {
        return this.#cols
    }

    // Check if a given cell is in bounds in this grid
    inBounds(r, c) {
        return r >= 0 & r <= this.#rows - 1 && c >= 0 && c <= this.#cols;
    }

    // Return the value stored at a specific set of coordinates
    get(r, c) {
        return this.#grid[this.getIndex(r, c)];
    }

    /**
    * Returns the index of `#grid` corresponding to the given location.
    * @param {number} r - the row
    * @param {number} c - the column
    * @returns {number} - the index
    */
    getIndex(r, c) {
        if (!this.inBounds(r, c)) {
            throw new Error(`${r}, ${c} is out of bounds`);
        }

        return r * this.#cols + c;
    }

    /**
     * Returns all values in the grid that fulfill the given predicate. The predicate receives three
     * arguments:
     * 
     * - `value` (`any`): The found value
     * - `r` (`number`): The row index
     * - `c` (`number`): The column index
     * 
     * Each element in the returned array is an object with properties matching the predicate arguments.
     * 
     * @param {Function} predicate - the filter
     * @returns {Array<Object>} - the results
     */
    findAll(predicate) {
        const results = [];
        this.forEach((value, r, c) => {
            if (predicate(value, r, c)) {
                results.push({ value, r, c });
            }
        });

        return results;
    }

    /** 
     * Iterates all values in the grid, in row-major order, invoking `callback`
     * for each, passing in the value, row, column, and index.
     * 
     * @param {Function} callback - the callback function
     */
    forEach(callback) {
        for (let i = 0; i < this.#grid.length; i++) {
            const r = Math.floor(i / this.#cols);
            const c = i % this.#cols;
            callback(this.#grid[i], r, c, i);
        }
    }

    /**
     * Iterates all values in a rectangular region of the grid, where all values
     * are at least `size` cells away from the indicated location. The selected
     * region is iterated in row-major order, invoking `callback` for each,
     * passing in the value, row, column, and index. Note that the specified
     * location can be optionally included or omitted.
     * 
     * @param {number} r - the location row
     * @param {number} c - the location column
     * @param {Function} callback - the callback function
     * @param {number} [size=1] - the maximum distance from the location to include
     * @param {boolean=false} includeSelf - whether to include the specified location
     * in the iteration
     */
    forEachNear(r, c, callback, size=1, includeSelf = false) {
        const r0 = Math.max(r - size, 0);
        const r1 = Math.min(r + size, this.#rows - 1);
        const c0 = Math.max(c - size, 0);
        const c1 = Math.min(c + size, this.#cols - 1);

        for (let nr = r0; nr <= r1; nr++) {
            for (let nc = c0; nc <= c1; nc++) {
                if (r === nr && c === nc && !includeSelf) {
                    continue;
                }

                const index = this.getIndex(nr, nc);
                callback(this.#grid[index], nr, nc, index);
            }
        }
    }

    /**
     * Invoked by the constructor when the `data` option is specified.
     * @param {Object} options - the options object
     */
    #populateGrid(options) {
        // Remove carriage returns
        options.data = options.data.replace(/\r/g, '');

        // Remove the separator if it appears at the end of the data
        if (options.data.endsWith(options.separator)) {
            options.data = options.data.slice(0, -1);
        }

        // If data includes separator
        if (options.data.includes(options.separator)) {
            // Split data by separator
            const rows = options.data.split(options.separator);
            // Set the private #rows variable 
            this.#rows = rows.length;

            // Check all column lengths are equal - throw error if not
            for (let row of rows) {
                if (this.#cols === undefined) {
                    this.#cols = row.length;
                } else if (this.#cols !== row.length) {
                    throw new Error("Columns are uneven lengths");
                }
            }

            // Get rid of any newline characters left in the data and set to private #grid variable
            this.#grid = [ ...options.data.replace(/\n/g, '') ];
        }
    }
}

export default SimpleGrid;