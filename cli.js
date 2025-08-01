#!/usr/bin/env node
const path = require('path');
const yargs = require('yargs/yargs')(process.argv.slice(2));
const validatePath = require("./validatePath");
const buildTree = require("./buildTree");


const args = yargs
    .scriptName("dev-tree")
    .usage("Usage: $0 [path (defaults to cwd)] [options]\n\n" +
         "Create a directory tree from the specified path.")
    .option("all", {
        alias: "a",
        type: "boolean",
        description: "show hidden files including node_modules & .git"
    })
    .option("ignore", {
        alias: "i",
        type: "array",
        description: "ignore specific dirent names and or file extensions"
    })
    .option("depth", {
        alias: "d",
        type: "number",
        description: "limit depth to a number (0 indexed)"
    })
    .option("output", {
        alias: "o",
        type: "string",
        description: "save the output to a new file path (can use relative path)"
    })
    .version("1.00")
    .help()
    .example("$0 --all", "Show all files including hidden ones")
    .example("$0 --ignore .txt --ignore .png", "Ignore .txt and .png files")
    .example("$0 --depth 2", "Limit the depth of the directory tree to 2")
    .example("$0 --output ./output.txt", "Save the output to output.txt")
    .example("$0 /home/user/Documents/code", "Create a directory tree from the specified path")
    .example("$0 /home/user/Documents/code --ignore assets --depth 3", "Ignore 'assets' directory and limit depth")
    .argv;

const targetPath = path.resolve(args._[0] || process.cwd());

async function main() {
    const isDirectory = await validatePath(targetPath);

    if (!isDirectory) {
        process.exit(1);
    }
    buildTree(targetPath, args);
}

main();