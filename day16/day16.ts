import { map, memoize, readInputLines, reduce, splitAt, zip } from '../shared/utils';

type Rates = Record<string, number>;
type Graph<T = string[]> = Record<string, T>;

const parse = (line: string): [string, number, string[]] => {
    const [rate, edges] = line.split('; ');
    return [
        rate.split(' ')[1],
        parseInt(rate.split('=')[1], 10),
        edges.split(/valves? /)[1].split(', '),
    ];
};

const bfs = memoize((graph: Graph, start: string, end: string): number => {
    const paths = [[start]];
    while (paths.length > 0) {
        const path = paths.shift()!;
        const curr = path[path.length - 1];
        if (curr === end) {
            return path.length - 1;
        }

        for (const node of graph[curr]) {
            if (path.includes(node)) {
                continue;
            }
            paths.push([...path, node]);
        }
    }
    
    return -1;
}, (_, s, e) => [s, e].sort().join('_'));

const value = memoize((path: string[], min: number, graph: Graph, rates: Rates): number => {
    let result = 0;
    for (const [a, b] of zip(path, path.slice(1))) {
        min -= bfs(graph, a, b) + 1;
        result += min * rates[b];
    }

    return result;
}, (p, m) => `${p.join('-')}_${m}`);

function* getPaths(
    graph: Graph<[string, number][]>,
    curr: string,
    budget: number,
    skip: Set<string> = new Set<string>(),
): IterableIterator<string[]> {
    if (budget >= 1) {
        yield [curr];
    }

    for (const [node, cost] of graph[curr]) {
        if (skip.has(node) || budget < cost + 2) {
            continue;
        }

        yield* map(
            getPaths(graph, node, budget - cost - 1, new Set<string>([...skip, curr])),
            path => [curr, ...path]
        );
    }
}

const part2 = (squash: Graph<[string, number][]>, graph: Graph, rates: Rates): number => {
    let best = 0;
    for (const path1 of getPaths(squash, 'AA', 26)) {
        const val1 = value(path1, 26, graph, rates);
        for (const path2 of getPaths(squash, 'AA', 26, new Set<string>(path1))) {
            const val2 = value(path2, 26, graph, rates);
            best = Math.max(best, val1 + val2);
        }
    }

    return best;
};

const day16 = (data: [string, number, string[]][]): [number, number] => {
    const [graph, rates, nonzero] = data.reduce(
        ([graph, rates, nonzero], [node, rate, paths]) => {
            graph[node] = paths;
            rates[node] = rate;
            if (rate !== 0) {
                nonzero.push(node);
            }
            return [graph, rates, nonzero];
        },
        [{} as Graph, {} as Rates, [] as string[]]);
    const keep = ['AA', ...nonzero];
    const squash = reduce(keep, {} as Graph<[string, number][]>, (acc, curr) => {
        acc[curr] = keep.filter(y => curr !== y).map(y => [y, bfs(graph, curr, y)] as [string, number]); 
        return acc;
    });

    return [
        Math.max(...map(getPaths(squash, 'AA', 30), path => value(path, 30, graph, rates))),
        part2(squash, graph, rates),
    ];
};

(async () => {
    const input = await readInputLines('day16');
    const data = input.map(parse);

    console.log(day16(data));
})();