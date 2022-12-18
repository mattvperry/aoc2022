import { readInputLines, reduce } from '../shared/utils';

type Coord = [number, number, number];
type CoordS = `${number}_${number}_${number}`;

const toCoordS = ([x, y, z]: Coord): CoordS => `${x}_${y}_${z}`;

const parse = (line: string): Coord => line.split(',').map(x => parseInt(x, 10)) as Coord;

const moves = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
];

const surface = (coords: Coord[]): number => {
    let sum = 0;
    const set = new Set<CoordS>(coords.map(toCoordS));
    for (const [x, y, z] of coords) {
        for (const [dx, dy, dz] of moves) {
            if (!set.has(toCoordS([x + dx, y + dy, z + dz]))) {
                sum++;
            }
        }
    }

    return sum;
};

const part1 = (coords: Coord[]): number => surface(coords);

const part2 = (coords: Coord[]): number => {
    const set = new Set<CoordS>(coords.map(toCoordS));
    const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = reduce(
        coords,
        [[Infinity, -Infinity], [Infinity, -Infinity], [Infinity, -Infinity]],
        ([[minX, maxX], [minY, maxY], [minZ, maxZ]], [x, y, z]) => [
            [
                minX < x ? minX : x,
                maxX > x ? maxX : x,
            ],
            [
                minY < y ? minY : y,
                maxY > y ? maxY : y,
            ],
            [
                minZ < z ? minZ : z,
                maxZ > z ? maxZ : z,
            ],
        ]);

    const air: Coord[] = [];
    for (let x = minX; x <= maxX; ++x) {
        for (let y = minY; y <= maxY; ++y) {
            for (let z = minZ; z <= maxZ; ++z) {
                if (!set.has(toCoordS([x, y, z]))) {
                    air.push([x, y, z]);
                }
            }
        }
    }

    const bubbles: Coord[] = [];
    const all = new Set<CoordS>([...set, ...air.map(toCoordS)]);
    for (const [x, y, z] of air) {
        if (moves.every(([dx, dy, dz]) => all.has(toCoordS([x + dx, y + dy, z + dz])))) {
            bubbles.push([x, y, z]);
        }
    }

    return surface(coords) - surface(bubbles);
};

(async () => {
    const input = await readInputLines('day18');
    const coords = input.map(parse);

    console.log(part1(coords));
    console.log(part2(coords));
})();