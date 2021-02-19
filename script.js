let map, state, queue;
let origin = 0, bombs = 0, NumBombs, exposed = 0, x = 0, y = 0;
let win = false, lost = false;

//Generate HTML + CSS
let header, dropdown, button, content, link1, link2, title, main, container, reset, settings, select, option, board, popup, info, instructions, size = 8;

window.onload = function() {
    document.body.style.cssText = "margin: 0; padding: 0; background-color: #d1d1d1;";
    
    header = document.createElement('header');
    header.style.cssText = "width: 100%; height: 64px; background-color: white; box-shadow: 0 0 20px 2px black;";

    title = document.createElement('h1');
    title.style.cssText = "margin: auto; padding: 0; width: 192px; height: 64px; font-family: Arial; font-weight: bold; display: flex; align-items: center; justify-content: center;";
    title.innerHTML = "Minesweeper";
    header.appendChild(title);

    document.body.appendChild(header);

    main = document.createElement('main');
    main.style.cssText = "width: 100%;";

    container = document.createElement('div');
    container.style.cssText = "width: 100%; height: " + (window.innerHeight-64) + "px; display: grid; grid-template-columns: 1fr 128px 128px 1fr; grid-template-rows: 128px auto 128px;";

    reset = document.createElement('div');
    reset.style.cssText = "margin: auto; width: 80px; height: 40px; font-family: Arial; font-weight: bold; display: flex; align-items: center; justify-content: center; background-color: white; grid-column-start: 2;";
    reset.addEventListener("click", () => { 
        size = select.options[select.selectedIndex].value;
        Load(size); 
    });
    reset.innerHTML = "Reset";
    container.appendChild(reset);

    settings = document.createElement('form');
    settings.style.cssText = "width: 128px; height: 128px; display: flex; align-items: center; justify-content: center; grid-column-start: 3;";

    select = document.createElement('select');
    select.style.cssText = "width: 80px; height: 40px; font-size: 1em; font-weight: bold; border: none; outline: none;";
    select.addEventListener("change", () => {
        size = select.options[select.selectedIndex].value;
        Load(size);
    });

    option = document.createElement('option');
    option.value = "8";
    option.innerHTML = "Easy";
    select.appendChild(option);

    option = document.createElement('option');
    option.value = "16";
    option.innerHTML = "Normal";
    select.appendChild(option);

    option = document.createElement('option');
    option.value = "20";
    option.innerHTML = "Hard";
    select.appendChild(option);

    settings.appendChild(select);
    container.appendChild(settings);

    board = document.createElement('div');
    board.style.cssText = "margin: auto; width: 320px; height: 320px; display: flex; flex-wrap: wrap; grid-column: 1 / 5; grid-row-start: 2;box-shadow: 0 0 20px 2px black;";

    Load(size);

    popup = document.createElement('div');
    popup.style.cssText = "width: 128px; height: 128px; position: relative; display: flex; align-items: center; justify-content: center; grid-column: 1/5; grid-row: 3;";

    info = document.createElement('div');
    info.style.cssText = "width: 64px; height: 64px; font-size: 2em; display: flex; align-items: center; justify-content: center; cursor: pointer;";
    info.innerHTML = "🛈";

    instructions = document.createElement('div');
    instructions.style.cssText = "box-sizing: border-box; padding: 10px; width: 192px; display: none; position: absolute; left: 0; bottom: 100%; background-color: white; box-shadow: 0 0 20px 2px black; z-index: 1;";
    instructions.innerHTML = "How To Play:<br><br> Click on any tile to begin.<br>Right-click to flag.<br>The numbers represent the amount of bombs in a 3x3 vicinity.<br>The game is won by exposing all tiles that doesn't contain any bomb.";

    info.addEventListener("click", () => {
        if (instructions.style.display == "none") {
            instructions.style.display = "block";
        } else {
            instructions.style.display = "none";
        }        
    });

    popup.appendChild(info);
    popup.appendChild(instructions);
    container.appendChild(popup);
    main.appendChild(container);
    document.body.appendChild(main);
}

function Load(num) {
    origin = 0;
    bombs = 0;
    exposed = 0;
    win = false;
    lost = false;
    Init(num);
    map = new Array(Math.pow(num, 2));
    state = new Array(Math.pow(num, 2));
    queue = new Array();
    for (let i = 0; i < map.length; i++) {
        map[i] = 0;
        state[i] = 0;
    }
}

function Init(num) {
    board.innerHTML = "";
    let a = 320/num;
    for (let yy = 0; yy < num; yy++) {
        for (let xx = 0; xx < num; xx++) {
            let e = document.createElement('div');
            e.className = 'cell';
            e.addEventListener("click", () => {
                Show(Merge(xx, yy));
            });
            e.addEventListener("contextmenu", (event) => { 
                event.preventDefault();
                Flag(Merge(xx, yy));
            });
            e.style.cssText = "width: " + a + "px; height: " + a + "px; display: flex; align-items: center; justify-content: center;";
            if ((xx + (yy % 2)) % 2 == 1) {
                e.style.backgroundColor = "green";
            } else  {
                e.style.backgroundColor = "darkgreen";
            }
            board.appendChild(e);
        }
    }

    container.appendChild(board);
}

//Array <=> 2D Array conversion
function Split(num) {
    x = num%size;
    y = Math.floor(num/size);
}

function Merge(x, y) {
    return y*size + x;
}

let cells = document.getElementsByClassName('cell');

