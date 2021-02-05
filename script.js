let map = new Array(64);
let state = new Array(64);
let queue = new Array();
for (let i = 0; i < map.length; i++) {
    map[i] = 0;
    state[i] = 0;
}
let origin = 0, bombs = 0, exposed = 0, x = 0, y = 0;
let win = false, lost = false;

//Generate HTML + CSS
let header = document.createElement('header');
window.onload = function() {
    Update(mql);
    document.body.style.cssText = "margin: 0; padding: 0;";
    header.style.cssText = "width: 100%; height: 10vh; display: grid; grid-template-columns: 256px auto;";
    document.body.appendChild(header);
    let title = document.createElement('h1');
    title.innerHTML = "Minesweeper";
    title.style.cssText = "font-family: Arial; text-decoration: underline; display: flex; align-items: center; justify-content: center;";
    header.appendChild(title);
    let main = document.createElement('main');
    main.style.cssText = "width: 100%; height: 85vh; display: flex; align-items: center; justify-content: center;";
    document.body.appendChild(main);
    let arrow = document.createElement('div');
    arrow.innerHTML = '&DownArrowBar; About &DownArrowBar;';
    arrow.style.cssText = "width: 100%; height: 5vh; display: flex; align-items: center; justify-content: center;";
    document.body.appendChild(arrow);
    let board = document.createElement('div');
    board.style.cssText = "width: 320px; height: 320px; display: flex; flex-wrap: wrap; box-shadow: 0 0 20px 2px black;";
    main.appendChild(board);

    for (let yy = 0; yy < 8; yy++) {
        for (let xx = 0; xx < 8; xx++) {
            let e = document.createElement('div');
            e.className = 'cell';
            e.setAttribute( "onClick", "Show(" + Merge(xx, yy) + ")" );
            e.setAttribute("onContextMenu", "Flag(" + Merge(xx, yy) + ");  return false;" );
            e.style.cssText = "width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;";
            if ((xx + (yy % 2)) % 2 == 1) {
                e.style.backgroundColor = "green";
            } else  {
                e.style.backgroundColor = "darkgreen";
            }
            board.appendChild(e);
        }
    } 
}

let mql = matchMedia('(max-width: 425px)');
function Update(e) {
    if (e.matches) {
        header.style.gridTemplateColumns = "1fr";
    } else {
        header.style.gridTemplateColumns = "256px auto";
    }
}
mql.addListener(Update);

//Array <=> 2D Array conversion
function Split(num) {
    x = num%8;
    y = Math.floor(num/8);
}

function Merge(x, y) {
    return y*8 + x;
}

let cells = document.getElementsByClassName('cell');

//Style cells
function Style(num) {
    Split(num);
    if (map[num] == 0) {
        for (let yy = y-1; yy < y+2; yy++) {
            for (let xx = x-1; xx < x+2; xx++) {
                if (xx > -1 && xx < 8 && yy > -1 && yy < 8) {
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
            } else  {
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
        origin++;
        PlaceBombs(num);  
        Numbers(); 
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
    while (bombs < 8) {
        for (let i = 0; i < map.length; i++) {
            if (Math.ceil(Math.random()*16) == 1 && map[i] != 10 && i != num) {
                map[i] = 10;
                bombs++;
            }
            if (bombs == 8) {
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
                    if (xx > -1 && xx < 8 && yy > -1 && yy < 8) {
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
            if (xx > -1 && xx < 8 && yy > -1 && yy < 8) {
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
    if (exposed + bombs == 64) {
        win = true;
    }
    if (win || lost) {
        ExposeAll();
    }
}
