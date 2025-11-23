# dev-tree

A decent cli tool to generate a directory tree for any given path. 
- Ignores ".git" and "node_modules" by default

---
## Example Output

Running `dev-tree` in a sample project will produce output like this:

*output is color coded*
```
/node-cli-project
│
├──/assets
│  └──/depth1
│  │  ├──depth1.txt
│  │  └──/depth2
│  │  │  ├──depth2.txt
│  │  │  └──/depth3
│  │  │  │  └──/depth4
│  │  │  │  │  ├──/depth5
│  │  │  │  │  └──/hello
├──/routes
│  ├──/stats
│  ├──test.js
│  └──visualize.json
│
├──buildTree.js
├──cli.js
├──package-lock.json
├──package.json
└──validatePath.js

 9 directories, 9 files
```

---


## Installation

Install the `dev-tree` tool globally using npm to use it from anywhere in your terminal.

```
npm install -g @satpolo/dev-tree
```

---


## Usage

Run the `dev-tree` command with an optional path to a directory. If no path is provided, it will default to the current working directory.

```
dev-tree [path] [options]
```

---

## Options


| Option | Alias | Description | Example |
| :--- | :--- | :--- | :--- |
| `--all` | `-a` | Show hidden files and directories, including `.git` and `node_modules` which are ignored by default. | `dev-tree --all` |
| `--ignore` | `-i` | Ignore specific dirent names or file extensions. Can be used multiple times. | `dev-tree -i .txt node_modules` |
| `--depth` | `-d` | Limit the depth of the directory tree to a specific number (0-indexed). | `dev-tree -d 2` |
| `--output` | `-o` | Save the output to a specified file path instead of printing to the console. | `dev-tree -o output.txt` |


---


## Examples

**Generate a tree for the current directory, ignoring `.txt` and `assets`:**

```
dev-tree --ignore .txt --ignore assets
```

**Generate a tree for a specific path, limiting the depth to 3:**

```
dev-tree /home/user/my-project --depth 3
```

**Show all files, including hidden ones, and save the output to a file:**

```
dev-tree --all --output tree.log
```

---


## License

This project is licensed under the MIT License.
