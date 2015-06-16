define([
	'jquery'
], function ($) {
	'use strict';

	var defaultOptions = {};

	function SourceIframe(options) {
		this.options = $.extend(true, {}, defaultOptions, options);

		this._createIframe();
	}

	SourceIframe.prototype = {

		_createIframe: function () {
			var iframeWindow;

			this.$iframe = $('<iframe />')
				.attr('src', this.options.url)
				.hide()
				.appendTo(document.body);

			iframeWindow = this.$iframe.get(0).contentWindow;
			iframeWindow.performance.onwebkitresourcetimingbufferfull = function () {
				iframeWindow.performance.webkitSetResourceTimingBufferSize(1000);
			};
			setTimeout(this._onIframeLoad.bind(this), 10000);
		},

		_onIframeLoad: function () {
			var iframeWindow = this.$iframe.get(0).contentWindow,
				entries = iframeWindow.performance.getEntries();

			if (this.options.callback) {
				this.options.callback({
					entries: entries,
					name: iframeWindow.location.href,
					title: iframeWindow.document.title
				});
			}
		}

	};

	return SourceIframe;
});