define([
	'jquery',
	'timeline',
	'templates/pages/timeline/main'
], function (
	$,
	TimeLine,
	timelinePageTmpl
) {
	'use strict';

	var defaultOptions = {
		cssClasses: {
			select: 'b-har-viewer__timeline__select',
			content: 'b-har-viewer__timeline__content'
		}
	};

	function TimeLinePage($parent, options) {
		this.$parent = $parent.empty();
		this.options = $.extend(true, {}, defaultOptions, options);
		this.$el = $(timelinePageTmpl()).appendTo(this.$parent);

		this.$select = this.$el.find('.' + this.options.cssClasses.select);
		this.$content = this.$el.find('.' + this.options.cssClasses.content);

		this.$select
			.on('change', this.onSelectChange.bind(this))
			.append('<option value="-1" disabled="disabled" selected="selected">select item</option>');

		this.options.viewer.items.forEach(function (item) {
			this.$select.append('<option value="' + item.name + '">' + item.name + '</option>');
		}.bind(this));
	}

	TimeLinePage.prototype = {

		onSelectChange: function (event) {
			this.$content.empty();

			this.options.viewer.items.every(function (item) {
				if (item.name === this.$select.val()) {
					new TimeLine(this.$content, {
						items: item.entries
					});
					return false;
				} else {
					return true;
				}
			}.bind(this));
		}

	};

	return TimeLinePage;
});