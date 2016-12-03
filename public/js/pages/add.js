define([
	'jquery',
	'sources/file',
	'templates/pages/add/main'
], function (
	$,
	SourceFile,
	addPageTmpl
) {
	'use strict';

	var defaultOptions = {
		cssClasses: {
			
		}
	};

	function AddPage($parent, options) {
		this.$parent = $parent.empty();
		this.options = $.extend(true, {}, defaultOptions, options);
		this.$el = $(addPageTmpl()).appendTo(this.$parent);

		this.bindEvents();
	}

	AddPage.prototype = {

		bindEvents: function () {
			$(document.body).on('drop', this.onBodyDrop.bind(this));
			$(document.body).on('dragover', this.onBodyDragOver.bind(this));
			$(document.body).on('dragleave', this.onBodyDragLeave.bind(this));
		},

		onBodyDragOver: function (event) {
			event.preventDefault();
			event.stopPropagation();

			$(document.body).addClass('drag-over');
		},

		onBodyDragLeave: function (event) {
			$(document.body).removeClass('drag-over');
		},

		onBodyDrop: function (event) {
			event.preventDefault();
			event.stopPropagation();

			new SourceFile({
				files: event.originalEvent.dataTransfer.files,
				callback: function (result) {
					if (result.err) {
						alert(result.name + ' is not a valid');
					} else {
						this.options.onAddItem(result);
					}
				}.bind(this)
			});

			$(document.body).removeClass('drag-over');
		}

	};

	return AddPage;
});