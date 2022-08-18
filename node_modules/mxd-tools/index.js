const fs = require("fs");

const tools = require("./lib/index.js");
const pkg = JSON.parse(fs.readFileSync("./package.json"));

module.exports = {
  name:"mxd-tools",
  version:"0.0.8",
  author:"Mxdies",
  tools:tools
}
