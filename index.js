#!/usr/bin/env node

var finalhandler = require('finalhandler'),
	http = require('http'),
	serveStatic = require('serve-static'),
	program = require('commander'),
	fs = require('fs'),
	path = require('path'),
	Handlebars = require('handlebars'),
	baseDir = path.dirname(path.resolve(path.dirname(process.argv[1]), fs.readlinkSync(process.argv[1]))),
	serve = serveStatic(path.resolve(baseDir,'public')),
	port = 3000,
	server = http.createServer(function(req, res){
		var done;

		if (req.url === '/') {
			fs.readFile(path.resolve(baseDir, 'templates/index.hbs'), function (err, content) {
				var template;

				if (err) {
					console.log(err);
				} else {
					template = Handlebars.compile(content.toString());
					res.writeHead(200, {
						'Content-Type': 'text/html' + '; charset=UTF-8'
					});
					res.write(template({
						config: config
					}));
					res.end();
				}
			});
		} else if (req.url === '/config') {
			res.writeHead(200, {
				'Content-Type': 'application/json' + '; charset=UTF-8'
			});
			res.write(config);
			res.end();
		} else {
			done = finalhandler(req, res);
			serve(req, res, done);
		}
	}),
	config = '';

program
	.version('0.0.9')
	.option('-c, --config [value]', 'Path to config')
	.option('-p, --port [value]', 'Port to use [3000]')
	.parse(process.argv);

if (program.config) {
	fs.readFile(program.config, function (err, content) {
		if (err) {
			console.log(err);
		} else {
			config = content.toString();
			server.listen(port);
		}
	});
} else {
	server.listen(port);
}

console.log('Starting up har viewer on http://127.0.0.1:' + port);

