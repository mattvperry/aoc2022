import { readInputLines } from '../shared/utils';

type Item = 'ore' | 'clay' | 'obs' | 'geode';
type BP = {
    id: number,
    costs: Record<Item, number>,
};

const parse = (line: string): BP => {
    return {
        id: 0,
        costs: {
            ore: 0,
            clay: 0,
            obs: 0,
            geode: 0,
        },
    };
};

(async () => {
    const input = await readInputLines('day19');
    const bps = input.map(parse);
})();