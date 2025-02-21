const fs = require("fs");
const path = require("path");

const targets = [".next", "node_modules", "package-lock.json"];

targets.forEach((target) => {
	const targetPath = path.join(__dirname, target);
	fs.rmSync(targetPath, { recursive: true, force: true });
});

console.log("Cleanup complete");
