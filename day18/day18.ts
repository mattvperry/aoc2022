import { countBy, map, readInputLines, reduce, sumBy } from '../shared/utils';

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
    const set = new Set<CoordS>(map(coords, toCoordS));
    return sumBy(
        coords, 
        ([x, y, z]) => countBy(moves, (([dx, dy, dz]) => !set.has(toCoordS([x + dx, y + dy, z + dz]))))
    );
};

const day18 = (coords: Coord[]): [number, number] => {
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

    let bubbles: Coord[] = [];
    const lavaSet = new Set<CoordS>(coords.map(toCoordS));
    for (let x = minX; x <= maxX; ++x) {
        for (let y = minY; y <= maxY; ++y) {
            for (let z = minZ; z <= maxZ; ++z) {
                if (!lavaSet.has(toCoordS([x, y, z]))) {
                    bubbles.push([x, y, z]);
                }
            }
        }
    }

    while (true) {
        const bubbleSet = new Set<CoordS>(bubbles.map(toCoordS));
        bubbles = bubbles.filter(([x, y, z]) => moves.every(([dx, dy, dz]) => {
            const s = toCoordS([x + dx, y + dy, z + dz]);
            return bubbleSet.has(s) || lavaSet.has(s);
        }));
        if (bubbles.length === bubbleSet.size) {
            break;
        }
    }

    const p1 = surface(coords);
    return [p1, p1 - surface(bubbles)];
};

(async () => {
    const input = await readInputLines('day18');
    const coords = input.map(parse);
    const [p1, p2] = day18(coords);

    console.log(p1);
    console.log(p2);
})();