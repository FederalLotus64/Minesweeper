import {LoadSweeper, container as c1} from './script.js';

let header, dropdown, button, content, link1, link2, title, main;

window.onload = function() {
    document.body.style.cssText = "margin: 0; padding: 0;";

    header = document.createElement('header');
    header.style.cssText = "width: 100%; height: 64px; display: grid; grid-template-columns: 64px auto 64px; box-shadow: 0 0 20px 2px black;";

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

    link1 = document.createElement('a');
    link1.style.cssText = "width: 128px; height: 48px; font-family: Arial; font-weight: bold; text-decoration: none; color: black; display: flex; align-items: center; justify-content: center; background-color: white;";
    link1.addEventListener("mouseover", () => {link1.style.color = "white"; link1.style.backgroundColor = "black";});
    link1.addEventListener("mouseout", () => {link1.style.color = "black"; link1.style.backgroundColor = "white";});
    link1.href = "index.html";
    link1.innerHTML = "Home";
    content.appendChild(link1);

    link2 = document.createElement('a');
    link2.style.cssText = "width: 128px; height: 48px; font-family: Arial; font-weight: bold; text-decoration: none; color: black; display: flex; align-items: center; justify-content: center; background-color: white;";
    link2.addEventListener("mouseover", () => {link2.style.color = "white"; link2.style.backgroundColor = "black";});
    link2.addEventListener("mouseout", () => {link2.style.color = "black"; link2.style.backgroundColor = "white";});
    link2.href = "#sweeper";
    link2.innerHTML = "Minesweeper";
    content.appendChild(link2);

    title = document.createElement('h1');
    title.style.cssText = "margin: auto; padding: 0; width: 192px; height: 64px; display: flex; align-items: center; justify-content: center;";
    title.innerHTML = "Entertainment";
    header.appendChild(title);

    main = document.createElement('main');
    main.style.cssText = "width: 100%;";

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