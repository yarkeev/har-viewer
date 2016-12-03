define([
	'jquery'
], function ($) {
	'use strict';

	function SourceFile(options) {
		this.options = $.extend(true, {}, options);

		Array.prototype.forEach.call(this.options.files, function (item) {
			var reader = new FileReader();

			reader.onload = function (event) {
				var har = JSON.parse(event.target.result),
					startPageTime,
					entries = [],
					arFileName,
					fileName;

				if (item.name.indexOf('.') !== -1) {
					arFileName =  item.name.split('.');
					arFileName.pop();
					fileName = arFileName.join('.');
				} else {
					fileName = item.name;
				}

				if (har && har.log && har.log.pages && har.log.pages[0]) {
					startPageTime = new Date(har.log.pages[0].startedDateTime).getTime();

					har.log.entries.forEach(function (item) {
						var start = new Date(item.startedDateTime).getTime() - startPageTime;

						entries.push({
							name: item.request.url,
							startTime: start,
							responseEnd: start + item.time
						});
					});

					if (this.options.callback) {
						this.options.callback({
							entries: entries,
							name: fileName,
							title: har.log.pages[0].title
						});
					}
				} else {
					this.options.callback({
						err: 'invalid file',
						name: fileName
					});
				}
			}.bind(this);

			reader.readAsText(item);
		}.bind(this));

	}

	return SourceFile;
});