const fs = require("fs");
const path = require("path");

function manageDirectorySize(dirPath, maxFiles = 10) {
  try {
    const files = fs.readdirSync(dirPath)
      .map(name => ({
        name,
        time: fs.statSync(path.join(dirPath, name)).mtime.getTime()
      }))
      .sort((a, b) => a.time - b.time);

    while (files.length > maxFiles) {
      const fileToDelete = files.shift(); // remove the oldest
      fs.unlinkSync(path.join(dirPath, fileToDelete.name));
    }
  } catch (err) {
    console.error(`Error managing directory size for ${dirPath}:`, err);
  }
}

module.exports = { manageDirectorySize };