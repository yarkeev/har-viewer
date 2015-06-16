define([
	'jquery',
	'templates/menu'
], function ($, menuTmpl) {
	'use strict';

	var defaultOptions = {
		cssClasses: {
			item: 'b-har-viewer__menu__item'
		}
	};

	function Menu($parent, options) {
		this.$el = $(menuTmpl()).appendTo($parent);
		this.options = $.extend(true, {}, defaultOptions, options);

		this.$el.find('.' + this.options.cssClasses.item).on('click', this.onItemClick.bind(this));
	}

	Menu.prototype = {

		onItemClick: function (event) {
			var $target = $(event.target);

			if ($target.hasClass(this.options.cssClasses.item)) {
				if (this.options.onSelectedChange) {
					this.options.onSelectedChange($target.data('page'));
				}

				this.$el.find('.' + this.options.cssClasses.item).removeClass('selected');
				$target.addClass('selected');
			}
		}
	};

	return Menu;
});