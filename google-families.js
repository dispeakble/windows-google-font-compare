(function($){

	// API URL with my own key. Please get your own if you want to use it.
	var api = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBUK3PeqSEzwPNIyg94dBQpziFOPvm7-aA&sort=style';
	// Will hold the font data returned by the API for future filtering operations
	var fontData;
	// Cached reference
	var head = $("head");
	// Minimum font variants to show a font
	var minVariants = 2;
	// Template for a single font
	var template = _.template($("#font-template").html());
	// Manually exclude these stupid fonts
	var manualExcludes = ['Averia Libre', 'Averia Sans Libre', 'Averia Serif Libre'];

    var winFonts = ["Arial, Helvetica, sans-serif",
            "'Arial Black', Gadget, sans-serif",
            "'Comic Sans MS', Textile, cursive",
            "'Courier New', Courier, monospace",
            "Georgia, 'Times New Roman', Times, serif",
            "Impact, Charcoal, sans-serif",
            "'Lucida Console', Monaco, monospace",
            "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
            "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
            "Tahoma, Geneva, sans-serif",
            "'Times New Roman', Times, serif",
            "'Trebuchet MS', Helvetica, sans-serif",
            "Verdana, Geneva, sans-serif"];

    var Font = Backbone.Model.extend({
		extUrlRoot: 'http://www.google.com/webfonts/specimen/',
		// normalize our font data a bit
		getFontData: function() {
			var fontData = this.toJSON();
			fontData.extlink = this.extUrlRoot + encodeURIComponent(fontData.family);
			fontData.variants = _.map(fontData.variants, function(val){
				return val.replace(/italic$/, ' italic');
			});
			return fontData;
		}
	});

	var FontView = Backbone.View.extend({
		className: 'font',
		template: template,
		apiBase: 'http://fonts.googleapis.com/css?family=',
		render: function() {
			var fontData = this.model.getFontData();
            //console.log(fontData.variants);
            this.getFont();
            this.$el.html(this.template(fontData));
		},
		getFont: function() {
			var fontData = this.model.toJSON(),
				tail = fontData.family + ':' + fontData.variants.join(',') + '&text=' + fontData.family + 'Iitalic1234567890',
				url = this.apiBase + tail;
			$('<link rel="stylesheet" href="'+url+'" >').appendTo(head);
		}
	});

	var Fonts = Backbone.Collection.extend({
		model: Font
	});
	var fonts = new Fonts();

	var FontsView = Backbone.View.extend({
		collection: fonts,
		render: function() {
			$(".googFontCount").text(this.collection.length);
			this.collection.forEach(this.addOne, this);
		},
		addOne: function(font) {
			var fontView = new FontView({model: font});
			fontView.render();
			this.$el.append(fontView.el);
		}
	});
	var fontsView = new FontsView();

	var renderFonts = function(data) {
		if ( data.kind !== "webfonts#webfontList" )
			return;

		var items = _.filter(data.items, function(item){
			return item.variants.length >= minVariants && manualExcludes.indexOf(item.family) == -1 &&
                item.variants.indexOf('italic') != -1 && item.variants.indexOf('700') != -1  ;
		});
        console.log(items);

		fontData = items;
		fonts.reset(items);
		fontsView.render();
		$("#fonts").html(fontsView.el);

        var winFontTemplate = _.template($("#font-template").html());
        for ( var i = 0; i < winFonts.length; i++) {
            $('#fontsComp').append($('<div class="font">' + winFontTemplate({
                extlink: '',
                family: winFonts[i],
                variants: []
            })+ '</div>'));
        }

    };

	jQuery(document).ready(function() {
		$.ajax(api, {
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: renderFonts
		});
	});

})(jQuery);