//Style cells
function Style(num) {
    Split(num);
    if (map[num] == 0) {
        for (let yy = y-1; yy < y+2; yy++) {
            for (let xx = x-1; xx < x+2; xx++) {
                if (xx > -1 && xx < size && yy > -1 && yy < size) {
                    if (cells[Merge(xx, yy)].style.backgroundColor == "green") {
                        cells[Merge(xx, yy)].style.backgroundColor = "darkgrey";
                    } else if (cells[Merge(xx, yy)].style.backgroundColor == "darkgreen") {
                        cells[Merge(xx, yy)].style.backgroundColor = "grey";
                    } else if (cells[Merge(xx, yy)].style.backgroundColor == "black") {
                        if ((xx + (yy % 2)) % 2 == 1) {
                            cells[Merge(xx, yy)].style.backgroundColor = "darkgrey";
                        } else  {
                            cells[Merge(xx, yy)].style.backgroundColor = "grey";
                        }
                    }
                    if (map[Merge(xx, yy)] == 0) {
                        cells[Merge(xx, yy)].innerHTML = "";
                    } else if (map[Merge(xx, yy)] < 10) {
                        cells[Merge(xx, yy)].innerHTML = map[Merge(xx, yy)];
                    } else {
                        cells[Merge(xx, yy)].innerHTML = 'X';
                        cells[Merge(xx, yy)].style.backgroundColor = "red";
                    }
                }
            }
        }
    } else {
        if (cells[num].style.backgroundColor == "green") {
            cells[num].style.backgroundColor = "darkgrey";
        } else if (cells[num].style.backgroundColor == "darkgreen") {
            cells[num].style.backgroundColor = "grey";
        } else if (cells[num].style.backgroundColor == "black") {
            if ((x + (y % 2)) % 2 == 1) {
                cells[num].style.backgroundColor = "darkgrey";
            } else {
                cells[num].style.backgroundColor = "grey";
            }
        }
        if (map[num] == 0) {
            cells[num].innerHTML = "";
        } else if (map[num] < 10) {
            cells[num].innerHTML = map[num];
        } else {
            cells[num].innerHTML = 'X';
            cells[num].style.backgroundColor = "red";
        }
    }
}

//Show cell
function Show(num) {
    if (origin == 0) {
        PlaceBombs(num);
        Numbers(); 
        origin++;
    }

    if (map[num] >= 10 && cells[num].style.backgroundColor != "black") {
        lost = true;
    } else if (map[num] == 0 && cells[num].style.backgroundColor != "black") {
        Style(num);
        state[num] = -1;
        ExposeEmpty(num);
    } else if (cells[num].style.backgroundColor != "black") {
        Style(num);
        state[num] = -1;
    }

    Check();
}

//Place bombs
function PlaceBombs(num) {
    if (size == 8) {
        NumBombs = 8;
    } else if (size == 16) {
        NumBombs = 32;
    } else if (size == 20) {
        NumBombs = 50;
    }

    while (bombs < NumBombs) {
        for (let i = 0; i < map.length; i++) {
            if (Math.ceil(Math.random()*16) == 1 && map[i] != 10 && i != num) {
                map[i] = 10;
                bombs++;
            }
            if (bombs == num) {
                break;
            }
        }
    }
}

//Place numbers
function Numbers() {
    for (let i = 0; i < map.length; i++) {
        if (map[i] >= 10) {
            Split(i);
            for (let yy = y-1; yy < y+2; yy++) {
                for (let xx = x-1; xx < x+2; xx++) {
                    if (xx > -1 && xx < size && yy > -1 && yy < size) {
                        map[Merge(xx, yy)]++;
                    }
                }
            }
        }
    }
}

//Show empty tiles
function ExposeEmpty(num) {
    Split(num);
    for (let yy = y-1; yy < y+2; yy++) {
        for (let xx = x-1; xx < x+2; xx++) {
            if (xx > -1 && xx < size && yy > -1 && yy < size) {
                if (queue.includes(Merge(xx, yy)) == false && map[Merge(xx, yy)] == 0 && state[Merge(xx, yy)] != -1) {
                    queue.push(Merge(xx, yy));
                }
                state[Merge(xx, yy)] = -1;
            }
        }
    }

    if (queue.includes(num) == true) {
        queue.splice(0, 1);
    }

    for (let i = 0; i < queue.length; i++) {
        Style(queue[i]);
        ExposeEmpty(queue[i]);
    }
}

//Flag cell
function Flag(num) {
    Split(num);
    if (state[num] != -1) {
        if (cells[num].style.backgroundColor == "black") {
            if ((x + (y % 2)) % 2 == 1) {
                cells[num].style.backgroundColor = "green";
            } else  {
                cells[num].style.backgroundColor = "darkgreen";
            }
        } else {
            cells[num].style.backgroundColor = "black";
        }
    } else {
        if (cells[num].style.backgroundColor == "black") {
            if ((x + (y % 2)) % 2 == 1) {
                cells[num].style.backgroundColor = "darkgrey";
            } else  {
                cells[num].style.backgroundColor = "grey";
            }
        }
    }
}

//Show all cells
function ExposeAll() {
    for (let i = 0; i < map.length; i++) {
        Style(i);
        state[i] = -1;
        if (win && map[i] >= 10) {
            cells[i].style.backgroundColor = "green";
        } else if (lost && map[i] >= 10) {
            cells[i].style.backgroundColor = "red";
        }
    }
}

//Check if won or lost
function Check() {
    exposed = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] == -1) {
            exposed++;
        }
    }
    if (exposed + bombs == (Math.pow(size, 2))) {
        win = true;
    }
    if (win || lost) {
        ExposeAll();
    }
}