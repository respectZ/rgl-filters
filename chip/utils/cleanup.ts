import fs from "node:fs/promises";
import path from "node:path";

function isInside(directory: string, root: string): boolean {
	const relative = path.relative(root, directory);
	return (
		relative !== "" &&
		relative !== ".." &&
		!relative.startsWith(".." + path.sep) &&
		!path.isAbsolute(relative)
	);
}

function ignoreMissing(error: NodeJS.ErrnoException): undefined {
	if (error.code === "ENOENT") {
		return;
	}
	throw error;
}

async function isRealDirectory(directory: string): Promise<boolean> {
	const root = path.parse(directory).root;
	let current = root;
	for (const segment of directory.slice(root.length).split(path.sep)) {
		current = path.join(current, segment);
		const stat = await fs.lstat(current).catch(ignoreMissing);
		if (!stat || stat.isSymbolicLink() || !stat.isDirectory()) {
			return false;
		}
	}
	return true;
}

export class DirectoryCleanup {
	private readonly candidates = new Map<string, string>();
	private readonly workspace: string;

	constructor(workspace = process.cwd()) {
		this.workspace = path.resolve(workspace);
	}

	add(source: string, destination: string): void {
		const from = path.resolve(this.workspace, source);
		const to = path.resolve(this.workspace, destination);
		const root = path.dirname(to);
		if (from === to || !isInside(root, this.workspace)) {
			return;
		}
		let directory = path.dirname(from);
		while (isInside(directory, root)) {
			this.candidates.set(directory, root);
			directory = path.dirname(directory);
		}
	}

	async run(): Promise<void> {
		if (this.candidates.size === 0) {
			return;
		}
		const packRoots = new Map<string, string>();
		for (const pack of ["BP", "RP"]) {
			const packPath = path.join(this.workspace, pack);
			const stat = await fs.lstat(packPath).catch(ignoreMissing);
			if (stat?.isSymbolicLink()) {
				const target = await fs.realpath(packPath).catch(ignoreMissing);
				if (target) {
					packRoots.set(packPath, target);
				}
			}
		}
		const directories = [...this.candidates].sort(
			([left], [right]) => right.split(path.sep).length - left.split(path.sep).length,
		);
		for (const [sourceDirectory, sourceRoot] of directories) {
			if (!isInside(sourceRoot, this.workspace) || !isInside(sourceDirectory, sourceRoot)) {
				continue;
			}
			let directory = sourceDirectory;
			let root = sourceRoot;
			let boundary = this.workspace;
			for (const [packPath, target] of packRoots) {
				if (isInside(sourceRoot, packPath)) {
					directory = path.join(target, path.relative(packPath, sourceDirectory));
					root = path.join(target, path.relative(packPath, sourceRoot));
					boundary = target;
					break;
				}
			}
			if (
				!isInside(root, boundary) ||
				!isInside(directory, root) ||
				!(await isRealDirectory(directory))
			) {
				continue;
			}
			await fs.rmdir(directory).catch((error: NodeJS.ErrnoException) => {
				if (error.code === "ENOENT" || error.code === "ENOTEMPTY" || error.code === "EEXIST") {
					return;
				}
				throw error;
			});
		}
		this.candidates.clear();
	}
}
