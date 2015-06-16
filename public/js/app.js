requirejs.config({
	baseUrl: '/js',
	paths: {
		jquery: '/js/libs/jquery',
		handlebars: '/js/libs/handlebars'
	}
});

requirejs([
	'jquery',
	'har-viewer'
], function ($, HarViewer) {
	new HarViewer($(document.body));
});