desc("runs build");
task("default", ["build"], function () {});

desc("combines the source files");
task("build", [], function () {

    console.log("building Alice.js ...");

    var fs = require('fs'),
        zlib = require('zlib'),
        gzip = zlib.createGzip(),
        ginp = "",
        gout = '',
        childProcess = require('child_process'),
        output = "";

    console.log(" - including alice.core.js");
    output += fs.readFileSync("src/alice.core.js", "utf-8");
    console.log(" - including alice.plugins.cheshire.js");
    output += fs.readFileSync("src/alice.plugins.cheshire.js", "utf-8");
    console.log(" - including alice.plugins.caterpillar.js");
    output += fs.readFileSync("src/alice.plugins.caterpillar.js", "utf-8");
    console.log("writing: build/alice.js");
    fs.writeFileSync("build/alice.js", output);
    console.log("minifying: build/alice.min.js");
    childProcess.exec("uglifyjs build/alice.js > build/alice.min.js", complete);
    console.log("gzipping: build/alice.min.js");
    setTimeout(function(){
        ginp = fs.createReadStream('build/alice.min.js');
        gout = fs.createWriteStream('build/alice.min.js.gz');
        ginp.pipe(gzip).pipe(gout);
        console.log("Build Complete."); 
    }, 2000);
}, true);
