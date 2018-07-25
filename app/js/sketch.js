import p5 from 'p5';
import config from './config';
import camera from './camera';
import board from './board';
import symbols from './symbols'
import events from './events'
import pieces from './pieces'
// import Tile from './tile'

const sketch = (p5) => {
    window.p5 = p5;
    window.tilesImages = [];

    p5.setup = () => {
        for (let i = 0; i < config.tiles; i +=1) {
            tilesImages.push(p5.loadImage('img/tile' + i + '.jpg'));
        }

        const canvas = p5.createCanvas(p5.windowWidth - 300, p5.windowHeight);
        canvas.parent('canvas-wrap');

        p5.mouseX = p5.width/2;
        p5.mouseY = p5.height/2;
        camera.move(- config.boardCols / 2 * config.size, - config.boardRows / 2 * config.size);
    }

    p5.draw = () => {
        p5.clear();
        p5.background(245,250,255);

        // Zoom with focus point at the center of screen
        p5.translate(p5.width/2, p5.height/2);
        camera.zoom();

        p5.push();
        camera.move();

        // Display tiles
        displayTiles();

        pieces.display();

        if (config.grid) {
            symbols.grid();
        }

        p5.pop();
    }
}

/**
* Display all tiles
*/
function displayTiles() {
    for (let tile of tiles) {
        // Tiles is being placed, move it along cursor position
        if (!tile.fixed) {
            // Hovered cell
            const cell = events.getHoveredCell();
            const o = tile.getOrientation();

            // Place cursor on enter cell depending on orientation
            let x = cell.x + [-2, -3, -1, 0][o];
            let y = cell.y + [0, -2, -3, -1][o];
            tile.move(x, y);
        }

        // Display tile
        tile.display();
    }
}

export default sketch;
