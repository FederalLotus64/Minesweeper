let map = new Array(64);
let state = new Array(64);
let queue = new Array();
for (let i = 0; i < map.length; i++) {
    map[i] = 0;
    state[i] = 0;
}
let origin = -1, bombs = 0, exposed = 0, x = 0, y = 0;
let win = false, lost = false;

//Generate board
window.onload = function() {
    document.body.style.cssText = "margin: 0; padding: 0; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center;";
    let path = document.createElement('div');
    path.style.cssText = "width: 320px; height: 320px; display: flex; flex-wrap: wrap; box-shadow: 0 0 20px 2px black;";
    document.body.appendChild(path);

    for (let yy = 0; yy < 8; yy++) {
        for (let xx = 0; xx < 8; xx++) {
            let e = document.createElement('div');
            e.className = 'cell';
            e.setAttribute( "onClick", "Show(" + Merge(xx, yy) + ")" );
            e.setAttribute("onContextMenu", "Flag(" + Merge(xx, yy) + "); return false;" );
            e.style.cssText = "width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;";
            if ((xx + (yy % 2)) % 2 == 1) {
                e.style.backgroundColor = "green";
            } else  {
                e.style.backgroundColor = "darkgreen";
            }
            path.appendChild(e);
        }
    }    
}

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
    if (origin == -1) {
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
            if (Math.ceil(Math.random()*16) == 1 && map[i] != 10 &&i != num) {
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
    }
    if (win) {
        document.body.style.backgroundColor = "green";
        console.log("Win!");
    } else if (lost) {
        document.body.style.backgroundColor = "red";
        console.log("Lost!");
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
