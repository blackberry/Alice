desc("runs build");
task("default", ["build"], function () {});

desc("combines the source files");
task("build", [], function () {

    console.log("building Alice.js ...");

    var fs = require('fs'),
        childProcess = require('child_process'),
        output = "";


    console.log(" - including alice.core.js");
    output += fs.readFileSync("js/src/alice.core.js", "utf-8");
    console.log(" - including alice.plugins.cheshire.js");
    output += fs.readFileSync("js/src/alice.plugins.cheshire.js", "utf-8");
    console.log("writing: js/alice.js");
    fs.writeFileSync("js/alice.js", output);
    console.log("minifying: js/alice-min.js");
    childProcess.exec("uglifyjs js/alice.js > js/alice-min.js", complete);
}, true);
