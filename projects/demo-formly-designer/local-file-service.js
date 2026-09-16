const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const args = process.argv.slice(2);
if (args.length < 1 || isNaN(args[1])) {
  console.log("Usage: node local-file-service.js directory port");
  return;
}

const directory = args[0];
const port = args[1];

app.use(express.text());
app.use(express.json({ limit: "5mb" }));

app.get("/files", (request, response) => {
  response.send(getFiles());
});

app.post("/files/load", (request, response) => {
  if (!Array.isArray(request.body)) {
    response.status(400).send("Wrong format");
    return;
  }
  for (let i = 0, l = request.body.length; i < l; i++) {
    if (!validateFilename(request.body[i])) {
      response.status(400).send("Wrong format");
      return;
    }
  }
  const result = [];
  for (let i = 0, l = request.body.length; i < l; i++) {
    const filename = request.body[i];
    if (fs.existsSync(path.join(directory, filename))) {
      result.push({
        filename,
        content: fs.readFileSync(path.join(directory, filename), {
          encoding: "utf8",
          flag: "r",
        }),
      });
    }
  }
  response.send(result);
});

app.post("/files", (request, response) => {
  if (!Array.isArray(request.body)) {
    response.status(400).send("Wrong format");
    return;
  }
  for (let i = 0, l = request.body.length; i < l; i++) {
    saveFile(request.body[i].filename, request.body[i].content);
  }
  response.send("");
});

app.get("/file", (request, response) => {
  const filename = request.query.filename;
  if (!validateFilename(filename)) {
    response.status(400).send("Wrong format");
    return;
  }
  const data = fs.readFileSync(path.join(directory, filename), {
    encoding: "utf8",
    flag: "r",
  });
  response.send(data);
});

app.post("/file", (request, response) => {
  if (saveFile(request.body.filename, request.body.content)) {
    response.send("");
    return;
  }
  response.status(400).send("Wrong format");
});

app.delete("/file", (request, response) => {
  const filename = request.query.filename;
  if (!validateFilename(filename)) {
    response.status(400).send("Wrong format");
    return;
  }
  fs.unlinkSync(path.join(directory, filename));
  response.send("");
});

app.post("/file/rename", (request, response) => {
  let currentFilename = request.body.currentFilename;
  let newFilename = request.body.newFilename;
  if (!validateFilename(currentFilename) || !validateFilename(newFilename)) {
    response.status(400).send("Wrong format");
    return;
  }
  if (fs.existsSync(path.join(directory, newFilename))) {
    response.status(400).send("File exists.");
    return;
  }
  currentFilename = path.join(directory, currentFilename);
  newFilename = path.join(directory, newFilename);
  const dirname = path.dirname(newFilename);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.renameSync(currentFilename, newFilename);
  response.send("");
});

app.listen(port, "localhost");

function getFiles() {
  const dirPath = path.join(directory, "/");
  const files = getFilesRecursive(dirPath);
  return files
    .map((f) => f.replace(dirPath, "").replace(/\\/g, "/"))
    .filter((i) => !i.startsWith("."));
}

function getFilesRecursive(dirPath) {
  const result = [];
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      result.push(...getFilesRecursive(filePath));
    } else {
      result.push(filePath);
    }
  });
  return result;
}

function saveFile(filename, content) {
  if (!validateFilename(filename)) {
    return false;
  }
  filename = path.join(directory, filename);
  const dirname = path.dirname(filename);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(filename, content);
  return true;
}

function validateFilename(filename) {
  if (typeof filename !== "string" || !filename.length) {
    console.error("Filename should be a string with length > 0");
    return false;
  }
  if (filename.indexOf("../") !== -1) {
    console.error("Filename should not contain '../'");
    return false;
  }
  if (/^[\/\\]{2}$/.test(filename)) {
    console.error("Filename should not double slashes");
    return false;
  }
  if (!/^[a-zA-Z0-9\-{}#\.\/\\]*$/.test(filename)) {
    console.error(
      "Filenames should only contain alphanumeric characters, dots, dashes, curly braces, hashes, and slashes",
      filename,
    );
    return false;
  }
  return true;
}
