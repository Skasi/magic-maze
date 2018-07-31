import config from './config';
import board from './board';
import Hero from './hero';

export default {

    all: [],

    init() {
        for (let i = 0; i < 4; i += 1) {
            this.all.push(new Hero(i));
            this.all[i].set({
                x: config.firstTile.x + [1, 2, 2, 1][i],
                y: config.firstTile.y + [1, 1, 2, 2][i]
            });
            this.all[i].pos = this.all[i].target;
            this.all[i].status = 'set';
        }
    },

    display() {
        p5.noStroke();
        for (let piece of this.all) {
            // Piece movement animation, only if necessary
            if (Math.abs(piece.pos.x - piece.target.x) > 1 / 1000 || Math.abs(piece.pos.y - piece.target.y) > 1 / 1000) {
                piece.move();
            }

            // Display path
            p5.push();
            const path = piece.path;
            for (let cell of path) {
                const boardCell = board.getCell(cell.x, cell.y);
                const tileCell = boardCell.tileCell;
                let tileShift = 0;

                let x1 = 0;
                let y1 = 0;
                let l = 1;
                let h = 1;

                if (tileCell) {
                    tileShift = tiles[boardCell.tileCount].shift;
                    const walls = boardCell.walls;
                    const s = .16; // Shift

                    x1 = [.32, .16, 0, -.16][tileCell.x];
                    y1 = [.32, .16, 0, -.16][tileCell.y];
                    let x2 = 1 + [.16, 0, -.16, -.32][tileCell.x];
                    let y2 = 1 + [.16, 0, -.16, -.32][tileCell.y];

                    if (walls.left && tileCell.x === 3) {
                        x1 += .22;
                    } else if (!walls.left && tileCell.x === 0) {
                        x1 -= .32;
                    }

                    if (walls.right && tileCell.x === 0) {
                        x2 -= .22;
                    } else if (!walls.right && tileCell.x === 3){
                        x2 += .32;
                    }

                    if (walls.top && tileCell.y === 3) {
                        y1 += .16;
                    } else if (!walls.top && tileCell.y === 0) {
                        y1 -= .32;
                    }

                    if (walls.bottom && tileCell.y === 0) {
                        y2 -= .22;
                    } else if (!walls.bottom && tileCell.y === 3) {
                        y2 += .32;
                    }

                    l = x2 - x1;
                    h = y2 - y1;
                }

                if (cell.reachable) {
                    p5.fill(0, 255, 0, 40);
                } else {
                    p5.fill(255, 0, 0, 40);
                }

                p5.push();
                p5.translate(cell.x * config.size + tileShift.x, cell.y * config.size + tileShift.y);
                p5.rect(x1 * config.size, y1 * config.size, l * config.size, h * config.size);
                p5.pop();
            }

            // Display piece
            p5.push();
            p5.translate(piece.pos.x * config.size, piece.pos.y * config.size);
            p5.fill(config.colors[piece.color]);

            if (piece.status === 'selected') {
                // Hero is selected, show it with a stroke
                p5.stroke(0, 20);
                p5.strokeWeight(4);
                p5.ellipse(config.size / 2, config.size / 2, 16, 16);
            }

            p5.stroke(0, 20);
            p5.strokeWeight(4);
            p5.ellipse(config.size / 2, config.size/2, 12, 12);
            p5.pop();
        }
    }
}
