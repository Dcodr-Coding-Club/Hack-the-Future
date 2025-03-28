import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './config/connectToDatabase.js';
import { authRoutes } from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import { codeRoutes } from './routes/codeRoutes.js';
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
    origin:`http://localhost:5173`, //frontend port
    credentials: true,
};
app.use(cors(corsOption));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/code',codeRoutes);
const PORT = process.env.PORT || 5000;
// http://localhost:3000/auth/
app.listen(PORT, () => {
  console.log(`The Server is Running at port ${PORT}`);
});




// import express from "express";
// import cors from "cors";
// import { spawn } from "child_process";
// import fs from "fs";
// import path from "path";

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/execute", (req, res) => {
//   const { code, language } = req.body;
//   let command, args, filename, outputFile;

//   const tempDir = path.join(process.cwd(), "temp");

//   if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

//   switch (language) {
//     case "javascript":
//       filename = path.join(tempDir, "script.js");
//       fs.writeFileSync(filename, code);
//       command = "node";
//       args = [filename];
//       break;
//     case "python":
//       filename = path.join(tempDir, "script.py");
//       fs.writeFileSync(filename, code);
//       command = "python3";
//       args = [filename];
//       break;
//     case "java":
//       filename = path.join(tempDir, "Main.java");
//       fs.writeFileSync(filename, code);
//       command = "javac";
//       args = [filename];
//       break;
//     case "c":
//       filename = path.join(tempDir, "program.c");
//       outputFile = path.join(tempDir, "program.out");
//       fs.writeFileSync(filename, code);
//       command = "gcc";
//       args = [filename, "-o", outputFile];
//       break;
//     case "cpp":
//       filename = path.join(tempDir, "program.cpp");
//       outputFile = path.join(tempDir, "program.out");
//       fs.writeFileSync(filename, code);
//       command = "g++";
//       args = [filename, "-o", outputFile];
//       break;
//     default:
//       return res.json({ output: "Unsupported language!" });
//   }

//   const compilationProcess = spawn(command, args);

//   let output = "";
//   let errorOccurred = false;

//   compilationProcess.stderr.on("data", (data) => {
//     output += `Compilation Error: ${data.toString()}`;
//     errorOccurred = true;
//   });

//   compilationProcess.on("close", (code) => {
//     if (errorOccurred) {
//       return res.json({ output });
//     }

//     if (language === "c" || language === "cpp") {
//       const executionProcess = spawn(outputFile);

//       executionProcess.stdout.on("data", (data) => {
//         output += data.toString();
//       });

//       executionProcess.stderr.on("data", (data) => {
//         output += `Runtime Error: ${data.toString()}`;
//       });

//       executionProcess.on("close", () => {
//         res.json({ output });
//         fs.unlinkSync(filename); // Clean up source file
//         fs.unlinkSync(outputFile); // Clean up compiled file
//       });
//     } else {
//       res.json({ output });
//       fs.unlinkSync(filename);
//     }
//   });
// });

// app.listen(5000, () => console.log("Server running on port 5000"));
