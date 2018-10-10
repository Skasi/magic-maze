import ai from './ai';
import board from './board';
import clock from './clock';
import config from './config';
import events from './events';
import game from './game';
import Hero from './hero';
import heroes from './heroes';
import p5 from 'p5';
import sketch from './sketch';
import Tile from './tile';

window.tiles = [];
window.json = [];
window.socket = io({transports: ['websocket'], upgrade: false});
window.role = [];

fetchJSON(0);

function fetchJSON(i) {
    fetch('data/tile' + i + '.json').then(response => response.json()).then(data => {
        window.json.push(data);

        if (i < config.tiles - 1) {
            fetchJSON(i + 1);
        }
    });
}

function start(options) {
    new p5(sketch);
    game.init(options);
    board.init();
    events.init();
    heroes.init();
    clock.init();
    if (game.admin) ai.run();
}

const $ui = document.getElementById('ui');
const $players = document.getElementById('players');

// FIXME: why is this not reliable?
socket.on('people', people => {
    $people.innerHTML = people;
    $people.innerHTML += people > 1 ? ' joueurs connectés' : ' joueur connecté';
});

socket.on('admin', () => {
    // Timeout needed to give time for 'players' event
    setTimeout(() => {
        $admin.innerHTML += `<h3>Maître du jeu</h3>
        <p>Bot(s) <input type="number" id="bots" value="0" min="0" max="7" /></p>
        <p>Scénario <input type="number" id="scenario" value="1" min="1" max="15" /></p>
        <button id="start">Commencer la partie !</button>`;

        document.getElementById('start').addEventListener('mousedown', () => {
            socket.emit('start', {
                bots: parseInt(document.getElementById('bots').value),
                scenario: parseInt(document.getElementById('scenario').value)
            });
            document.getElementById('admin').remove();
        });

    }, 100);
});

socket.on('start', options => {
    start(options);
});

socket.on('role', roles => {
    // Save my role
    role = roles;

    // Display role
    let text = '<p>Actions autorisées : ';
    for (let i in roles) {
        i = parseInt(i);
        text += roles[i];
        if (roles[i + 1]) text += ', ';
    }
    text += '.</p>'

    $ui.innerHTML += text;
});

socket.on('hero', data => {
    const hero = heroes.all[data.id];
    const cell = data.cell;
    hero.set(cell.x, cell.y);
});

socket.on('board', data => {
    board.save(data.x, data.y, data.cell)
});

socket.on('tile', data => {
    const tile = new Tile(data.tile.id);
    tile.rotation = data.tile.rotation;
    window.tiles.push(tile);
    tile.set(data.x, data.y);
});

socket.on('invertClock', data => {
    clock.invert();
});

socket.on('used', data => {
    board.setUsed(data.x, data.y);
});

socket.on('ai', data => {
    ai.run();
});
