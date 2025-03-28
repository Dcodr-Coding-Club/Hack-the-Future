const { spawn } = require("child_process");

function runPythonScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", [scriptPath, ...args]);

        pythonProcess.stdout.on("data", (data) => {
            console.log(`Output: ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`Error: ${data.toString()}`);
        });

        pythonProcess.on("exit", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Python script finished with code: ${code}`));
            }
        });
    });
}

module.exports = { runPythonScript };
