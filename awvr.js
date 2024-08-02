const fs = require("fs");
const path = require("path");
const util = require("util");

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

const Path = "..";
const Name = "10.40";

async function getFileSizes(dir) {
    let results = [];

    async function scanDir(dir) {
        const items = await readdir(dir);
        for (let item of items) {
            const fullPath = path.join(dir, item);
            const stats = await stat(fullPath);
            if (stats.isDirectory()) {
                await scanDir(fullPath);
            } else {
                results.push({
                    name: item,
                    path: fullPath,
                    size: stats.size / 1024
                });
            }
        }
    }

    await scanDir(dir);
    return results;
}

(async () => {
    try {
        const fileSizes = await getFileSizes(Path);
        fs.writeFileSync(`${Name}.json`, JSON.stringify(fileSizes, null, 2));
        console.log(`File size dump finished for ${Name}!`);
    } catch (err) {
        console.error(err);
    }
})();
