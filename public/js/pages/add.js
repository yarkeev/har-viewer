define([
	'jquery',
	'sources/iframe',
	'sources/file',
	'templates/pages/add/main',
	'templates/pages/add/url-form',
	'templates/pages/add/file-form'
], function (
	$,
	SourceIframe,
	SourceFile,
	addPageTmpl,
	urlFormUrl,
	fileFormUrl
) {
	'use strict';

	var defaultOptions = {
		cssClasses: {
			modeItem: 'b-har-viewer__add__mode__item',
			form: 'b-har-viewer__add__form',
			formUrlInput: 'b-har-viewer__add__form__url__input',
			formUrlButton: 'b-har-viewer__add__form__url__button',
			formFileInput: 'b-har-viewer__add__form__file__input'
		}
	};

	function AddPage($parent, options) {
		this.$parent = $parent.empty();
		this.options = $.extend(true, {}, defaultOptions, options);
		this.$el = $(addPageTmpl()).appendTo(this.$parent);

		this.$form = this.$el.find('.' + this.options.cssClasses.form);

		this.renderUrlForm();

		this.bindEvents();
	}

	AddPage.prototype = {

		renderUrlForm: function () {
			$(urlFormUrl()).appendTo(this.$form.empty());
			this.$url = this.$form.find('.' + this.options.cssClasses.formUrlInput);
		},

		renderFileForm: function () {
			$(fileFormUrl()).appendTo(this.$form.empty());
			this.$file = this.$form.find('.' + this.options.cssClasses.formFileInput);
			this.$file.on('change', this.onFileChange.bind(this));
		},

		bindEvents: function () {
			this.$el.find('.' + this.options.cssClasses.modeItem).on('click', this.onModeItemClick.bind(this));
			this.$el.on('click', this.onClick.bind(this));

			$(document.body).on('drop', this.onBodyDrop.bind(this));
			$(document.body).on('dragover', this.onBodyDragOver.bind(this));
		},

		onModeItemClick: function (event) {
			var $target = $(event.target),
				type = $target.data('type');

			switch (type) {
				case 'url':
					this.renderUrlForm();
					break;
				case 'file':
					this.renderFileForm();
					break;
			}

			this.$el.find('.' + this.options.cssClasses.modeItem).removeClass('selected');
			$target.addClass('selected');
		},

		onClick: function (event) {
			if ($(event.target).hasClass(this.options.cssClasses.formUrlButton)) {
				this.onFormUrlButtonClick(event);
			}
		},

		onFormUrlButtonClick: function (event) {
			new SourceIframe({
				url: this.$url.val(),
				callback: function (har) {
					this.options.onAddItem(har);
				}.bind(this)
			});
		},

		onFileChange: function (event) {
			new SourceFile({
				files: event.originalEvent.target.files,
				callback: function (entries, name) {
					this.options.onAddItem(name, entries);
				}.bind(this)
			});
		},

		onBodyDragOver: function (event) {
			event.preventDefault();
			event.stopPropagation();
		},

		onBodyDrop: function (event) {
			event.preventDefault();
			event.stopPropagation();

			new SourceFile({
				files: event.originalEvent.dataTransfer.files,
				callback: function (har) {
					this.options.onAddItem(har);
				}.bind(this)
			});
		}

	};

	return AddPage;
});