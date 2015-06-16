define([
	'jquery',
	'templates/pages/compare/main',
	'compares/last-js',
	'compares/last-css',
	'compares/last-sprite'
], function (
	$,
	comparePageTmpl,
	CompareLastJs,
	CompareLastCss,
	CompareLastSprite
) {
	'use strict';

	var defaultOptions = {
		cssClasses: {
			select: 'b-har-viewer__compare__form__select',
			button: 'b-har-viewer__compare__form__button',
			content: 'b-har-viewer__compare__content',
			item: 'b-har-viewer__compare__item'
		}
	};

	function TimeLinePage($parent, options) {
		this.$parent = $parent.empty();
		this.options = $.extend(true, {}, defaultOptions, options);
		this.$el = $(comparePageTmpl()).appendTo(this.$parent);

		this.$select = this.$el.find('.' + this.options.cssClasses.select);
		this.$button = this.$el.find('.' + this.options.cssClasses.button);
		this.$content = this.$el.find('.' + this.options.cssClasses.content);

		this.$select.append('<option value="-1" disabled="disabled" selected="selected">select item</option>');

		this.$button.on('click', this.onButtonClick.bind(this));

		this.options.viewer.items.forEach(function (item) {
			this.$select.append('<option value="' + item.name + '">' + item.name + '</option>');
		}.bind(this));

		this.selectedItems = [];
	}

	TimeLinePage.prototype = {

		onButtonClick: function (event) {
			this.options.viewer.items.every(function (item) {
				if (item.name === this.$select.val()) {
					this.selectedItems.push(item);
					this.$select.find('option[value="' + item.name + '"]').attr('disabled', 'disabled');
					return false;
				} else {
					return true;
				}
			}.bind(this));

			this.renderGraphics();
		},

		renderGraphics: function () {
			var $item;

			this.$content.empty();

			$item = $('<div></div>')
				.addClass(this.options.cssClasses.item)
				.appendTo(this.$content);
			new CompareLastJs($item, {
				items: this.selectedItems,
				config: this.options.config
			});

			$item = $('<div></div>')
				.addClass(this.options.cssClasses.item)
				.appendTo(this.$content);
			new CompareLastCss($item, {
				items: this.selectedItems,
				config: this.options.config
			});

			$item = $('<div></div>')
				.addClass(this.options.cssClasses.item)
				.appendTo(this.$content);
			new CompareLastSprite($item, {
				items: this.selectedItems,
				config: this.options.config
			});
		}

	};

	return TimeLinePage;
});