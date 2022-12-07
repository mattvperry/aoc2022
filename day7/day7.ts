import { map, readInputLines, sumBy } from '../shared/utils';

type CD = { type: 'cd', to: string };
type List = { type: 'list' };
type FileListing = { type: 'file', name: string, size: number };
type DirectoryListing = { type: 'dir', name: string };
type Output
    = CD
    | List
    | FileListing
    | DirectoryListing;

type FileSystem = Directory | File;
type Directory = { type: 'dir', name: string, files: Map<string, FileSystem>, parent: Directory | null };
type File = { type: 'file', name: string, size: number, parent: Directory };

const parse = (line: string): Output => {
    const parts = line.split(' ');
    if (parts[0] === '$') {
        if (parts[1] === 'ls') {
            return { type: 'list' };
        } else if (parts[1] === 'cd') {
            return { type: 'cd', to: parts[2] };
        }
    }

    if (parts[0] === 'dir') {
        return { type: 'dir', name: parts[1] };
    }

    return { type: 'file', name: parts[1], size: parseInt(parts[0], 10) };
};

const buildFileSystem = (output: Output[]): FileSystem => {
    let root: Directory = { type: 'dir', name: '/', files: new Map<string, FileSystem>(), parent: null };
    let cwd: Directory = null!;
    for (const line of output) {
        if (line.type === 'cd' && line.to === '/') {
            cwd = root;
            continue;
        }

        switch (line.type) {
            case 'cd':
                if (line.to === '..' && cwd.parent !== null) {
                    cwd = cwd.parent;
                    break;
                }

                const f = cwd.files.get(line.to);
                if (f?.type === 'dir') {
                    cwd = f;
                } else {
                    throw new Error(`Invalid directory ${line.to}`);
                }
                break;
            case 'dir':
                cwd.files.set(line.name, { type: 'dir', name: line.name, files: new Map<string, FileSystem>(), parent: cwd });
                break;
            case 'file':
                cwd.files.set(line.name, { type: 'file', name: line.name, size: line.size, parent: cwd });
                break;
            case 'list':
                break;
        }
    }

    return root;
};

const sizes = (fs: FileSystem): number[] => {
    const dirList: number[] = [];
    const size = (fs: FileSystem): number => {
        switch (fs.type) {
            case 'dir':
                const s = sumBy(fs.files.values(), size);
                dirList.push(s);
                return s;
            case 'file':
                return fs.size;
        }
    };

    return [size(fs), ...dirList];
};

const day7 = (output: Output[]): [number, number] => {
    const root = buildFileSystem(output);
    const [total, ...rest] = sizes(root);
    const target = total - 40000000;
    return [
        sumBy(rest, s => s >= 100000 ? 0 : s),
        Math.min(...map(rest, s => s < target ? Infinity : s)),
    ];
};

(async () => {
    const input = await readInputLines('day7');
    const output = input.map(parse);
    const [p1, p2] = day7(output);

    console.log(p1);
    console.log(p2);
})();
