const fs = require("fs/promises");
const path = require("path");

function buildTree(absolutePath, args) {
    class Tree {
        constructor(basename) {
            this[basename] = [{}, {}];
        }
        addNode(node, metadata, parentRef) {
            parentRef[node] = [{}, {...metadata}];
        }
    };

    const basename = path.basename(absolutePath);
    const tree = new Tree(basename);

    const reset = args?.output ? "" : "\x1b[0m";
    const yellow = args?.output ? "" : "\x1b[33m";
    const brightBlueBold = args?.output ? "" : "\x1b[94m" + "\x1b[1m";
    const brightMagentaBold = args?.output ? "" : "\x1b[95m" + "\x1b[1m";

    const log = [`/${brightMagentaBold}${basename}${reset}\n│\n`];
    const topLevelFiles = [];
    let fileCount = 0; // needs top level scope since topLevelFiles arent added to Tree
    const ignoreDirents = [".git", "node_modules"];
    const ignoreFileExts = [];

    if (args?.ignore) {
        args.ignore.forEach((arg) => {
            if (arg.startsWith(".") && !arg.includes(path.sep)) {
                ignoreFileExts.push(arg);
            }
            else {
                ignoreDirents.push(arg);
            }
        });
    }
    
    async function readTree(absPath, parentRef, depth) {
        const contents = await fs.readdir(absPath, {withFileTypes: true});
        const promises = contents.map((dirent) => {
        const name = dirent.name;
        const direntPath = path.join(absPath, name);
        const isDirectory = dirent.isDirectory();
            
        let fileExt = isDirectory ? null : path.extname(name);
        if (fileExt === "") {
            // edge case for .env .gitignore files
            file = name;
        }
            
        if (!args.all) {
            if (ignoreDirents.includes(name) || ignoreFileExts.includes(fileExt)) {
                return;
            }
        }

        if (args.depth !== undefined) {
            if (depth >= args.depth + 1) return;
        }

        const addNode = () => {
            tree.addNode(name, {depth, isDirectory, direntPath}, parentRef);
        }

        if (isDirectory) {
            addNode();
            return readTree(direntPath, parentRef[name][0], depth + 1);
        }
        else if (!isDirectory && depth === 0) {
            fileCount++
            topLevelFiles.push(`${yellow}${name}${reset}\n`);
        }
        else {
            fileCount++
            addNode();
        }
        });
        await Promise.all(promises);
    }
    readTree(absolutePath, tree[basename][0], 0)
    .then(async () => {
        let dirCount = 0;

        function writeToLog(obj, isTopLevel=true) {
            let count = 0;
            dirCount++;

            const length = Object.keys(obj).length;

            for (const dirent in obj) {
                count++;

                const metadata = obj[dirent][1];
                let indentType;

                if (count === length) {
                    indentType = isTopLevel ? "├──" : "└──";
                }
                else {
                    indentType = "├──";
                }

                const spacer = "│  ";
                log.push (`${spacer.repeat(metadata.depth)}${indentType}${metadata.isDirectory ? brightBlueBold + "/" : yellow}${dirent}${reset}\n`);

                if (metadata.isDirectory) {
                    writeToLog(obj[dirent][0], false);
                }
            }
        }

        writeToLog(tree[basename][0]);

        log.push(`│\n`);
        topLevelFiles.forEach((file, index) => {
            if (index === topLevelFiles.length - 1) {
                log.push(`└──${file}`);
            }
            else {
                log.push(`├──${file}`);
            }
        });
        log.push(`\n ${dirCount > 0 ? dirCount - 1 : 0} directories, ${fileCount} files`);

        if (args?.output) {
            const saveFile = async () => {
                try {
                    await fs.writeFile(args.output, log.join(""));
                    console.log(`File saved successfully!`);
                } catch (error) {
                    console.error(`Error writing file to: ${args.output}`);
                }
            }
            await saveFile();
            process.exit(0);
        }
        else {
            console.log(log.join(""));
            process.exit(0);
        }
    });
}
module.exports = buildTree;
