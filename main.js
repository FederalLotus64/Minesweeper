import {LoadSweeper, container as c1} from './script.js';

let header, main, dropdown, button, content, link;

window.onload = function() {
    document.body.style.cssText = "margin: 0; padding: 0;";

    header = document.createElement('header');
    header.style.cssText = "width: 100%; height: 64px; box-shadow: 0 0 20px 2px black;";

    main = document.createElement('main');
    main.style.cssText = "width: 100%;";

    dropdown = document.createElement('div');
    dropdown.style.cssText = "width: 64px; height: 64px; display: inline-block; position: relative;";
    header.appendChild(dropdown);

    button = document.createElement('button');
    button.innerHTML = "<img src='menu.png' id='btn' style='cursor: pointer;'></img>";
    button.style.cssText = "margin: 0; padding: 0; width: 64px; height: 64px; font-size: 3em; border-style: none; outline: none; background-color: white;";
    dropdown.appendChild(button);

    content = document.createElement('div');
    content.style.cssText = "display: none; position: absolute;";
    dropdown.appendChild(content);

    link = document.createElement('a');
    link.style.cssText = "width: 128px; height: 48px; font-family: Arial; font-weight: bold; text-decoration: none; color: black; display: flex; align-items: center; justify-content: center; background-color: white;";
    link.href = "index.html";
    link.innerHTML = "Home";
    content.appendChild(link);

    link = document.createElement('a');
    link.style.cssText = "width: 128px; height: 48px; font-family: Arial; font-weight: bold; text-decoration: none; color: black; display: flex; align-items: center; justify-content: center; background-color: white;";
    link.href = "#sweeper";
    link.innerHTML = "Minesweeper";
    content.appendChild(link);

    Load();

    document.body.appendChild(header);
    main.appendChild(c1);
    document.body.appendChild(main);
}

window.onclick = function(e) {
    if (e.target.matches("#btn")) {
        if (content.style.display == "none") {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    } else {
        content.style.display = "none";
    }
}

function Load() {
    LoadSweeper();
}