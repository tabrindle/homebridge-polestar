import path from "path"
const { spawn } = require("child_process")

export function shell(scriptName: string) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, `./${scriptName}`)
    const childProcess = spawn("bash", [scriptPath])

    let output = ""

    childProcess.stdout.on("data", (data) => {
      output += data.toString()
    })

    childProcess.stderr.on("data", (data) => {
      reject(data.toString())
    })

    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim())
      } else {
        reject(`Shell script exited with code ${code}`)
      }
    })
  })
}
