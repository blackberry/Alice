desc("runs build");
task("default", ["build"], function () {});

desc("combines the source files");
task("build", [], function () {


    console.log("building");

    var fs = require('fs'),
        childProcess = require('child_process'),
        output = "";


    output += fs.readFileSync("js/src/alice.core.js", "utf-8");
    output += fs.readFileSync("js/src/alice.plugins.cheshire.js", "utf-8");
    fs.writeFileSync("js/alice.js", output);
    childProcess.exec("uglifyjs js/alice.js > js/alice-min.js", complete);
}, true);
