let COLS = 30;
let ROWS = 30;
let grid = new Array(COLS)
let w, h;

let open = [];
let closed = [];

let start;
let end;
let current;
let path = [];

let resetButton;
let startButton;

let running = true;

function removeElement(array, element) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === element) {
            array.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    let d = dist(a.i, a.j, b.i, b.j);
    // let d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

function resetGrid() {

    w = width / COLS;
    h = height / ROWS;
    grid = [];
    open = [];
    closed = [];
    for (let i = 0; i < COLS; i++) {
        grid[i] = new Array(ROWS);
        for (let j = 0; j < ROWS; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }
    start = grid[0][0];
    end = grid[COLS - 1][ROWS - 1];
    start.wall = false;
    end.wall = false;
    open.push(start);
}

function setup() {
    createCanvas(800, 800)

    resetButton = createButton("Reset");
    resetButton.position(10, 810);
    resetButton.mousePressed(function() {
        console.log("reset")
        resetGrid();
        setTimeout(() => running = false, 10)
    });
    startButton = createButton("Start");
    startButton.position(80, 810);
    startButton.mousePressed(function() {
        console.log("start")
        running = true;
    });
    pauseButton = createButton("Pause");
    pauseButton.position(140, 810);
    pauseButton.mousePressed(function() {
        console.log("pause")
        running = false;
    });
    resetGrid();
}

function draw() {
    if (running) {
        if (open.length > 0) {
            let lowestIndex = 0;
            for (let i = 0; i < open.length; i++) {
                if (open[i].f < open[lowestIndex].f) {
                    lowestIndex = i;
                }
            }
            current = open[lowestIndex];
    
            if (current === end) {
                // find the path
                noLoop();
            }
            removeElement(open, current);
            closed.push(current);
    
            let neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                if (!closed.includes(neighbor) && !neighbor.wall) {
                    // make sure we haven't closed it
                    let tempG = current.g + heuristic(neighbor, current);
                    let newPath = false;
                    if (open.includes(neighbor)) {
                        // have we evaluated this before?
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    }
                    else {
                        neighbor.g = tempG;
                        newPath = true;
                        open.push(neighbor);
                    }
                    if (newPath) {
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }
        }
        else {
            console.log("no solution");
            noLoop();
            return;
        }
        background(255);
        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
                grid[i][j].show(color(255, 255, 255));
            }
        }
        for (let i = 0; i < closed.length; i++) {
            closed[i].show(color(255, 0, 0));
        }
        for (let i = 0; i < open.length; i++) {
            open[i].show(color(0, 255, 0));
        }
        path = [];
        let temp = current;
        path.push(temp);
        while(temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
    
        for (let i = 0; i < path.length; i++) {
            path[i].show(color(0, 0, 255));
        }
    }
}

function Spot(x, y) {
    this.i = x;
    this.j = y;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;
    if (random(1) < 0.4) this.wall = true; 
    this.addNeighbors = function(grid) {
        
        if (this.i < COLS - 1) this.neighbors.push(grid[this.i + 1][this.j])
        if (this.i > 0) this.neighbors.push(grid[this.i - 1][this.j])
        if (this.j < ROWS - 1) this.neighbors.push(grid[this.i][this.j + 1])
        if (this.j > 0) this.neighbors.push(grid[this.i][this.j - 1])
        if (this.i > 0 && this.j > 0) this.neighbors.push(grid[this.i - 1][this.j - 1]);
        if (this.i < COLS - 1 && this.j > 0) this.neighbors.push(grid[this.i + 1][this.j - 1]);
        if (this.i > 0 && this.j < ROWS - 1) this.neighbors.push(grid[this.i - 1][this.j + 1]);
        if (this.i < COLS - 1 && this.j < ROWS - 1) this.neighbors.push(grid[this.i + 1][this.j + 1]);
        
    }
    this.show = function(color) {
        

        // text(this.g.toFixed(0), this.i * w, this.j * h);
        // text(this.h.toFixed(0), this.i * w, this.j * h);
        if (this.wall) {
            fill(0);
        }
        else {
            
            fill(color);

        }
        

        rect(this.i * w, this.j * h, w, h)
        fill(0)
        textSize(10);
        text(this.f.toFixed(0), this.i * w, this.j * h + h);
        text(this.h.toFixed(0), this.i * w + w / 2, this.j * h + h);
        text(this.g.toFixed(0), this.i * w + w / 4, this.j * h + h / 2);

    }
}
