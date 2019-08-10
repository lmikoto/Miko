// 拷贝库到public文件
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

// const editor

const editorSrc = path.resolve(__dirname, "../editor/dist");
const editorTarget = path.resolve(__dirname, "../public/editor");

const editorList = ["simplemde.min.css", "simplemde.min.js"];

if (!fs.existsSync(editorTarget)) {
  fs.mkdirSync(editorTarget);
}
for (let i = 0; i < editorList.length; i++) {
  fs.copyFileSync(
    path.resolve(editorSrc, editorList[i]),
    path.resolve(editorTarget, editorList[i])
  );
}
