import { map, readInputLines } from '../shared/utils';

type Coord = `${number}_${number}`;
type Grid<T> = T[][];

const toCoord = (x: number, y: number): Coord => `${x}_${y}`;

const parse = (line: string): number[] => Array.from(map(line, c => parseInt(c, 10)));

const part1 = (grid: Grid<number>): number => {
    const visible = new Set<Coord>();
    let localMin = 0;

    // Look down
    for (let col = 1; col < grid[0].length - 1; ++col) {
        localMin = grid[0][col];
        for (let row = 1; row < grid.length - 1; ++row) {
            if (grid[row][col] > localMin) {
                localMin = grid[row][col];
                visible.add(toCoord(row, col));
            }
        }
    }

    // Look up
    for (let col = 1; col < grid[0].length - 1; ++col) {
        localMin = grid[grid.length - 1][col];
        for (let row = grid.length - 2; row > 0; --row) {
            if (grid[row][col] > localMin) {
                localMin = grid[row][col];
                visible.add(toCoord(row, col));
            }
        }
    }

    // Look right
    for (let row = 1; row < grid.length - 1; ++row) {
        localMin = grid[row][0];
        for (let col = 1; col < grid[0].length - 1; ++col) {
            if (grid[row][col] > localMin) {
                localMin = grid[row][col];
                visible.add(toCoord(row, col));
            }
        }
    }

    // Look left
    for (let row = 1; row < grid.length - 1; ++row) {
        localMin = grid[row][grid[0].length - 1];
        for (let col = grid[0].length - 2; col > 0; --col) {
            if (grid[row][col] > localMin) {
                localMin = grid[row][col];
                visible.add(toCoord(row, col));
            }
        }
    }

    return visible.size + (2 * grid.length) + (2 * grid[0].length) - 4;
};

const part2 = (grid: Grid<number>): number => {
    const scores: number[] = [];

    for (let row = 1; row < grid.length - 1; ++row) {
        for (let col = 1; col < grid[0].length - 1; ++col) {
            const curr = grid[row][col];

            let up = 0;
            for (let r = row - 1; r >= 0; --r) {
                up++;
                if (curr <= grid[r][col]) {
                    break;
                }
            }

            let down = 0;
            for (let r = row + 1; r < grid.length; ++r) {
                down++;
                if (curr <= grid[r][col]) {
                    break;
                }
            }

            let left = 0;
            for (let c = col - 1; c >= 0; --c) {
                left++;
                if (curr <= grid[row][c]) {
                    break;
                }
            }

            let right = 0;
            for (let c = col + 1; c < grid[0].length; ++c) {
                right++;
                if (curr <= grid[row][c]) {
                    break;
                }
            }

            scores.push(up * down * left * right);
        }
    }

    return Math.max(...scores);
};

(async () => {
    const input = await readInputLines('day8');
    const grid = input.map(parse);

    console.log(part1(grid));
    console.log(part2(grid));
})();
