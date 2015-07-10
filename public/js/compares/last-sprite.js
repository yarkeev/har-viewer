define([
	'jquery',
	'libs/highcharts'
], function ($) {
	'use strict';

	function CompareLastSprite($parent, options) {
		var items = [];

		this.options = $.extend(true, {}, options);

		this.options.items.forEach(function (item) {
			var entries = item.entries
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
						isSprite = false;

					if (this.options.config) {
						Object.keys(this.options.config).every(function (host) {
							if (item.title.indexOf(host) !== -1) {
								config = this.options.config[host];
								return false;
							} else {
								return true;
							}
						}.bind(this));

						if (config && config.sprite && config.sprite.compare && config.sprite.compare.url) {
							config.sprite.compare.url.every(function (url) {
								isSprite = new RegExp(url).test(entry.name);
								return !isSprite
							});
							return isSprite;
						} else {
							return true;
						}
					} else {
						return true;
					}
				}.bind(this));

			items.push({
				name: item.name,
				y: entries[0].responseEnd - item.entries[item.entries.length - 1].responseEnd
			});
		}.bind(this));

		$parent.highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: 'download time of the last sprite file'
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

	return CompareLastSprite;
});