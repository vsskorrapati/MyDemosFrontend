const { exec } = require("child_process");

let command;

if (process.env.ENV === "production") {
  command = exec("ng build --configuration production");
} else if (process.env.ENV === "staging") {
  command = exec("ng build --configuration staging");
} else if (process.env.ENV === "development") {
  command = exec("ng build --configuration development");
}

if (command != undefined) {
  command.stdout.on("data", (data) => {
    console.log(data);
  });

  command.stderr.on("data", (data) => {
    console.error(data);
  });

  command.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
} else {
  console.error("process.env.ENV: " + process.env.ENV);
}
