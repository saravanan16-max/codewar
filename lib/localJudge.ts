import fs from "fs";
import path from "path";
import { exec } from "child_process";

type JudgeResult = {
  stdout: string;
  stderr: string;
  compileError: string;
  runtimeMs: number | null;
};

const TEMP_DIR = path.join(process.cwd(), "temp");

function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

function cleanupFiles(files: string[]) {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.rmSync(file, { recursive: true, force: true });
      }
    } catch {}
  }
}

function runCommand(command: string, input: string, timeoutMs = 3000, cwd?: string) {
  return new Promise<{ stdout: string; stderr: string; errorMessage: string }>((resolve) => {
    const start = Date.now();
    const child = exec(command, { timeout: timeoutMs, cwd }, (error, stdout, stderr) => {
      const elapsed = Date.now() - start;
      if (error) {
        resolve({
          stdout: stdout?.toString() ?? "",
          stderr: stderr?.toString() ?? "",
          errorMessage:
            error.killed || (error as NodeJS.ErrnoException).code === "ETIMEDOUT"
              ? `Time Limit Exceeded (${elapsed} ms)`
              : error.message,
        });
        return;
      }
      resolve({ stdout: stdout?.toString() ?? "", stderr: stderr?.toString() ?? "", errorMessage: "" });
    });

    child.stdin?.write(input);
    child.stdin?.end();
  });
}

export async function runLocalCode(params: {
  language: "python" | "java" | "cpp";
  sourceCode: string;
  stdin: string;
}): Promise<JudgeResult> {
  ensureTempDir();
  const runId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const workDir = path.join(TEMP_DIR, runId);
  fs.mkdirSync(workDir, { recursive: true });

  let compileError = "";
  let stdout = "";
  let stderr = "";
  let runtimeMs: number | null = null;

  try {
    const started = Date.now();

    if (params.language === "python") {
      fs.writeFileSync(path.join(workDir, "main.py"), params.sourceCode, "utf8");
      const result = await runCommand("python main.py", params.stdin, 3000, workDir);
      stdout = result.stdout;
      stderr = result.stderr || result.errorMessage;
    }

    if (params.language === "cpp") {
      fs.writeFileSync(path.join(workDir, "main.cpp"), params.sourceCode, "utf8");
      const compileCmd = process.platform === "win32" ? "g++ main.cpp -o main.exe" : "g++ main.cpp -o main";
      const compiled = await runCommand(compileCmd, "", 5000, workDir);
      if (compiled.errorMessage || compiled.stderr) {
        compileError = `${compiled.errorMessage}\n${compiled.stderr}`.trim();
      } else {
        const runCmd = process.platform === "win32" ? "main.exe" : "./main";
        const result = await runCommand(runCmd, params.stdin, 3000, workDir);
        stdout = result.stdout;
        stderr = result.stderr || result.errorMessage;
      }
    }

    if (params.language === "java") {
      fs.writeFileSync(path.join(workDir, "Main.java"), params.sourceCode, "utf8");
      const compiled = await runCommand("javac Main.java", "", 5000, workDir);
      if (compiled.errorMessage || compiled.stderr) {
        compileError = `${compiled.errorMessage}\n${compiled.stderr}`.trim();
      } else {
        const result = await runCommand("java Main", params.stdin, 3000, workDir);
        stdout = result.stdout;
        stderr = result.stderr || result.errorMessage;
      }
    }

    runtimeMs = Date.now() - started;
    return { stdout, stderr, compileError, runtimeMs };
  } finally {
    cleanupFiles([workDir]);
  }
}

export function normalizeOutput(output: string | null | undefined) {
  return (output ?? "").replace(/\r\n/g, "\n").trim();
}
