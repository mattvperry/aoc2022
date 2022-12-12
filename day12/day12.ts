import { readInputLines, reduce, reduce2 } from '../shared/utils';

type Coord = [number, number];
type CoordS = `${number}_${number}`;
type Graph = Record<CoordS, CoordS[]>;

const toCoordS = ([x, y]: Coord): CoordS => `${x}_${y}`;
const fromCoordS = (coordS: CoordS): Coord => coordS.split('_').map(x => parseInt(x, 10)) as Coord;

const neighboors = ([x, y]: Coord): Coord[] => [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
];

const elevation = (cell: string): number => (cell === 'S' ? 'a' : cell === 'E' ? 'z' : cell)?.charCodeAt(0) ?? Infinity;

const parse = (lines: string[]): [Graph, CoordS, CoordS] => {
    let start: CoordS | null = null;
    let end: CoordS | null = null;
    const graph: Graph = {};
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            const coord = toCoordS([x, y]);
            if (lines[y][x] === 'S') {
                start = coord;
            } else if (lines[y][x] === 'E') {
                end = coord;
            }

            graph[coord] = neighboors([x, y])
                .filter(([nx, ny]) => elevation(lines[ny]?.[nx]) - elevation(lines[y]?.[x]) <= 1)
                .map(toCoordS);
        }
    }

    return [graph, start!, end!];
};

const manhattan = (a: CoordS, b: CoordS): number => {
    const [x1, y1] = fromCoordS(a);
    const [x2, y2] = fromCoordS(a);
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
};

const getPath = (cameFrom: Map<CoordS, CoordS>, current: CoordS): CoordS[] => {
    const path = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current)!;
        path.unshift(current);
    }

    return path;
};

const astar = (graph: Graph, start: CoordS, end: CoordS): CoordS[] => {
    const open = new Set<CoordS>([start]);
    const cameFrom = new Map<CoordS, CoordS>();
    const gScore = new Map<CoordS, number>();
    const fScore = new Map<CoordS, number>();

    gScore.set(start, 0);
    fScore.set(start, manhattan(start, end));

    while (open.size > 0) {
        const current = reduce2(open, (acc, curr) => {
            const fAcc = fScore.get(acc) ?? Infinity;
            const fCurr = fScore.get(curr) ?? Infinity;
            return fAcc < fCurr ? acc : curr;
        });
        if (current === end) {
            return getPath(cameFrom, current);
        }

        open.delete(current);
        for (const n of graph[current]) {
            const temp = (gScore.get(current) ?? Infinity) + 1;
            if (temp < (gScore.get(n) ?? Infinity)) {
                cameFrom.set(n, current);
                gScore.set(n, temp);
                fScore.set(n, temp + manhattan(n, end));
                if (!open.has(n)) {
                    open.add(n);
                }
            }
        }
    }

    return [];
};

function* starts(lines: string[]): IterableIterator<CoordS> {
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            if (lines[y][x] === 'a' || lines[y][x] === 'S') {
                yield toCoordS([x, y]);
            }
        }
    }
};

const part2 = (lines: string[], graph: Graph, end: CoordS): number => {
    return reduce(starts(lines), Infinity, (acc, curr) => {
        const currLen = astar(graph, curr, end).length - 1;
        return acc < currLen || currLen === -1 ? acc : currLen;
    });
};

(async () => {
    const input = await readInputLines('day12');
    const [graph, start, end] = parse(input);

    console.log(astar(graph, start, end).length - 1);
    console.log(part2(input, graph, end));
})();