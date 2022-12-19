import { readInputLines, sumBy } from '../shared/utils';

type Item = typeof items[number];
type BP = {
    id: number,
    costs: Record<Item, Partial<Record<Item, number>>>,
};
type State = {
    bp: BP,
    robots: Record<Item, number>;
    items: Record<Item, number>;
    budget: number;
};

const items = ['ore', 'clay', 'obs', 'geode'] as const;

const parse = (line: string): BP => {
    const [header, rest] = line.split(': ');
    const costs = rest.split('. ').map(c => c.split(' '));
    return {
        id: parseInt(header.split(' ')[1], 10),
        costs: {
            ore: { ore: -parseInt(costs[0][4], 10) },
            clay: { ore: -parseInt(costs[1][4], 10) },
            obs: { ore: -parseInt(costs[2][4], 10), clay: -parseInt(costs[2][7], 10) },
            geode: { ore: -parseInt(costs[3][4], 10), obs: -parseInt(costs[3][7], 10) },
        },
    };
};

const sumItems = (x: Record<Item, number>, y: Partial<Record<Item, number>>): Record<Item, number> => {
    return {
        ore: x.ore + (y.ore ?? 0),
        clay: x.clay + (y.clay ?? 0),
        obs: x.obs + (y.obs ?? 0),
        geode: x.geode + (y.geode ?? 0),
    };
};

const maximum = (state: State): number => {
    if (state.budget === 0) {
        return state.items.geode;
    }

    const craftable = items
        .map(i => [
            i,
            sumItems(state.items, state.bp.costs[i]),
        ] as [Item, Record<Item, number>])
        .filter(([_, c]) => Object.values(c).every(v => v >= 0));
    const [craft, cost] = craftable.length > 0 ? craftable[craftable.length - 1] : [];

    return Math.max(
        maximum({ 
            ...state,
            items: sumItems(state.items, state.robots),
            budget: state.budget - 1
        }),
        craft === undefined || cost === undefined ? 0 : maximum({
            ...state,
            items: sumItems(cost, state.robots),
            robots: sumItems(state.robots, { [craft]: 1 }),
            budget: state.budget - 1
        }),
    );
};

const part1 = (bps: BP[]): number => {
    const init: Omit<State, 'bp'> = {
        robots: {
            ore: 1,
            clay: 0,
            obs: 0,
            geode: 0,
        },
        items: {
            ore: 0,
            clay: 0,
            obs: 0,
            geode: 0,
        },
        budget: 24,
    }

    return maximum({ bp: bps[1], ...init });
    //return sumBy(bps, bp => maximum({ bp, ...init }) * bp.id);
};

(async () => {
    const input = await readInputLines('day19');
    const bps = input.map(parse);

    console.log(part1(bps));
})();