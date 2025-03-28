import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export const executeCode = (req, res) => {
    const { code, language } = req.body;
    let command, args, filename, outputFile;

    const tempDir = path.join(process.cwd(), "temp");

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    switch (language) {
        case "javascript":
            filename = path.join(tempDir, "script.js");
            fs.writeFileSync(filename, code);
            command = "node";
            args = [filename];
            break;
        case "python":
            filename = path.join(tempDir, "script.py");
            fs.writeFileSync(filename, code);
            command = "python3";
            args = [filename];
            break;
        case "java":
            filename = path.join(tempDir, "Main.java");
            fs.writeFileSync(filename, code);
            command = "javac";
            args = [filename];
            break;
        case "c":
            filename = path.join(tempDir, "program.c");
            outputFile = path.join(tempDir, "program_c.out");
            fs.writeFileSync(filename, code);
            command = "gcc";
            args = [filename, "-o", outputFile];
            break;
        case "cpp":
            filename = path.join(tempDir, "program.cpp");
            outputFile = path.join(tempDir, "program_cpp.out");
            fs.writeFileSync(filename, code);
            command = "g++";
            args = [filename, "-o", outputFile];
            break;
        default:
            return res.json({ output: "Unsupported language!" });
    }

    const compilationProcess = spawn(command, args);

    let output = "";
    let errorOccurred = false;

    compilationProcess.stderr.on("data", (data) => {
        output += `Compilation Error: ${data.toString()}`;
        errorOccurred = true;
    });

    compilationProcess.on("close", (code) => {
        if (errorOccurred) {
            return res.json({ output });
        }

        let executionProcess;
        if (language === "c" || language === "cpp") {
            if (!fs.existsSync(outputFile)) {
                return res.json({ output: "Compilation failed: No executable found." });
            }
            executionProcess = spawn(outputFile);
        } else if (language === "java") {
            executionProcess = spawn("java", ["-cp", tempDir, "Main"]);
        } else {
            executionProcess = spawn(command, args);
        }

        executionProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        executionProcess.stderr.on("data", (data) => {
            output += `Runtime Error: ${data.toString()}`;
        });

        executionProcess.on("close", () => {
            res.json({ output });
            if (fs.existsSync(filename)) fs.unlinkSync(filename);
            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
        });
    });
};
