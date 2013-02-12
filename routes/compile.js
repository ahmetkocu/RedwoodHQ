var spawn = require('child_process').spawn;
var compileProcs = {};
var path = require('path');

exports.operation = function(msg, id,callback,onFinish){
    if (compileProcs[id] != undefined){
        compileProcs[id].proc.kill();
    }
    //var buildDir = __dirname.replace("\\routes","")+"/public/automationscripts/"+msg.project;
    //var antDir = __dirname.replace("\\routes","")+"/vendor/ant/bin/";
    var buildDir = path.resolve(__dirname,"../public/automationscripts/"+msg.project)+"/";
    var antDir = path.resolve(__dirname,"../vendor/ant/bin/")+"/";
    var javaDir = path.resolve(__dirname,"../vendor/Java");
    compileProcs[id] = {proc:spawn(antDir+'ant.bat',['clean','compile','jar'],{cwd: buildDir,timeout:1800000,env:{JAVA_HOME:javaDir}}),status:"compile"};
    console.log(antDir);
    console.log(buildDir);
    compileProcs[id].proc.stdout.on('data', function(data) {
        //console.log(data.toString());
        callback(data.toString());
    });
    compileProcs[id].proc.on('exit', function(data){
        //if compile is done do build
        //if (compileProcs[id].status == "compile"){
        //    compileProcs[id] = {proc:spawn('ant/bin/ant.bat',['build'],{cwd: "public/automationscripts",timeout:1800000}),status:"build"};
        //}
        //else{
        delete compileProcs[id];
        if (onFinish){
            onFinish();
        }
        //}
    });
    callback("");


};