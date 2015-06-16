define([
	'jquery',
	'libs/highcharts'
], function ($) {
	'use strict';

	function CompareLastCss($parent, options) {
		var items = [];

		this.options = $.extend(true, {}, options);

		this.options.items.forEach(function (item) {
			var entries = item.entries
				.filter(function (entry) {
					return entry.name.indexOf('.css') !== -1;
				})
				.sort(function (a, b) {
					if (a.responseEnd > b.responseEnd) {
						return -1;
					}
					if (a.responseEnd < b.responseEnd) {
						return 1;
					}

					return 0;
				})
				.filter(function (entry) {
					var config,
						isValidHost,
						isValidName;

					if (this.options.config) {
						Object.keys(this.options.config).every(function (host) {
							if (item.title.indexOf(host) !== -1) {
								config = this.options.config[host];
								return false;
							} else {
								return true;
							}
						}.bind(this));

						if (config && config.css && config.css.compare && config.css.compare.host) {
							isValidHost = new RegExp(config.css.compare.host).test(entry.name);
							if (config.css.compare.name && config.css.compare.name.charAt(0) === '!') {
								isValidName = !(new RegExp(config.css.compare.name.slice(1)).test(entry.name));
							}
							if (config.css.compare.name && config.css.compare.name.charAt(0) !== '!') {
								isValidName = new RegExp(config.css.compare.name).test(entry.name);
							}

							return isValidName && isValidHost;
						} else {
							return true;
						}
					} else {
						return true;
					}
				}.bind(this));

			items.push({
				name: item.name,
				y: Math.round(entries[0].responseEnd - item.entries[0].responseEnd)
			});
		}.bind(this));

		$parent.highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: 'Download time of the last stylesheet file'
			},
			xAxis: {
				type: 'category'
			},
			yAxis: {
				title: {
					text: 'time'
				}
			},
			legend: {
				enabled: false
			},
			series: [{
				name: 'Time',
				colorByPoint: true,
				data: items
			}]
		});
	}

	return CompareLastCss;
});