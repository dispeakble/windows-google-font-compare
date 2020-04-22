(function($){

	// API URL with my own key. Please get your own if you want to use it.
	var api = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDUvQY9qd14Zvq7FrNl5hFRGgQ5sj0tbhE&sort=style';
	// Will hold the font data returned by the API for future filtering operations
	var fontData;
	// Cached reference
	var head = $("head");
	// Minimum font variants to show a font
	var minVariants = 1;
	// Template for a single font
	var template = _.template($("#font-template").html());
	// Manually exclude these stupid fonts
	var manualExcludes = ['Averia Libre', 'Averia Sans Libre', 'Averia Serif Libre'];

	/*
"Arial",
"'Arial Black'",
"'Book Antiqua'",
"Charcoal",
"'Comic Sans MS'",
"Courier",
"'Courier New'",
"Cursive",
"Gadget",
"Geneva",
"Georgia",
"Helvetica",
"Impact",
"'Lucida Console'",
"'Lucida Grande'",
"'Lucida Sans Unicode'",
"Monaco",
"'MS Sans Serif'",
"'MS Serif'",
"'New York'",
"Palatino",
"'Palatino Linotype'",
"Tahoma",
"Textile",
"Times",
"'Times New Roman'",
"'Trebuchet MS'",
"Verdana"

	* */

    /*var winFonts = ["Arial, Helvetica, sans-serif",
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
            "Verdana, Geneva, sans-serif"];*/
    var winFonts = ["Arial",
		"'Arial Black'",
		"'Book Antiqua'",
		"Charcoal",
		"'Comic Sans MS'",
		"Courier",
		"'Courier New'",
		"Cursive",
		"Gadget",
		"Geneva",
		"Georgia",
		"Helvetica",
		"Impact",
		"'Lucida Console'",
		"'Lucida Grande'",
		"'Lucida Sans Unicode'",
		"Monaco",
		"'MS Sans Serif'",
		"'MS Serif'",
		"'New York'",
		"Palatino",
		"'Palatino Linotype'",
		"Tahoma",
		"Textile",
		"Times",
		"'Times New Roman'",
		"'Trebuchet MS'",
		"Verdana"];

    var subset_characters = {
    	'def':["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,'],
    	'japanese':["一九七二人入八力十下三千上口土夕大女子小山川五天中六円手文日月木水火犬王正出本右四左玉生田白目石立百年休先名字早気竹糸耳虫村男町花見貝赤足車学林空金雨青草音校森", "道番間雲園数新楽話遠電鳴歌算語読聞線親頭曜顔", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,'],
    	'korean':["ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ", "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,'],
    	'greek':["ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ", "αβγδεζηθικλμνξοπρσςτυφχψω", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,'],
    	'hebrew':["אבבּגדהוזחטיךךּככּלםמןנסעףפפּץצקרשׁשׂתתּ", "אבבּגדהוזחטיךךּככּלםמןנסעףפפּץצקרשׁשׂתתּ", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,'],
    	'vietnamese':["AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY", "aăâbcdđeêghiklmnoôơpqrstuưvxy", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,'],
    	'cyrillic':["АБВГДЕЖꙂꙀИІКЛМНОПРСТОУФХѠЦЧШЩЪЪІЬѢꙖѤЮѪѬѦѨѮѰѲѴҀ", "абвгдеёжзийклмнопрстуфхцчшщъыьэюя", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,'],
    	'chinese-simplified':["诶比西迪伊艾弗吉艾尺艾杰开艾勒艾马艾娜哦屁吉吾艾儿艾丝提伊吾维豆贝尔维艾克斯吾艾贼德", "诶比西迪伊艾弗吉艾尺艾杰开艾勒艾马艾娜哦屁吉吾艾儿艾丝提伊吾维豆贝尔维艾克斯吾艾贼德", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,'],
    	'chinese-traditional':["電買車紅無東馬風愛時鳥島語頭魚園長紙書見響假佛德拜黑冰兔妒每壤步巢惠莓圓聽實證龍賣龜藝戰繩繪鐵圖團轉廣惡豐腦雜壓雞鷄總價樂歸氣廳發勞劍歲權燒贊兩譯觀營處齒驛櫻產藥讀顏畫聲學體點麥蟲舊會萬盜寶國醫雙晝觸來黃區", "abcdefghijklmnopqrstuvwxyz", '+_)(*&^%$#@!~}{|":?><=-098765432`][\\;/.,']
	};

    var current_font_text = [];

    var Font = Backbone.Model.extend({
		extUrlRoot: 'https://fonts.google.com/specimen/',
		// normalize our font data a bit
		getFontData: function() {
			var fontData = this.toJSON();
			fontData.extlink = this.extUrlRoot + encodeURIComponent(fontData.family);
			if(fontData.family.indexOf(' ') > -1){
				fontData.family = "'" + fontData.family + "'";
			}


			fontData.variants = _.map(fontData.variants, function(val){
				return val.replace(/italic$/, ' italic');
			});
			return fontData;
		}
	});

	var FontView = Backbone.View.extend({
		className: 'font',
		template: template,
		apiBase: 'https://fonts.googleapis.com/css?family=',
		render: function() {
			var subset_value = $('#subset').val();
			if(subset_characters.hasOwnProperty(subset_value)){
				current_font_text = subset_characters[subset_value];
			} else {
				current_font_text = subset_characters['def'];
			}
			var fontData = this.model.getFontData();
			fontData.text = current_font_text;
            //console.log(fontData.variants);
            this.getFont();
            this.$el.html(this.template(fontData));
		},
		getFont: function() {
			var fontData = this.model.toJSON(),
				tail = fontData.family + ':' + fontData.variants.join(','), // '&text=' + fontData.family + 'Iitalic1234567890',
				url = this.apiBase + tail;
            //console.log(url);
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
			this.$el.empty();
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

		/*var items = _.filter(data.items, function(item){
			return item.variants.indexOf('italic') != -1 && item.variants.indexOf('700') != -1  ;
		});*/

		var items = _.filter(data.items, function(item){
			return item.subsets.indexOf($('#subset').val()) != -1  ;
		});

		//var items = data.items;

		fontData = items;
		fonts.reset(items);
		fontsView.render();
		$("#google").html(fontsView.el);

        var winFontTemplate = _.template($("#font-template").html());
		var subset_value = $('#subset').val();
		if(subset_characters.hasOwnProperty(subset_value)){
			current_font_text = subset_characters[subset_value];
		} else {
			current_font_text = subset_characters['def'];
		}
        for ( var i = 0; i < winFonts.length; i++) {
            $('#windows').append($('<div class="font">' + winFontTemplate({
                extlink: '',
				text:current_font_text,
                family: winFonts[i],
                variants: []
            })+ '</div>'));

            $('.font').draggable({
				revert: true,
				helper:"clone"
			})
        }

    };

	function between(x, min, max) {
		return x >= min && x <= max;
	}

	function compare(vendor, type){

		$('#' + vendor).on('click', '.font_text_' + type, function (ev) {
			var container = $(this).parent();
			container[0].scrollIntoView(true);
			var error_margin = +$('#error_margin').val();
			var compare_to = '#' + (vendor === 'google' ? 'windows' : 'google');
			$(compare_to + ' .font').hide();
			var matches = [];
			var this_uc_width = $(this).width();
			var source_name = vendor + ' ' + $(this).parent().find('a').html();
			$(compare_to + ' .font').each((i, el) => {
				$(el).show();
				var uc_width = $(el).find('.font_text_'  + type).width();
				$(el).hide();
				if(between(this_uc_width, uc_width - error_margin, uc_width + error_margin)){
					$(el).show();
					matches.push($(el).find('a').html());
				}
			});
			console.log(source_name + ' matched ' + JSON.stringify(matches));
		});

	}

	jQuery(document).ready(function() {
		$.ajax(api, {
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: renderFonts
		});

		var types = ['uppercase', 'lowercase'];
		var dir = ['google', 'windows'];

		for(var d = 0; d<2; d++){
			for(var t = 0; t<2; t++){
				compare(dir[d], types[t])
			}
		}

		$('#reset').on('click', function(){
			$('.font').show();
		});

		$('body').on('mouseenter', '.font', function(){
			$('.overlap').hide();
			$(this).find('.overlap').show();
		})

		$('#subset').on('change', function(evt){
			$('#google').empty();
			$('#windows').empty();
			$.ajax(api, {
				dataType: 'jsonp',
				jsonpCallback: 'callback',
				success: renderFonts
			});
		})



	});

})(jQuery);