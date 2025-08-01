const fs = require("fs/promises");

const validatePath = async (path) => {
        try {
            const stats = await fs.stat(path);
            if (stats.isDirectory()) {
                return true;
            }
            console.error(`Not a directory: "${path}"`);
            return false;
        } catch (error) {
            if (error.code === "ENOENT") {
                console.error(`Path not found: "${path}"`);
                return false;
            }
            else if (error.code === "EACCES") {
                console.error(`Permission denied: "${path}"`);
                return false;
            }
            else if (error.code === "EIO") {
                console.error(`Error: I/O error occurred while accessing: "${path}"`);
                return false;
            }
            else {
                console.error(`error: ${error.code}`)
                return false;
            }
        }
    };

module.exports = validatePath;
