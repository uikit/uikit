// Generate Stylus Files
var recursive = require('recursive-readdir');
var async = require('async');
var path = require('path');
var exec = require('child_process').exec;

// Read files
recursive(__dirname + '/src/less/', function(err, files) {
	// for each .less file
	async.each(files, function(file) {
		// build target path
		var target = file;
		target = target.replace('/src/less/', '/stylus/');
		target = target.replace('.less', '.styl');
		// Execute less2stylus command
		exec('cd src/less && less2stylus ' + file + ' > ' + target, function (err, stdout, stderr) {
			// error
			if (err) throw err;
			// success
			console.log(target + ' build success.');
		});
	}, function(err){
		// error
		throw err;
	});
});