define([
	'jquery'
], function ($) {
	'use strict';

	var defaultOptions = {
		start: 0,
		end: 10000,
		zoom: 1,
		cssClasses: {
			main: 'b-timeline',
			head: 'b-timeline__head',
			headTime: 'b-timeline__head__time',
			headTimeItem: 'b-timeline__head__time__item',
			headTimeItemLine: 'b-timeline__head__time__item__line',
			headFilter: 'b-timeline__head__filter',
			headFilterItem: 'b-timeline__head__filter__item',
			headActionButton: 'b-timeline__head__filter__button',
			scrollArea: 'b-timeline__scroll-area',
			names: 'b-timeline__names',
			time: 'b-timeline__time',
			itemName: 'b-timeline__names__item',
			itemNamePath: 'b-timeline__names__item__path',
			itemNameShort: 'b-timeline__names__item__short',
			itemTime: 'b-timeline__time__item',
			itemTimeFilled: 'b-timeline__time__item__filled'
		},
		imgExt: [
			'jpg',
			'jpeg',
			'png',
			'gif',
			'bmp'
		]
	};

	function TimeLine($el, options) {
		this.$el = $el;
		this.options = $.extend(true, {}, defaultOptions, options);

		this.zoom = this.options.zoom;

		this.$main = $('<div></div>')
			.addClass(this.options.cssClasses.main)
			.appendTo(this.$el);

		this.renderHead();

		this.$scrollArea = $('<div></div>')
			.addClass(this.options.cssClasses.scrollArea)
			.appendTo(this.$main);

		this.$names = $('<div></div>')
			.addClass(this.options.cssClasses.names)
			.appendTo(this.$scrollArea);

		this.$time = $('<div></div>')
			.addClass(this.options.cssClasses.time)
			.on('scroll', this.onTimeScroll.bind(this))
			.appendTo(this.$scrollArea);

		this.renderItems(this.options.items);

		this.bindEvents();
	}

	TimeLine.prototype = {

		renderItems: function (items) {
			items
				.sort(function (a, b) {
					if (a.startTime > b.startTime) {
						return 1;
					}
					if (a.startTime < b.startTime) {
						return -1;
					}

					return 0;
				})
				.forEach(function (item) {
					this.add(item);
				}.bind(this));
		},

		renderHead: function () {

			this.$head = $('<div></div>')
				.addClass(this.options.cssClasses.head)
				.appendTo(this.$main);

			this.$headFilter = $('<div></div>')
				.addClass(this.options.cssClasses.headFilter)
				.appendTo(this.$head);

			$('<span>all</span>')
				.addClass(this.options.cssClasses.headFilterItem + ' selected')
				.data('type', 'all')
				.appendTo(this.$headFilter);
			$('<span>js</span>')
				.addClass(this.options.cssClasses.headFilterItem)
				.data('type', 'js')
				.appendTo(this.$headFilter);
			$('<span>css</span>')
				.addClass(this.options.cssClasses.headFilterItem)
				.data('type', 'css')
				.appendTo(this.$headFilter);
			$('<span>images</span>')
				.addClass(this.options.cssClasses.headFilterItem)
				.data('type', 'images')
				.appendTo(this.$headFilter);

			$('<span>&#43;</span>')
				.addClass(this.options.cssClasses.headActionButton)
				.data('type', 'plus')
				.appendTo(this.$headFilter);
			$('<span>&#45;</span>')
				.addClass(this.options.cssClasses.headActionButton)
				.data('type', 'minus')
				.appendTo(this.$headFilter);

			this.$headTime = $('<div></div>')
				.addClass(this.options.cssClasses.headTime)
				.appendTo(this.$head);

			this.renderHeadTimeItems();
		},

		renderHeadTimeItems: function () {
			var i,
				$timeHeadItem;

			this.$headTime.empty();

			for (i = 100; i < 10000; i += 100) {
				$timeHeadItem = $('<div></div>')
					.addClass(this.options.cssClasses.headTimeItem)
					.css({
						left: this.translateToPixel(i)
					})
					.html(i)
					.appendTo(this.$headTime);

				$('<div></div>')
					.addClass(this.options.cssClasses.headTimeItemLine)
					.appendTo($timeHeadItem)
			}
		},

		add: function (entry) {
			var $time,
				$name;

			$name = $('<div></div>')
				.addClass(this.options.cssClasses.itemName)
				.attr({
					title: entry.name
				})
				.appendTo(this.$names);

			$('<div></div>')
				.addClass(this.options.cssClasses.itemNameShort)
				.html(entry.name.split('/').pop())
				.appendTo($name);

			$('<div></div>')
				.addClass(this.options.cssClasses.itemNamePath)
				.html(entry.name)
				.appendTo($name);

			$time = $('<div></div>')
				.attr({
					title: entry.name
				})
				.addClass(this.options.cssClasses.itemTime)
				.appendTo(this.$time);

			$('<div></div>')
				.addClass(this.options.cssClasses.itemTimeFilled)
				.css({
					left: this.translateToPixel(entry.startTime)
				})
				.width(this.translateToPixel(entry.responseEnd - entry.startTime))
				.appendTo($time);
		},

		clear: function () {
			this.$names.empty();
			this.$time.empty();
		},

		translateToPixel: function (value) {
			return this.zoom * value;
		},

		bindEvents: function () {
			this.$headFilter.on('click', this.onHeadFilter.bind(this));
		},

		onTimeScroll: function (event) {
			this.$headTime.css({
				left: -this.$time.scrollLeft() + 300
			});
		},

		onHeadFilter: function (event) {
			var $target = $(event.target),
				type = $target.data('type'),
				filteredItems;

			if (type) {
				this.clear();

				switch (type) {
					case 'all':
						this.renderItems(this.options.items);
						break;
					case 'js':
						filteredItems = this.options.items.filter(function (item) {
							return item.name.indexOf('.js') !== -1;
						});
						this.renderItems(filteredItems);
						break;
					case 'css':
						filteredItems = this.options.items.filter(function (item) {
							return item.name.indexOf('.css') !== -1;
						});
						this.renderItems(filteredItems);
						break;
					case 'images':
						filteredItems = this.options.items.filter(function (item) {
							var result = false;

							this.options.imgExt.forEach(function (ext) {
								if (item.name.indexOf('.' + ext) !== -1) {
									result = true;
								}
							});
							return result;
						}.bind(this));
						this.renderItems(filteredItems);
						break;

					case 'plus':
						if (this.zoom > 1) {
							this.zoom++;
						} else {
							this.zoom += .1;
						}
						this.renderHeadTimeItems();
						this.renderItems(this.options.items);
						break;

					case 'minus':
						if (this.zoom > 1) {
							this.zoom--;
						} else if (this.zoom > 0) {
							this.zoom -= .1
						}
						this.renderHeadTimeItems();
						this.renderItems(this.options.items);
						break;
				}

				this.$headFilter.find('.' + this.options.cssClasses.headFilterItem).removeClass('selected');
				$target.addClass('selected');
			}
		}

	};

	return TimeLine;
});