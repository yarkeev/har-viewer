define([
	'jquery',
	'menu',
	'pages/add',
	'pages/timeline',
	'pages/compare',
	'templates/main'
], function (
	$,
	Menu,
	AddPage,
	TimeLinePage,
	ComparePage,
	mainTmpl
) {
	'use strict';

	var defaultOptions = {
		cssClasses: {
			menu: 'b-har-viewer__menu-wrapper',
			content: 'b-har-viewer__content'
		}
	};

	function HarViewer ($parent, options) {
		this.$parent = $parent;
		this.config = JSON.parse($('#har-viewer-config').html());
		this.options = $.extend(true, {
			config: this.config
		}, defaultOptions, options);

		this.items = [];
		this.render();
	}

	HarViewer.prototype = {

		addItem: function (item) {
			this.items.push(item);
		},

		render: function () {
			this.$el = $(mainTmpl()).appendTo(this.$parent);

			this.$menu = this.$el.find('.' + this.options.cssClasses.menu);
			this.$content = this.$el.find('.' + this.options.cssClasses.content);

			this.showPage('add');

			this.menu = new Menu(this.$menu, {
				onSelectedChange: function (page) {
					this.showPage(page);
				}.bind(this)
			});
		},

		showPage: function (page) {
			switch (page) {
				case 'add':
					new AddPage(this.$content, {
						onAddItem: function (har) {
							this.addItem(har);
						}.bind(this)
					});
					break;
				case 'timeline':
					new TimeLinePage(this.$content, {
						viewer: this
					});
					break;
				case 'compare':
					new ComparePage(this.$content, {
						viewer: this,
						config: this.options.config
					});
					break;
			}
		}

	};

	return HarViewer;

});