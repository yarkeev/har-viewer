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
					startPageTime = new Date(har.log.pages[0].startedDateTime).getTime(),
					entries = [],
					arFileName,
					fileName;

				har.log.entries.forEach(function (item) {
					var start = new Date(item.startedDateTime).getTime() - startPageTime;

					entries.push({
						name: item.request.url,
						startTime: start,
						responseEnd: start + item.time
					});
				});

				if (this.options.callback) {
					arFileName = item.name.split('.');
					arFileName.pop();
					fileName = arFileName.join('.');
					this.options.callback({
						entries: entries,
						name: fileName,
						title: har.log.pages[0].title
					});
				}
			}.bind(this);

			reader.readAsText(item);
		}.bind(this));

	}

	return SourceFile;
});