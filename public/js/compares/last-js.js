define([
	'jquery',
	'libs/highcharts'
], function ($) {
	'use strict';

	function CompareLastJs($parent, options) {
		var items = [];

		this.options = $.extend(true, {}, options);

		this.options.items.forEach(function (item) {
			var entries = item.entries
				.filter(function (entry) {
					return entry.name.indexOf('.js') !== -1;
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
					var config;

					if (this.options.config) {
						Object.keys(this.options.config).every(function (host) {
							if (item.title.indexOf(host) !== -1) {
								config = this.options.config[host];
								return false;
							} else {
								return true;
							}
						}.bind(this));

						if (config && config.js && config.js.compare && config.js.compare.host) {
							return new RegExp(config.js.compare.host).test(entry.name);
						} else {
							return true;
						}
					} else {
						return true;
					}
				}.bind(this));

			items.push({
				name: item.name,
				y: entries[0].responseEnd - item.entries[0].responseEnd
			});
		}.bind(this));

		$parent.highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: 'Download time of the last javascript file'
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

	return CompareLastJs;
});