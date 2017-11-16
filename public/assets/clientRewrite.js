var testing = false;
localStorage.edttsg = "1"
if (window.location.href.indexOf("/testing") > 0) {
	testing = true;
}


var spinner_shown = false;
var ldmc = document.createElement("canvas");
var playh = document.getElementById("playh");
var pbdiv;
var profilediv;
var globaldiv;
var btn_save_skin;
var save_btn;
var save_skin;
var playing = false;
var connected = false;
var dead_mtm = -1;
var ui_holder_opacity = 0;
var play_btn;
var profile_btn;
var global_btn;
var vfr;
var snake = null;
var wumsts;
var mc = document.createElement("canvas");
var ggbg = false;
var gbgmc = null;
var gbgi;
var bgi2;
var bgp2 = null;
var bgw2 = 599;
var bgh2 = 519
var ii;
var title_background;



var boost_notif_time;
var notify;

toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": false,
	"progressBar": false,
	"positionClass": "toast-bottom-center",
	"preventDuplicates": true,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "2000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}

const GameScene = Object.freeze({
	MAIN_MENU: Symbol('MAIN_MENU'),
	CHANGE_SKIN_MENU: Symbol('CHANGE_SKIN_MENU'),
	GAME: Symbol('GAME'),
	GAME_OVER: Symbol('GAME_OVER')
});

const Fade = Object.freeze({
	IN: Symbol('IN'),
	OUT: Symbol('OUT'),
	IDLE: Symbol('IDLE')
});

class SceneBuilder {

	buildMainMenuScene() {
		var scene = new Scene();
		var login = document.getElementById("login");
		login.resize = function () {
			var w = Window.width;
			var h = Window.height;

		}
		scene.addElement(login, "inline");
	}
}

class Scene {
	constructor() {
		"use strict";
		this.elements = [];
		this.fade_state = Fade.IDLE;
		this.alpha = 0;
		this.fade_in_rate = 0.05;
		this.fade_out_rate = 0.05;
	};

	addElement(element, display_type) {
		this.elements.push({element: element, display_type: display_type});
	}

	show() {
		"use strict";
		this.fade_state = Fade.IN;
		this.alpha = 0;
		this.elements.forEach(function (e, i) {
			e.element.style.display = e.display_type;
		});
	}

	hide() {
		"use strict";
		this.fade_state = Fade.OUT;
		this.alpha = 1;

	}

	update() {
		"use strict";
		switch (this.fade_state) {
			case Fade.IN: {
				this.alpha += this.fade_in_rate;
				break;
			}

			case Fade.OUT: {
				this.alpha -= this.fade_out_rate;
				break;
			}
		}
		if (this.fade_state !== Fade.IDLE) {
			if (this.alpha < 0) {
				this.alpha = 0;
				this.fade_state = Fade.IDLE;
			} else if (this.alpha > 1) {
				this.alpha = 1;
				this.fade_state = Fade.IDLE;
			}
			this.elements.forEach(function (e) {
				e.element.style.opacity = this.alpha;
				var lgcsc = 1 + .1 * Math.pow(this.alpha, 2);
				var b = Math.round(lgbsc * lgcsc * 1E5) / 1E5;
				if (this.alpha === 0) e.element.style.display = "none";
			});
		}

	}
}


function UI() {

	const title_fade_rate = 0.05;

	var lastww, lasthh;

	var title_fadout = false;
	var time_last_update;

	//Public Functions
	UI.mkBtn = mkBtn;
	UI.makeTextBtn = makeTextBtn;
	UI.setupUI = setupUI;
	UI.setPlayBtnText = setPlayBtnText;
	UI.clickPlayBtn = clickPlayBtn;
	UI.resize = resize;
	UI.update = update;
	UI.beginTitleFadeOut = beginTitleFadeOut;
	UI.transitionToMainMenu = transitionToMainMenu;

	function transitionToMainMenu() {
		//main_menu_ = true;

	}


	function beginTitleFadeOut() {
		"use strict";
		title_fadout = true;
	}

	function doTitleFade(frame) {
		"use strict";
		(doTitleFade.title_fade_ratio) || (doTitleFade.title_fade_ratio = 0);
		doTitleFade.title_fade_ratio += title_fade_rate * frame;
		var fr = doTitleFade.title_fade_ratio;
		//login_fade_rate += .05 * f;
		//choosing_skin && (login_fade_rate += .06 * f);
		if (1 <= fr) {
			save_skin.style.opacity = 1;
			doTitleFade.title_fade_ratio = 0;
			title_fadout = false;
		}
		save_skin.style.opacity = fr;

	}


	function titleFadeOut() {
		"use strict";

	}

	function beginSkinFade() {
		"use strict";

	}

	function update() {
		"use strict";
		//Set default value
		(time_last_update) || (time_last_update = Date.now());

		var now = Date.now();
		var frame = (now - time_last_update) / 25;
		time_last_update = now;

		if (title_fadout) {
			doTitleFade(frame);

		}


	}

	function setupUI() {
		"use strict";
		setupPlayBtn();
		setupProfileBtn();
		setupGlobalBtn();
		setupSaveBtn();
		initFuzzBackground();
	}


	function resize() {
		"use strict";
		var ww = Math.ceil(window.innerWidth);
		var hh = Math.ceil(window.innerHeight);
		if (ww != lastww || hh != lasthh) {
			lastww = ww;
			lasthh = hh;
			var b = 0;

			save_skin.style.left = Math.round(ww / 2 - save_skin.offsetWidth / 2) + "px";
			save_skin.style.top = Math.round(hh / 2 + 120) + "px";
			ldmc.style.left = ww / 2 - 64 + "px";
			ldmc.style.top = hh / 2 - 64 + "px";
			title_background.style.width = ww + "px";
			title_background.style.height = hh + "px";
		}
	}

	function clickPlayBtn() {
		"use strict";
		play_btn.elem.onclick();
	}

	function setupSaveBtn() {
		"use strict";
		var sstr = "Save";
		sstr = String.fromCharCode(160) + sstr + String.fromCharCode(160);
		btn_save_skin = UI.makeTextBtn(sstr, 47, 20, 34, 1);
		save_skin = btn_save_skin.elem;
		save_skin.style.zIndex = 53;
		save_skin.style.position = "fixed";
		save_skin.style.left = "300px";
		save_skin.style.top = "300px";
		save_skin.style.display = "none";
		save_skin.style.opacity = 0;
		//save_skin.style.transition = "opacity 10s";

		document.body.appendChild(save_skin);
		btn_save_skin.elem.onclick = function () {
			if (playing) {
				try {
					localStorage.snakercv = snake.rcv
				} catch (b) {
				}
				playing = connected = !1;
				dead_mtm = Date.now() - 5E3
			}
		};
	}

	function setupProfileBtn() {
		"use strict";
		var str = "Profile";
		str = String.fromCharCode(160) + str + String.fromCharCode(160);
		profile_btn = UI.makeTextBtn(str, 47, 20, 34, 1);
		var profilediv = profile_btn.elem;
		profilediv.style.position = "relative";
		profilediv.style.display = "inline-block";
		profilediv.style.marginTop = "20px";
		profilediv.style.marginBottom = "50px";
		profilediv.style.marginRight = "20px";

		playh.lastElementChild.appendChild(profilediv);

		profile_btn.elem.onclick = function () {
			if (!profile_btn.disabled) {
				var url = "//" + window.location.host + "/stats/profilestats";
				window.location = url;
			}

		};
	}

	function setupGlobalBtn() {
		"use strict";
		var str = "Global Statistics";
		str = String.fromCharCode(160) + str + String.fromCharCode(160);
		global_btn = UI.makeTextBtn(str, 47, 20, 34, 1);
		globaldiv = global_btn.elem;
		globaldiv.style.position = "relative";
		globaldiv.style.display = "inline-block";
		globaldiv.style.marginTop = "20px";
		globaldiv.style.marginBottom = "50px";

		playh.lastElementChild.appendChild(globaldiv);

		global_btn.elem.onclick = function () {
			if (!global_btn.disabled) {
				var url = "//" + window.location.host + "/stats/globalstats";
				window.location = url;
			}

		};
	}

	function setupPlayBtn() {
		"use strict";
		var pstr = "Play";
		pstr = String.fromCharCode(160) + pstr + String.fromCharCode(160);
		play_btn = UI.makeTextBtn(pstr, 47, 20, 34, 1);
		pbdiv = play_btn.elem;
		pbdiv.style.position = "relative";
		pbdiv.style.display = "inline-block";
		pbdiv.style.marginTop = "20px";
		pbdiv.style.marginBottom = "20px";
		playh = document.getElementById("playh");
		playh.style.opacity = 0;
		playh.appendChild(pbdiv);
		var div = document.createElement("div");
		playh.appendChild(div);

		play_btn.elem.onclick = function () {
			if (!play_btn.disabled) {
				GameClient.setReadyToPlay();
				play_btn.setEnabled(false);
				spinner_shown = nick.disabled = true;
				ldmc.style.display = "inline";
			}

		};
	}


	function setPlayBtnText(s) {
		"use strict";
		play_btn.setText(s);
	}

	//Creates fuzzy background
	function initFuzzBackground() {
		"use strict";
		title_background = document.getElementById("title_background");
		var title_background_dataurl;
		var pattern_width = 64;
		var pattern_height = 64;
		var canvas_element = document.createElement("canvas");
		canvas_element.width = pattern_width;
		canvas_element.height = pattern_height;

		var context = canvas_element.getContext("2d");
		var map = context.getImageData(0, 0, pattern_width, pattern_height);
		var image_data = map.data;

		for (var p = 0; p < image_data.length; p += 4) {
			if (Math.random() < 0.5) {
				image_data[p] = image_data[p + 1] = image_data[p + 2] = 0;
			} else {
				//R
				image_data[p] = 44;
				//G
				image_data[p + 1] = 52;
				//B
				image_data[p + 2] = 68;
			}
			//Intensity
			image_data[p + 3] = Math.floor(32 * Math.random());
		}
		context.putImageData(map, 0, 0);
		title_background_dataurl = canvas_element.toDataURL();

		if (title_background_dataurl.length > 32)
			(title_background.style.backgroundImage = "url(" + title_background_dataurl + ")");

	}


	function mkBtn(btn_div) {
		"use strict";
		var div_btn_holder = document.createElement("div");
		if (btn_div.tagName == null) {
			btn_div = document.getElementById(btn_div);
			//		b.style.width = c + "px", b.style.height = h + "px", u.style.width = c + "px", u.style.height = h + "px";
		}
		var q = {};
		q.elem = btn_div;
		q.ho = div_btn_holder;

		q.setEnabled = function (b) {
			"use strict";
			if (b) {
				this.disabled = false;
				this.upi.style.opacity = 0
				this.downi.style.opacity = 0;
				this.elem.style.opacity = 1;
				this.elem.style.cursor = "pointer"

			} else {
				this.disabled = true;
				this.upi.style.opacity = 0;
				this.downi.style.opacity = 0;
				this.elem.style.opacity = .38;
				this.elem.style.cursor = "default"

			}
		};

		if ((/absolute/i).test(btn_div.style.position) || (/fixed/i).test(btn_div.style.position))
			btn_div.style.position = "relative";
		div_btn_holder.style.position = "absolute";
		div_btn_holder.style.opacity = 0;
		div_btn_holder.style.left = "0px";
		div_btn_holder.style.top = "0px";

		btn_div.appendChild(div_btn_holder);
		div_btn_holder.style.opacity = 1;

		btn_div.onmouseenter = function () {
			var button = btn_div.firstChild.children[0];
			if (!button.disabled) {
				button.style.opacity = 1;
			}
		};

		btn_div.onmouseleave = function () {
			var button = btn_div.firstChild.children[0];
			if (!button.disabled) {
				button.style.opacity = 0;
			}
		};

		btn_div.onmousedown = function () {
			var button = this.firstChild.children[1];
			if (!button.disabled) {
				button.style.opacity = 1;
			}
		};

		btn_div.onmouseup = btn_div.ondragend = function () {
			var button = this.firstChild.children[1];
			if (!button.disabled) {
				button.style.opacity = 0;
			}
		};

		window.onmouseup = window.ondragover = window.ondragend = function () {
			document.querySelectorAll('.gradient_primary_down1').forEach(function (button) {
				button.style.opacity = 0;
			});
		};
		return q
	}


	function makeTextBtn(b, btn_height, font_size, border_radius, color) {
		"use strict";
		//Set Default values
		if (!btn_height)
			btn_height = 56;
		if (btn_height > 56)
			btn_height = 56;
		if (!font_size)
			font_size = 15;
		if (!border_radius)
			border_radius = 14;

		var btn_div = document.createElement("div");
		btn_div.className = "btnt nsi gradient_primary" + color;

		var s = btn_div.style;
		s.position = "absolute";
		s.width = "auto";
		s.color = "#ffffff";
		s.fontWeight = "bold";
		s.textAlign = "center";
		s.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
		s.fontSize = font_size + "px";
		s.cursor = "pointer";

		//Set width
		btn_div.textContent = b;
		document.body.appendChild(btn_div);
		var width = Math.ceil(35 + btn_div.offsetWidth);
		document.body.removeChild(btn_div);
		btn_div.textContent = "";

		s.width = width + "px";
		s.height = btn_height + "px";
		s.lineHeight = btn_height + "px";
		is_mobile || (s.boxShadow = "0px 3px 20px rgba(0,0,0, .75)");
		s.borderRadius = border_radius + "px";

		var btn_hover_div = document.createElement("div");
		s = btn_hover_div.style;
		s.position = "absolute";
		s.left = s.top = "0px";
		s.width = width + "px";
		s.height = btn_height + "px";
		s.borderRadius = border_radius + 1 + "px";
		s.opacity = 0;
		btn_hover_div.className = "gradient_primary_up" + color;
		btn_hover_div.style.transition = 'opacity 0.1s';

		var btn_down_div = document.createElement("div");
		s = btn_down_div.style;
		s.position = "absolute";
		s.left = s.top = "-1px";
		s.width = width + 2 + "px";
		s.height = btn_height + 2 + "px";
		s.borderRadius = border_radius + "px";
		s.opacity = 0;
		btn_down_div.className = "gradient_primary_down" + color;
		btn_down_div.style.transition = 'opacity 0.1s';

		var btn = UI.mkBtn(btn_div);
		btn.a = 1;
		btn.ho.appendChild(btn_hover_div);
		btn.upi = btn_hover_div;
		btn.ho.appendChild(btn_down_div);
		btn.downi = btn_down_div;
		btn.ts = font_size;
		btn.ww = width;
		btn.bgm = color;
		btn.setText = function (b) {
			var c = document.createElement("div");
			c.className = "nsi gradient_primary" + this.bgm;
			var e = c.style;
			e.position = "absolute";
			e.width = "auto";
			e.color = "#ffffff";
			e.fontWeight = "bold";
			e.textAlign = "center";
			e.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
			e.fontSize = this.ts + "px";
			c.textContent = b;
			document.body.appendChild(c);
			e = Math.ceil(35 + c.offsetWidth);
			document.body.removeChild(c);
			this.btnf.textContent = b;
			this.ww = e;
			this.elem.style.width = e +
					"px";
			this.upi.style.width = e + "px";
			this.downi.style.width = e + 2 + "px";
			this.btnf.style.width = e + "px"
		};
		font_size = document.createElement("div");
		btn_div.appendChild(font_size);
		btn.btnf = font_size;
		s = font_size.style;
		s.position = "absolute";
		s.left = s.top = "0px";
		s.width = width + "px";
		s.height = btn_height + "px";
		s.borderRadius = border_radius + "px";
		font_size.textContent = b;
		font_size.className = "nsi";
		s.color = "#ffffff";
		s.opacity = .9;
		btn.ho.appendChild(font_size);
		return btn
	}


}


function GameClient() {

	var MainMenuScene = new Scene();
	var SkinMenuScene = new Scene();
	var GameScene = new Scene();


	var ready_to_play = false;

	//new functions
	GameClient.setReadyToPlay = setReadyToPlay;

	function setReadyToPlay() {
		"use strict";
		ready_to_play = 1;
	}


	//snake skin canvases
	var sest = document.createElement("canvas");
	var playbulb = document.createElement("canvas");

	var pwdbulb = document.createElement("canvas");
	var jmou = document.createElement("canvas");
	var kwkbulb = document.createElement("canvas");
	var acbulb = document.createElement("canvas");
	var cdbulb = document.createElement("canvas");
	var rabulb = document.createElement("canvas");
	var jsebi = document.createElement("canvas");
	var jsepi = document.createElement("canvas");

	//Divs used
	var lbh = document.createElement("div");
	var lbs = document.createElement("div");
	var lbn = document.createElement("div");
	var lbp = document.createElement("div");
	var lbf = document.createElement("div");
	var vcm = document.createElement("div");

	var loch = document.createElement("div");
	var myloc = document.createElement("img");
	var asmc = document.createElement("canvas");
	var komc = document.createElement("canvas");
	var kfmc = document.createElement("canvas");
	//var kmc = document.createElement("canvas");
	var ksmc = document.createElement("canvas");


	var ecmc = document.createElement("canvas");
	var kdmc = document.createElement("canvas");

	var context;


	var lmc2 = document.createElement("canvas"),
			lmc = document.createElement("canvas"),
			lgsc = 1,
			lw = 900,
			lh = 270;

	var lctx = lmc.getContext("2d"),
			lctx2 = lmc2.getContext("2d");

	//debug display
	pfd = document.createElement("div");

	//SO MANY GLOBAL VARIABLES....
	var lang;

	var choosing_skin;
	//var etm;
	const pi2 = 2 * Math.PI;

//	var dhx, dhy, hsz;
	var fr = 0,
			lfr = 0,
			ltm = Date.now(),
			vfr = 0,
			vfrb = 0,
			avfr = 0,
			fr2 = 0,
			lfr2 = 0,
			vfrb2 = 0,
			current_packet_time = 0,
			last_packet_time = 0,
			lpstm = 0,
			last_ping_mtm = 0,
			lagging = false,
			lag_mult = 1,
			wfpr = !1,
			high_quality = !0,
			gla = 1,
			wdfg = 0,
			qsm = 1,
			mqsm = 1.7,


			want_close_socket = !1,
			want_victory_message = !1,
			want_victory_focus = !1,
			want_hide_victory = 0,
			hvfr = 0,

			at2lt = new Float32Array(65536);

	var kd_l_frb = 0,
			kd_r_frb = 0,
			keydown_left = !1,
			keydown_right = !1,
			keydown_up = !1,
			lkstm = 0,
			social = document.createElement("iframe");

	var shoa = !1;

	var ss_a = 0,
			ss_sh = 0;


	var protocol_version = 2,
			connecting = !1,
			start_connect_mtm,
			waiting_for_sos = !1,
			sos_ready_after_mtm = -1;

//	var sos = [];

	var clus = [],
			bso, u_m = [64, 32, 16, 8, 4, 2, 1],
			lgbsc = 1,
			lgcsc = 1,
			lb_fr = 0,
			login_fade_rate = 0,
			llgmtm = Date.now(),
			login_iv = -1;

	var tip_pos = -1,
			tip_fr = 1.9;

	var view_xx = 0,
			view_yy = 0,
			view_ang = 0,
			view_dist = 0,
			fvx = 0,
			fvy = 0,
			xm = 0,
			ym = 0,
			lsxm = 0,
			lsym = 0,
			my_nick = "",
			gw2k16 = !1;
	//var snake = null;

	var mscps = 0,
			fmlts = [],
			fpsls = [],
			etm = 0,
			ws = null,
			omcps = 0,
			omfps = 0,
			lomcpstm = 0,
			tcsecs = 0,
			trdps = 0,
			rdps = 0,
			rfps = 0,
			rnps = 0,
			rsps = 0,
			reps = 0,
			rdpspc = [],
			anguc = 0,
			angnuc = 0,
			wangnuc = 0,
			lrd_mtm = Date.now(),
			locu_mtm = 0;

	var s = "";
	var dfscript = s,
			maxp = 0,
			fps = 0;

	var snakes = [];
	var foods = [];
	var foods_c = 0;
	var preys = [];
	var sectors = [];
	var os = {};
	var rank = 0;
	var best_rank = 999999999;
	var snake_count = 0;
	var biggest_snake_count = snake_count;

	var pfs = [];
	var pfd;


	var ww = window.innerWidth,
			hh = window.innerHeight,
			lww = 0,
			lhh = 0,
			csc, game_radius = 16384;


	bgi2 = document.createElement("canvas");
	bgp2 = null;
	bgw2 = 599;
	bgh2 = 519;
	ii = document.createElement("img");

	ggbg = !1;
	gbgmc = null;
	gbgi = document.createElement("img");

	var mww = 850,
			mhh = 700,
			mwwp50 = mww + 50,
			mhhp50 = mhh + 50,
			mwwp150 = mww + 150,
			mhhp150 = mhh + 150,
			mww2 = mww / 2,
			mhh2 = mhh / 2;


	var tips = document.getElementById("tips");
	var tipss = ["Eat to grow longer!", "Don't run into other players!", "When longer, hold the mouse for a speed boost!"];


	var bpx1, bpy1, bpx2, bpy2, fpx1, fpy1, fpx2, fpy2, apx1, apy1, apx2, apy2, sgsc = .9,
			gsc = sgsc,
			nsep = 4.5,
			shifty = !1,
			rr, gg, bb, render_mode = 2;

	var lsfr;


	var flt_a = "ler did no;gas the;gas all;gas every;panis;panus;paynis;my ass;cut your;heil hit;flick your;fingerba;arse;naked;menstr;eat my;eat as;lick as;suck as;suck my;fuk;dong;cunn;penil;suck a;foresk;puto;puta;suck;mierd;bit.ly;ween;wein;wien;peen;turd;wank;crap;ur mom;tu madre;chinga;pu$$;phalus;phallus;verga;culo;kurwa;erect;schlong;ureth;taint;pene".split(";"),
			flt_g = "buttlov buttf smegm therplu eatmy suckm sucka chither entmpw chlther ch1ther erioorg eri0org erio0rg eri00rg erloorg erl0org erlo0rg erl00rg erioco lithere eriodo odskinpr therbot therb0t ragapw mydik urdik heriobo mistik ki11all agarbots rcomwith brazz iomods cunt suckdik slibot iogamep siibot garb0t herioha itherhac sucksdik sukdik deltaloves suksdik hitler assmunch lickmy fuqall fukall tobils yourmom yourmother muslimsare allmuslims themuslim jewsare alljews thejews hateblack lackpeop".split(" "),
			flt_w = ["ass", "kkk"];


	var csk = document.getElementById("csk"),
			cskh = document.getElementById("cskh"),
			want_quality = 1,
			grq = document.getElementById("grq"),
			grqh = document.getElementById("grqh"),
			phqi = document.createElement("img"),
			grqi = document.getElementById("grqi");

	//Snake colors
	var rrs = [192, 144, 128, 128, 238, 255, 255, 255, 224, 255, 144, 80, 255, 40, 100, 120, 72, 160, 255, 56, 56, 78, 255, 101, 128, 60, 0, 217, 255];
	var ggs = [128, 153, 208, 255, 238, 160, 144, 64, 48, 255, 153, 80, 192, 136, 117, 134, 84, 80, 224, 68, 68, 35, 86, 200, 132, 192, 255, 69, 64];
	var bbs = [255, 255, 208, 128, 112, 96, 144, 64, 224, 255, 255, 80, 80, 96, 255, 255, 255, 255, 64, 255, 255, 192, 9, 232, 144, 72, 83, 69, 64];

	var per_color_imgs = [];

	var rfc = 43;
	var rfas = [];
	var afc = 26;
	var afas = [];
	var hfc = 92, hfas = new Float32Array(hfc);

	var nlc = 48, vfas = [], vfc = 62, fvpos = 0, fvtg = 0, ovxx, ovyy, fvxs = [], fvys = [];


	var showlogo_iv;

	var lga = 0,
			lgss = 0,
			ncka = 0,

			lgfr = 0,
			lgtm = Date.now();

	var pbx = new Float32Array(32767);
	var pby = new Float32Array(32767);
	var pba = new Float32Array(32767);
	var pbu = new Uint8Array(32767);

	var max_skin_cv = 8;
	var b_max_skin_cv = 8;

	var bgx = 0, bgy = 0, bgx2 = 0, bgy2 = 0, fgfr = 0, px, py, lpx, lpy, ax, ay, lax, lay, pax, pay, fx, fy, fs,
			dfa = [];


	var lts = [];
	lts.push({
		pts: [107, 107, 80, 83, 53, 98, 31, 115, 55, 131, 98, 147, 101, 162, 101, 190, 66, 188, 49, 187, 34, 173],
		kc: 22,
		ws: 4,
		wr: .025,
		qm: .025,
		sp: .06,
		sz: 11
	}, {
		pts: [150, 30, 150, 107, 150, 184],
		kc: 66,
		ws: 4,
		wr: .05,
		qm: .025,
		sp: .06,
		sz: 11
	}, {
		pts: [207, 96, 207, 140, 207, 184],
		kc: 46,
		ws: 4,
		wr: .03,
		qm: .035,
		sp: .06,
		sz: 11
	}, {
		pts: [207, 47, 207, 48.5, 207, 50],
		kc: 11,
		ws: 2,
		wr: .06,
		qm: .05,
		sp: .06,
		sz: 15,
		r: .5
	}, {
		pts: [267, 65, 267, 114.5, 267, 164, 267, 194, 297, 186],
		kc: 66,
		ws: 6,
		wr: -.025,
		qm: -.0125,
		sp: .06,
		sz: 11,
		r: 1.5
	}, {
		pts: [243, 94, 268, 94, 293, 94],
		kc: 66,
		ws: 4,
		wr: .015,
		qm: .025,
		sp: .06,
		sz: 9,
		r: 1.2
	}, {
		pts: [338, 30, 338, 68.5, 338, 107, 338, 145.5, 338, 184, 338, 164, 338, 144, 338, 104, 378, 104, 418, 104, 418, 144, 418, 164, 418, 184],
		kc: 46,
		ws: 4,
		wr: .005,
		qm: .02,
		sp: .06,
		sz: 11,
		r: 2.1
	}, {
		pts: [535, 175, 500, 201, 472, 175, 442, 138, 472, 105, 502, 84, 532, 105, 546, 118, 544, 139, 504, 139, 464, 139],
		kc: 35,
		ws: 6,
		wr: -.013,
		qm: -.025,
		sp: .06,
		sz: 11,
		r: 1.3
	}, {
		pts: [591, 96, 591, 140, 591, 184, 591, 155, 591, 126, 613, 82, 652, 109],
		kc: 38,
		ws: 4,
		wr: .01,
		qm: -.035,
		sp: .06,
		sz: 11
	}, {
		pts: [663, 177, 663, 178.5, 663, 180],
		kc: 11,
		ws: 2,
		wr: .06,
		qm: .05,
		sp: .06,
		sz: 15
	}, {
		pts: [717,
			96, 717, 140, 717, 184
		],
		kc: 33,
		ws: 4,
		wr: .06,
		qm: .05,
		sp: .06,
		sz: 11
	}, {
		pts: [717, 47, 717, 48.5, 717, 50],
		kc: 11,
		ws: 2,
		wr: .06,
		qm: .05,
		sp: .06,
		sz: 15
	}, {
		pts: [814, 186, 860, 188, 858, 136, 854, 96, 814, 96, 770, 96, 770, 136, 770, 186, 814, 186],
		kc: 43,
		ws: 4,
		wr: 0,
		qm: .0274,
		sp: .073,
		sz: 11,
		r: 1.5
	});

	for (var i = 0; i < lts.length; i++)
		lts[i].mwig = 5;


	//Use 
	function startAnimation() {
		animating = true;
		if (no_raf) {
			if (is_mobile || is_safari) {
				setInterval("oef()", 33);
			} else {
				setInterval("oef()", 20);
			}
		} else {
			raf(oef);
		}
	};


	function init() {
		initRequestAnimationFrame();
	}


	function initRequestAnimationFrame() {

		//User agent decoding
		lang = navigator.language || navigator.userLanguage;
		lang = lang.substr(0, 2);
		forcing = false;
		user_agent = navigator.userAgent.toLowerCase();

		is_android = 0 <= user_agent.indexOf("android");
		is_amazon = 0 <= user_agent.indexOf("kindle") || 0 <= user_agent.indexOf("silk/");

		uua = navigator.userAgent;
		is_ios = 0 <= uua.indexOf("iPad") || 0 <= uua.indexOf("iPhone") || 0 <= uua.indexOf("iPod");
		is_mobile = 0 <= user_agent.indexOf("mobile");
		is_firefox = -1 < user_agent.indexOf("firefox");
		is_ie8oo = window.attachEvent && !window.addEventListener;
		is_chrome = !1;
		is_safari = !1;

		0 <= user_agent.indexOf("safari") && -1 == user_agent.indexOf("chrome") && (is_safari = !0);
		0 <= user_agent.indexOf("chrome") && (is_safari || is_firefox || (is_chrome = !0));


		//Request Animation Frame
		no_raf = false;
		raf = function (b) {
		};


		//Get request animation frame for each browser
		window.requestAnimationFrame ? raf = window.requestAnimationFrame :
				(window.mozRequestAnimationFrame ? raf = window.mozRequestAnimationFrame :
						(window.webkitRequestAnimationFrame ? raf = window.webkitRequestAnimationFrame : no_raf = true));


		is_mobile || (no_raf = true);
		no_raf = true;


		//Use request animation frame if chrome version greater than 52 or 51.x.2704
		if (is_chrome)
			for (var user_agent_string = user_agent.split(" "), i = user_agent_string.length - 1; i >= 0; i--) {
				var s = user_agent_string[i];
				if (s.indexOf("chrome/") === 0) {
					var version_split = s.split("chrome/")[1];
					version_split = version_split.split(".");
					if (version_split.length >= 3) {
						if (Number(version_split[0]) >= 52) {
							no_raf = false;
						}
						if (Number(version_split[0]) === 51 && Number(version_split[2]) >= 2704) {
							no_raf = false;
						}
					}
					break;
				}
			}
	}

	function transform(object, transformation) {
		object.style.webkitTransform = object.style.OTransform = object.style.msTransform = object.style.MozTransform = object.style.transform = transformation
	}

	function transformOrigin(object, transformation) {
		object.style.webkitTransformOrigin = object.style.OTransformOrigin = object.style.msTransformOrigin = object.style.MozTransformOrigin = object.style.transformOrigin = transformation
	}


	function resetGame() {
		ws && (ws.close(), ws = null);
		snake = null;
		want_close_socket = !1;
		snakes = [];
		foods = [];
		foods_c = 0;
		preys = [];
		sectors = [];
		os = {};
		rank = 0;
		best_rank = 999999999;
		biggest_snake_count = snake_count = 0;
		lagging = wfpr = playing = connected = false;
		for (j = vfc - 1; 0 <= j; j--) {
			fvxs[j] = 0;
			fvys[j] = 0;
		}
		fvy = fvx = fvtg = 0;
		lag_mult = 1;
		current_packet_time = 0;
		current_packet_time = 0;
		gsc = sgsc
	}

	function newDeadpool() {
		return {
			os: [],
			end_pos: 0,
			add: function (b) {
				this.end_pos == this.os.length ? this.os.push(b) : this.os[this.end_pos] = b;
				this.end_pos++
			},
			get: function () {
				if (1 <= this.end_pos) {
					this.end_pos--;
					var b = this.os[this.end_pos];
					this.os[this.end_pos] = null;
					return b
				}
				return null
			}
		}
	}

	function gdnm(b) {
		var f = "",
				c = "",
				h = "",
				u = 0,
				q, e = !1,
				w, C;
		for (w = 0; w < b.length; w++) C = b.charCodeAt(w), 32 == C ? e || (e = !0, f += " ") : (e = !1, f += String.fromCharCode(C));
		e = !1;
		for (w = 0; w < b.length; w++)
			if (C = b.charCodeAt(w), (q = 48 <= C && 57 >= C) || 65 <= C && 90 >= C || 97 <= C && 122 >= C)
				if (c += String.fromCharCode(C), h += String.fromCharCode(C), e = !1, q) {
					if (u++, 7 <= u) return !1
				} else u = 0;
			else e || (e = !0, h += " ");
		b = f.toLowerCase();
		for (w = flt_a.length - 1; 0 <= w; w--)
			if (0 <= b.indexOf(flt_a[w])) return !1;
		c = c.toLowerCase();
		for (w = flt_g.length - 1; 0 <= w; w--)
			if (0 <= c.indexOf(flt_g[w])) return !1;
		h = h.toLowerCase().split(" ");
		for (w = h.length - 1; 0 <= w; w--)
			for (c = flt_w.length - 1; 0 <= c; c--)
				if (h[w] == flt_w[c]) return !1;
		return !0
	}

	function setMscps(_mscps) {
		//Update mscps if not same
		if (mscps === _mscps) {
			return;
		}

		mscps = _mscps;
		fmlts = [];
		fpsls = [];
		for (var curr_mscps = 0; curr_mscps <= mscps; curr_mscps++) {
			if (curr_mscps >= _mscps) {
				//clone values to fill larger array
				fmlts.push(fmlts[curr_mscps - 1])
			} else {
				fmlts.push(Math.pow(1 - curr_mscps / mscps, 2.25));
			}
			if (curr_mscps === 0) {
				fpsls.push(0)
			} else {
				fpsls.push(fpsls[curr_mscps - 1] + 1 / fmlts[curr_mscps - 1]);
			}
		}
		var f = fmlts[fmlts.length - 1];
		var c = fpsls[fpsls.length - 1];
		for (_mscps = 0; 2048 > _mscps; _mscps++) {
			fmlts.push(f);
			fpsls.push(c);
		}

	}

	function startShowGame() {
		llgmtm = Date.now();
		login_iv = setInterval(loginFade, 25);
		UI.beginTitleFadeOut();
		console.log("mc 0");
		mc.style.opacity = 0;
		mc.style.display = "inline";
		lbh.style.opacity = lbs.style.opacity = lbn.style.opacity = lbp.style.opacity = lbf.style.opacity = vcm.style.opacity = 0;
		loch.style.opacity = 0;
		lb_fr = -1
	}

	function setSkin(b, f) {
		b.rcv = f;
		b.er = 6;
		b.pr = 3.5;
		b.pma = 2.3;
		b.ec = "#ffffff";
		b.eca = .75;
		b.ppa = 1;
		b.ppc = "#000000";
		b.antenna = !1;
		b.one_eye = !1;
		b.ed = 6;
		b.esp = 6;
		b.easp = .1;
		b.eac = !1;
		b.jyt = !1;
		b.slg = !1;
		b.eo = 0;
		b.swell = 0;
		if (24 == f) {
			b.antenna = !0;
			b.atba = 0;
			b.atc1 = "#00688c";
			b.atc2 = "#64c8e7";
			b.atwg = !0;
			b.atia = .35;
			b.abrot = !1;
			var c = 8;
			b.atx = new Float32Array(c);
			b.aty = new Float32Array(c);
			b.atvx = new Float32Array(c);
			b.atvy = new Float32Array(c);
			b.atax = new Float32Array(c);
			b.atay = new Float32Array(c);
			for (--c; 0 <= c; c--) b.atx[c] = b.xx, b.aty[c] =
					b.yy;
			b.bulb = acbulb;
			b.blbx = -10;
			b.blby = -10;
			b.blbw = 20;
			b.blbh = 20;
			b.bsc = 1;
			b.blba = .75
		} else if (25 == f) {
			b.ec = "#ff5609";
			b.eca = 1;
			b.antenna = !0;
			b.atba = 0;
			b.atc1 = "#000000";
			b.atc2 = "#5630d7";
			b.atia = 1;
			b.abrot = !0;
			c = 9;
			b.atx = new Float32Array(c);
			b.aty = new Float32Array(c);
			b.atvx = new Float32Array(c);
			b.atvy = new Float32Array(c);
			b.atax = new Float32Array(c);
			b.atay = new Float32Array(c);
			for (--c; 0 <= c; c--) b.atx[c] = b.xx, b.aty[c] = b.yy;
			b.bulb = cdbulb;
			b.blbx = -5;
			b.blby = -10;
			b.blbw = 20;
			b.blbh = 20;
			b.bsc = 1.6;
			b.blba = 1
		} else if (27 == f) b.one_eye = !0, b.ebi = jsebi, b.ebiw = 64, b.ebih = 64, b.ebisz = 29, b.epi = jsepi, b.epiw = 48, b.epih = 48, b.episz = 14, b.pma = 4, b.swell = .06;
		else if (37 == f) {
			b.eca = 1;
			b.antenna = !0;
			b.atba = 0;
			b.atc1 = "#301400";
			b.atc2 = "#ff6813";
			b.atwg = !0;
			b.atia = .5;
			b.abrot = !0;
			c = 9;
			b.atx = new Float32Array(c);
			b.aty = new Float32Array(c);
			b.atvx = new Float32Array(c);
			b.atvy = new Float32Array(c);
			b.atax = new Float32Array(c);
			b.atay = new Float32Array(c);
			for (--c; 0 <= c; c--) b.atx[c] = b.xx, b.aty[c] = b.yy;
			b.bulb = kwkbulb;
			b.blbx = -39;
			b.blby = -63;
			b.blbw = 172;
			b.blbh = 113;
			b.bsc = .42;
			b.blba =
					1
		} else if (39 == f) {
			b.eca = 1;
			b.antenna = !0;
			b.atba = 0;
			b.atc1 = "#1d3245";
			b.atc2 = "#44d4ff";
			b.atwg = !0;
			b.atia = .43;
			b.abrot = !0;
			c = 9;
			b.atx = new Float32Array(c);
			b.aty = new Float32Array(c);
			b.atvx = new Float32Array(c);
			b.atvy = new Float32Array(c);
			b.atax = new Float32Array(c);
			b.atay = new Float32Array(c);
			for (--c; 0 <= c; c--) b.atx[c] = b.xx, b.aty[c] = b.yy;
			b.bulb = pwdbulb;
			b.blbx = -36;
			b.blby = -100;
			b.blbw = 190;
			b.blbh = 188;
			b.bsc = .25;
			b.blba = 1
		} else if (40 == f) b.eac = !0, b.jyt = !0;
		else if (41 == f) b.ed = 34, b.esp = 14, b.eca = 1, b.eo = 3, b.er = 8, b.easp = .038, b.pr =
				4.5, b.pma = 3, b.slg = !0;
		else if (42 == f) {
			b.eca = 1;
			b.antenna = !0;
			b.atba = 0;
			b.atc1 = "#002828";
			b.atc2 = "#80d0d0";
			b.atwg = !0;
			b.atia = .5;
			b.abrot = !0;
			c = 9;
			b.atx = new Float32Array(c);
			b.aty = new Float32Array(c);
			b.atvx = new Float32Array(c);
			b.atvy = new Float32Array(c);
			b.atax = new Float32Array(c);
			b.atay = new Float32Array(c);
			for (--c; 0 <= c; c--) b.atx[c] = b.xx, b.aty[c] = b.yy;
			b.bulb = playbulb;
			b.blbx = -29;
			b.blby = -74;
			b.blbw = 142;
			b.blbh = 149;
			b.bsc = .36;
			b.blba = 1
		}
		c = null;
		9 == f ? c = [7, 9, 7, 9, 7, 9, 7, 9, 7, 9, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10] : 10 == f ? c = [9, 9, 9, 9,
			9, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7
		] : 11 == f ? c = [11, 11, 11, 11, 11, 7, 7, 7, 7, 7, 12, 12, 12, 12, 12] : 12 == f ? c = [7, 7, 7, 7, 7, 9, 9, 9, 9, 9, 13, 13, 13, 13, 13] : 13 == f ? c = [14, 14, 14, 14, 14, 9, 9, 9, 9, 9, 7, 7, 7, 7, 7] : 14 == f ? c = [9, 9, 9, 9, 9, 9, 9, 7, 7, 7, 7, 7, 7, 7] : 15 == f ? c = [0, 1, 2, 3, 4, 5, 6, 7, 8] : 16 == f ? c = [15, 15, 15, 15, 15, 15, 15, 4, 4, 4, 4, 4, 4, 4] : 17 == f ? c = [9, 9, 9, 9, 9, 9, 9, 16, 16, 16, 16, 16, 16, 16] : 18 == f ? c = [7, 7, 7, 7, 7, 7, 7, 9, 9, 9, 9, 9, 9, 9] : 19 == f ? c = [9] : 20 == f ? c = [3, 3, 3, 3, 3, 0, 0, 0, 0, 0] : 21 == f ? c = [3, 3, 3, 3, 3, 3, 3, 18, 18, 18, 18, 18, 18, 20, 19, 20, 19, 20, 19, 20, 18, 18, 18, 18, 18, 18] : 22 == f ? c = [5, 5, 5, 5, 5, 5,
			5, 9, 9, 9, 9, 9, 9, 9, 13, 13, 13, 13, 13, 13, 13
		] : 23 == f ? c = [16, 16, 16, 16, 16, 16, 16, 18, 18, 18, 18, 18, 18, 18, 7, 7, 7, 7, 7, 7, 7] : 24 == f ? c = [23, 23, 23, 23, 23, 23, 23, 23, 23, 18, 18, 18, 18, 18, 18, 18, 18, 18] : 25 == f ? c = [21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22] : 26 == f ? c = [24] : 27 == f ? c = [25] : 28 == f ? c = [18, 18, 18, 18, 18, 18, 18, 25, 25, 25, 25, 25, 25, 25, 7, 7, 7, 7, 7, 7, 7] : 29 == f ? c = [11, 11, 4, 11, 11, 11, 11, 4, 11, 11] : 30 == f ? c = [10, 10, 19, 20, 10, 10, 20, 19] : 31 == f ? c = [10, 10] : 32 == f ? c = [20, 20] : 33 == f ? c = [12, 11, 11] : 34 == f ? c = [7, 7, 9, 13, 13, 9, 16, 16, 9, 12, 12, 9, 7, 7, 9,
			16, 16, 9
		] : 35 == f ? c = [7, 7, 9, 9, 6, 6, 9, 9] : 36 == f ? c = [16, 16, 9, 9, 15, 15, 9, 9] : 37 == f ? c = [22] : 38 == f ? c = [18] : 39 == f ? c = [23] : 40 == f ? c = [26] : 41 == f ? c = [27] : 42 == f ? c = [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7] : 43 == f ? c = [28] : f %= 9;
		c && (f = c[0]);
		b.rbcs = c;
		b.cv = f
	}

	function newSnake(b, f, c, h, u, q) {
		var e = {};
		e.id = b;
		e.xx = f;
		e.yy = c;
		setSkin(e, h);
		h = e.cv;
		e.fnfr = 0;
		e.na = 1;
		e.chl = 0;
		e.tsp = 0;
		e.sfr = 0;
		e.rr = Math.min(255, rrs[h] + Math.floor(20 * Math.random()));
		e.gg = Math.min(255, ggs[h] + Math.floor(20 * Math.random()));
		e.bb = Math.min(255, bbs[h] + Math.floor(20 * Math.random()));
		b = "00" + Math.min(255, Math.max(0, Math.round(e.rr))).toString(16);
		f = "00" + Math.min(255, Math.max(0, Math.round(e.gg))).toString(16);
		c = "00" + Math.min(255, Math.max(0, Math.round(e.bb))).toString(16);
		b = b.substr(b.length - 2);
		f = f.substr(f.length -
				2);
		c = c.substr(c.length - 2);
		e.cs = "#" + b + f + c;
		b = "00" + Math.min(255, Math.max(0, Math.round(.4 * e.rr))).toString(16);
		f = "00" + Math.min(255, Math.max(0, Math.round(.4 * e.gg))).toString(16);
		c = "00" + Math.min(255, Math.max(0, Math.round(.4 * e.bb))).toString(16);
		b = b.substr(b.length - 2);
		f = f.substr(f.length - 2);
		c = c.substr(c.length - 2);
		e.cs04 = "#" + b + f + c;
		b = "00" + Math.min(255, Math.max(0, Math.round(.5 * (255 + e.rr)))).toString(16);
		f = "00" + Math.min(255, Math.max(0, Math.round(.5 * (255 + e.gg)))).toString(16);
		c = "00" + Math.min(255, Math.max(0, Math.round(.5 *
				(255 + e.bb)))).toString(16);
		b = b.substr(b.length - 2);
		f = f.substr(f.length - 2);
		c = c.substr(c.length - 2);
		e.csw = "#" + b + f + c;
		e.sc = 1;
		e.ssp = nsp1 + nsp2 * e.sc;
		e.fsp = e.ssp + .1;
		e.msp = nsp3;
		e.fxs = new Float32Array(rfc);
		e.fys = new Float32Array(rfc);
		e.fchls = new Float32Array(rfc);
		e.fpos = 0;
		e.ftg = 0;
		e.fx = 0;
		e.fy = 0;
		e.fchl = 0;
		e.fas = new Float32Array(afc);
		e.fapos = 0;
		e.fatg = 0;
		e.fa = 0;
		e.ehang = u;
		e.wehang = u;
		e.ehl = 1;
		e.msl = 42;
		e.fam = 0;
		e.ang = u;
		e.eang = u;
		e.wang = u;
		e.rex = 0;
		e.rey = 0;
		e.sp = 2;
		q ? (e.lnp = q[q.length - 1], e.pts = q, e.sct = q.length, q[0].dying && e.sct--) :
				(e.pts = [], e.sct = 0);
		e.flpos = 0;
		e.fls = new Float32Array(lfc);
		e.fl = 0;
		e.fltg = 0;
		e.tl = e.sct + e.fam;
		e.cfl = e.tl;
		e.scang = 1;
		e.dead_amt = 0;
		e.alive_amt = 0;
		snakes.splice(0, 0, e);
		return os["s" + e.id] = e
	}

	//This makes the snake look long
	function snl(b) {
		var f = b.tl;
		b.tl = b.sct + b.fam;
		for (var f = b.tl - f, c = b.flpos, h = 0; h < lfc; h++) b.fls[c] -= f * lfas[h], c++, c >= lfc && (c = 0);
		b.fl = b.fls[b.flpos];
		b.fltg = lfc;
		if (b == snake) {
			wumsts = true;
		}
	}

	function newFood(b, f, c, h, u, q) {
		var e = {};
		e.id = b;
		e.xx = f;
		e.yy = c;
		e.rx = f;
		e.ry = c;
		e.rsp = u ? 2 : 1;
		e.cv = q;
		e.rad = 1E-5;
		e.sz = h;
		e.lrrad = e.rad;
		b = per_color_imgs[e.cv];
		e.cv2 = Math.floor(b.ic * gsc * e.sz / 16.5);
		0 > e.cv2 && (e.cv2 = 0);
		e.cv2 >= b.ic && (e.cv2 = b.ic - 1);
		testing && (window.biggestcv2 || (window.biggestcv2 = e.cv2), e.cv2 > window.biggestcv2 && (window.biggestcv2 = e.cv2, console.log("biggest cv2 seen: " + e.cv2 + " out of " + (b.ic - 1) + " (fo.sz = " + e.sz + " which means its server-side rad is " + 5 * e.sz + ")")));
		e.fi = b.imgs[e.cv2];
		e.fw = b.fws[e.cv2];
		e.fh = b.fhs[e.cv2];
		e.fw2 = b.fw2s[e.cv2];
		e.fh2 = b.fh2s[e.cv2];
		e.ofi = b.oimgs[e.cv2];
		e.ofw = b.ofws[e.cv2];
		e.ofh = b.ofhs[e.cv2];
		e.ofw2 = b.ofw2s[e.cv2];
		e.ofh2 = b.ofh2s[e.cv2];
		e.gcv = Math.floor(b.ic * gsc * (.25 + .75 * e.sz / 16.5));
		0 > e.gcv && (e.gcv = 0);
		e.gcv >= b.ic && (e.gcv = b.ic - 1);
		e.gfi = b.gimgs[e.gcv];
		e.gfw = b.gfws[e.gcv];
		e.gfh = b.gfhs[e.gcv];
		e.gfw2 = b.gfw2s[e.gcv];
		e.gfh2 = b.gfh2s[e.gcv];
		e.g2cv = Math.floor(b.ic * gsc * 2 * (.25 + .75 * e.sz / 16.5));
		0 > e.g2cv && (e.g2cv = 0);
		e.g2cv >= b.ic && (e.g2cv = b.ic - 1);
		e.g2fi = b.gimgs[e.g2cv];
		e.g2fw = b.gfws[e.g2cv];
		e.g2fh = b.gfhs[e.g2cv];
		e.g2fw2 = b.gfw2s[e.g2cv];
		e.g2fh2 = b.gfh2s[e.g2cv];
		e.fr = 0;
		e.gfr = 64 * Math.random();
		e.gr = .65 + .1 * e.sz;
		e.wsp = .0225 * (2 * Math.random() - 1);
		e.eaten_fr = 0;
		return foods[foods_c++] = e
	}

	function newPrey(b, f, c, h, u, q, e, w, C) {
		var x = {};
		x.id = b;
		x.xx = f;
		x.yy = c;
		x.rad = 1E-5;
		x.sz = h;
		x.cv = u;
		x.dir = q;
		x.wang = e;
		x.ang = w;
		x.sp = C;
		x.fr = 0;
		x.gfr = 64 * Math.random();
		x.gr = .5 + .15 * Math.random() + .1 * x.sz;
		x.rr = Math.min(255, rrs[u]);
		x.gg = Math.min(255, ggs[u]);
		x.bb = Math.min(255, bbs[u]);
		b = "00" + Math.min(255, Math.max(0, Math.round(x.rr))).toString(16);
		f = "00" + Math.min(255, Math.max(0, Math.round(x.gg))).toString(16);
		c = "00" + Math.min(255, Math.max(0, Math.round(x.bb))).toString(16);
		b = b.substr(b.length - 2);
		f = f.substr(f.length - 2);
		c =
				c.substr(c.length - 2);
		x.cs = "#" + b + f + c;
		x.cv2 = Math.floor(per_color_imgs[x.cv].pr_imgs.length * gsc * x.sz / 9);
		0 > x.cv2 && (x.cv2 = 0);
		x.cv2 >= per_color_imgs[x.cv].pr_imgs.length && (x.cv2 = per_color_imgs[x.cv].pr_imgs.length - 1);
		x.fi = per_color_imgs[x.cv].pr_imgs[x.cv2];
		x.fw = per_color_imgs[x.cv].pr_fws[x.cv2];
		x.fh = per_color_imgs[x.cv].pr_fhs[x.cv2];
		x.fw2 = per_color_imgs[x.cv].pr_fw2s[x.cv2];
		x.fh2 = per_color_imgs[x.cv].pr_fh2s[x.cv2];
		x.gcv = per_color_imgs[x.cv].gimgs.length - 1;
		x.gfi = per_color_imgs[x.cv].gimgs[x.gcv];
		x.gfw =
				per_color_imgs[x.cv].gfws[x.gcv];
		x.gfh = per_color_imgs[x.cv].gfhs[x.gcv];
		x.gfw2 = per_color_imgs[x.cv].gfw2s[x.gcv];
		x.gfh2 = per_color_imgs[x.cv].gfh2s[x.gcv];
		x.fxs = new Float32Array(rfc);
		x.fys = new Float32Array(rfc);
		x.fpos = 0;
		x.ftg = 0;
		x.fx = 0;
		x.fy = 0;
		x.eaten = !1;
		x.eaten_fr = 0;
		preys.push(x);
		return x
	}

	//Login fading animation

	function loginFade() {
		var b = Date.now(),
				f = (b - llgmtm) / 25;
		llgmtm = b;
		login_fade_rate += .05 * f;
		choosing_skin && (login_fade_rate += .06 * f);


		if (1 <= login_fade_rate) {
			login_fade_rate = 1;
			login.style.display = "none";
			cskh.style.display = "none";
			grqh.style.display = "none";
			plq.style.display = "none";
			clq.style.display = "none";
			social.style.display = "none";
			login.style.opacity = 1;
			cskh.style.opacity = 1;
			grqh.style.opacity = 1;
			plq.style.opacity = 1;
			clq.style.opacity = 1;
			social.style.opacity = 1;
			pskh.style.opacity = 1;
			nskh.style.opacity = 1;
			//	save_skin.style.opacity = 1;


			tip_fr = -1;
			tips.style.display = "none";
			mc.style.opacity = 1;
			loch.style.opacity = 1;
			clearInterval(login_iv);
			login_iv = -1;
			if (-1 != showlogo_iv) {
				ncka = lgss = lga = 1;
				showLogo(!0)
				clearInterval(showlogo_iv);
				showlogo_iv = -1
			}

		} else {
			lgcsc = 1 + .1 * Math.pow(login_fade_rate, 2);
			b = Math.round(lgbsc * lgcsc * 1E5) / 1E5;
			transform(login, "scale(" + b + "," + b + ")");
			login.style.opacity = 1 - login_fade_rate;

			cskh.style.opacity = 1 - login_fade_rate;
			grqh.style.opacity = 1 - login_fade_rate;
			plq.style.opacity = 1 - login_fade_rate;
			clq.style.opacity = 1 - login_fade_rate;
			social.style.opacity = 1 - login_fade_rate;
			pskh.style.opacity = login_fade_rate;
			nskh.style.opacity = login_fade_rate;
			save_skin.style.opacity = login_fade_rate;
			mc.style.opacity = login_fade_rate;
			loch.style.opacity = login_fade_rate;
		}
	}

	function asciize(b) {
		var f, c, h;
		c = b.length;
		var u = !1;
		for (f = 0; f < c; f++)
			if (h = b.charCodeAt(f), 32 > h || 127 < h) {
				u = !0;
				break
			}
		if (u) {
			u = "";
			for (f = 0; f < c; f++) h = b.charCodeAt(f), u = 32 > h || 127 < h ? u + " " : u + String.fromCharCode(h);
			return u
		}
		return b
	}

	function redraw() {

		fps++;
		omfps++;
		var b = mc.getContext("2d");
		if (animating) {
			if (snake) {
				var f = .5 + .4 / Math.max(1, (snake.sct + 16) / 36);
				gsc != f && (gsc < f ? (gsc += 2E-4, gsc >= f && (gsc = f)) : (gsc -= 2E-4, gsc <= f && (gsc = f)))
			}
			var f = view_xx,
					c = view_yy;
			null != snake && (0 < fvtg && (fvtg--, fvx = fvxs[fvpos], fvy = fvys[fvpos], fvxs[fvpos] = 0, fvys[fvpos] = 0, fvpos++, fvpos >= vfc && (fvpos = 0)), view_xx = snake.xx + snake.fx + fvx, view_yy = snake.yy + snake.fy + fvy, choosing_skin && (view_xx -= 104, gsc = 1), view_ang = Math.atan2(view_yy - game_radius, view_xx - game_radius),
					view_dist = Math.sqrt((view_xx - game_radius) * (view_xx - game_radius) + (view_yy - game_radius) * (view_yy - game_radius)), bpx1 = view_xx - (mww2 / gsc + 84), bpy1 = view_yy - (mhh2 / gsc + 84), bpx2 = view_xx + (mww2 / gsc + 84), bpy2 = view_yy + (mhh2 / gsc + 84), fpx1 = view_xx - (mww2 / gsc + 24), fpy1 = view_yy - (mhh2 / gsc + 24), fpx2 = view_xx + (mww2 / gsc + 24), fpy2 = view_yy + (mhh2 / gsc + 24), apx1 = view_xx - (mww2 / gsc + 210), apy1 = view_yy - (mhh2 / gsc + 210), apx2 = view_xx + (mww2 / gsc + 210), apy2 = view_yy + (mhh2 / gsc + 210));
			bgx2 -= 1 * (view_xx - f) / bgw2;
			bgy2 -= 1 * (view_yy - c) / bgh2;
			bgx2 %= 1;
			0 > bgx2 && (bgx2 += 1);
			bgy2 %= 1;
			0 > bgy2 && (bgy2 += 1);
			ggbg && (high_quality || 0 < gla) ? (b.save(), b.fillStyle = "#000000", b.fillRect(0, 0, mww, mhh), b.globalAlpha = .3 * gla, b.drawImage(gbgmc, 0, 0), b.restore()) : (b.fillStyle = "#000000", b.fillRect(0, 0, mww, mhh));
			if (bgp2) {
				b.save();
				b.fillStyle = bgp2;
				b.translate(mww2, mhh2);
				b.scale(gsc, gsc);
				b.translate(bgx2 * bgw2, bgy2 * bgh2);
				b.globalAlpha = .4 + .6 * (1 - gla);
				b.fillRect(3 * -mww / gsc, 3 * -mhh / gsc, 5 * mww / gsc, 5 * mhh / gsc);
				if (high_quality || 0 < gla) b.globalCompositeOperation = "lighter", b.globalAlpha = .4 * gla, b.fillRect(3 * -mww / gsc, 3 * -mhh / gsc, 5 * mww /
						gsc, 5 * mhh / gsc);
				b.restore()
			}
			if (testing) {
				for (f = sectors.length - 1; 0 <= f; f--) {
					c = sectors[f];
					b.fillStyle = "rgba(0, 255, 0, .1)";
					b.fillRect(mww2 + (c.xx * sector_size - view_xx) * gsc, mhh2 + (c.yy * sector_size - view_yy) * gsc, sector_size * gsc - 4, sector_size * gsc - 4);
				}
			}

			//-------
			//Draw Foods 
			if (high_quality || 0 < gla) {
				var h = 1.75;
				1 != gla && (h = 1.75 * gla);
				b.save();
				for (f = foods_c - 1; 0 <= f; f--) {
					var food = foods[f];

					if (food.rx >= fpx1 && food.ry >= fpy1 && food.rx <= fpx2 && food.ry <= fpy2) {
						if (food.rad == 1) {
							B = mww2 + gsc * (food.rx - view_xx) - food.ofw2;
							z = mhh2 + gsc * (food.ry - view_yy) - food.ofh2;
							b.globalAlpha = h * food.fr;
							b.drawImage(food.ofi, B, z)
						} else {
							B = mww2 + gsc * (food.rx - view_xx) - food.ofw2 * food.rad;
							z = mhh2 + gsc * (food.ry - view_yy) - food.ofh2 * food.rad;
							b.globalAlpha = h * food.fr;
							b.drawImage(food.ofi, 0, 0, food.ofw, food.ofh, B, z, food.ofw * food.rad, food.ofh * food.rad);
						}
					}
				}
				b.restore()
			}
			b.save();
			//Draw Foods Glow?
			b.globalCompositeOperation = "lighter";
			if (high_quality || 0 < gla) {
				h = .75;
				1 != gla && (h = .75 * gla);
				var u = .75;
				1 != gla && (u = 1 - .25 * gla);
				for (f = foods_c - 1; 0 <= f; f--) {
					var food = foods[f];
					if (food.rx >= fpx1 && food.ry >= fpy1 && food.rx <= fpx2 && food.ry <= fpy2) {
						if (1 == food.rad) {
							B = mww2 + gsc * (food.rx - view_xx) - food.fw2;
							z = mhh2 + gsc * (food.ry - view_yy) - food.fh2;
							b.globalAlpha = u * food.fr;
							b.drawImage(food.fi, B, z);
							b.globalAlpha = h * (.5 + .5 * Math.cos(food.gfr / 13)) * food.fr;
							b.drawImage(food.fi, B, z)
						} else {
							B = mww2 + gsc * (food.rx - view_xx) - food.fw2 * food.rad;
							z = mhh2 + gsc * (food.ry - view_yy) - food.fh2 * food.rad;
							b.globalAlpha = u * food.fr;
							b.drawImage(food.fi, 0, 0, food.fw, food.fh, B, z, food.fw * food.rad, food.fh * food.rad);
							b.globalAlpha = h * (.5 + .5 * Math.cos(food.gfr / 13)) * food.fr;
							b.drawImage(food.fi, 0, 0, food.fw, food.fh, B, z, food.fw * food.rad, food.fh * food.rad);

						}

					}
				}
				//Draw low quality food
			} else {
				for (f = foods_c - 1; 0 <= f; f--) {
					var food = foods[f];
					if (food.rx >= fpx1 && food.ry >= fpy1 && food.rx <= fpx2 && food.ry <= fpy2) {
						if (1 == food.rad) {
							B = mww2 + gsc * (food.rx - view_xx) - food.fw2;
							z = mhh2 + gsc * (food.ry - view_yy) - food.fh2;

							b.globalAlpha = food.fr;
							b.drawImage(food.fi, B, z)
						} else {
							B = mww2 + gsc * (food.rx - view_xx) - food.fw2 * food.rad;
							z = mhh2 + gsc * (food.ry - view_yy) - food.fh2 * food.rad;
							b.globalAlpha = food.fr;
							b.drawImage(food.fi, 0, 0, food.fw, food.fh, B, z, food.fw * food.rad, food.fh * food.rad);

						}
					}
				}
			}

			//--------

			b.restore();
			b.save();
			b.globalCompositeOperation = "lighter";
			for (f = preys.length - 1; 0 <= f; f--)
				if (h = preys[f], e = h.xx + h.fx, w = h.yy + h.fy, px = mww2 + gsc * (e - view_xx), py = mhh2 + gsc * (w - view_yy), -50 <= px && -50 <= py && px <= mwwp50 && py <= mhhp50) {
					if (h.eaten) {
						var c = h.eaten_by,
								q = Math.pow(h.eaten_fr, 2),
								e = e + (c.xx + c.fx + Math.cos(c.ang + c.fa) *
										(43 - 24 * q) * (1 - q) - e) * q,
								w = w + (c.yy + c.fy + Math.sin(c.ang + c.fa) * (43 - 24 * q) * (1 - q) - w) * q;
						px = mww2 + gsc * (e - view_xx);
						py = mhh2 + gsc * (w - view_yy)
					}
					1 == h.rad ? (B = px - h.fw2, z = py - h.fh2, b.globalAlpha = .75 * h.fr, b.drawImage(h.fi, B, z), b.globalAlpha = .75 * (.5 + .5 * Math.cos(h.gfr / 13)) * h.fr, b.drawImage(h.fi, B, z)) : (B = px - h.fw2 * h.rad, z = py - h.fh2 * h.rad, b.globalAlpha = .75 * h.fr, b.drawImage(h.fi, 0, 0, h.fw, h.fh, B, z, h.fw * h.rad, h.fh * h.rad), b.globalAlpha = .75 * (.5 + .5 * Math.cos(h.gfr / 13)) * h.fr, b.drawImage(h.fi, 0, 0, h.fw, h.fh, B, z, h.fw * h.rad, h.fh * h.rad))
				}
			b.restore();
			b.save();

			b.strokeStyle = "#90C098";
			for (var e, w, C, f = snakes.length - 1; 0 <= f; f--) c = snakes[f], e = c.xx + c.fx, w = c.yy + c.fy + 40, 0 < c.na && e >= bpx1 - 100 && w >= bpy1 && e <= bpx2 + 100 && w <= bpy2 && (c == snake && (c.fnfr++, 200 < c.fnfr && (c.na -= .004, 0 > c.na && (c.na = 0))), b.save(), b.globalAlpha = .5 * c.na * c.alive_amt * (1 - c.dead_amt), b.font = "12px Arial, Helvetica Neue, Helvetica, sans-serif", b.fillStyle = c.csw, b.textBaseline = "middle", b.textAlign = "center", h = c.xx + c.fx, u = c.yy + c.fy, h = mww2 + (h - view_xx) * gsc, u = mhh2 + (u - view_yy) * gsc, b.fillText(c.nk, h, u + 32 +
					11 * c.sc * gsc), b.restore());

			//Checks if a snake should be drawn
			for (f = snakes.length - 1; 0 <= f; f--)
				for (c = snakes[f], c.iiv = !1, t = c.pts.length - 1; 0 <= t; t--)
					if (A = c.pts[t], px = A.xx + A.fx, py = A.yy + A.fy, px >= bpx1 && py >= bpy1 && px <= bpx2 && py <= bpy2) {
						c.iiv = !0;
						break
					}
			for (f = snakes.length - 1; 0 <= f; f--)
				if (c = snakes[f], c.iiv) {
					h = c.xx + c.fx;
					u = c.yy + c.fy;
					px = h;
					py = u;
					C = c.ehang;
					var x = c.sc,
							D = 29 * x,
							G = c.cfl,
							A = c.pts[c.pts.length - 1];

					//Mobile renderer
					if (1 == render_mode) {
						b.save();
						b.beginPath();
						b.moveTo(mww2 + (px - view_xx) * gsc, mhh2 + (py - view_yy) * gsc);
						e = !1;
						for (var t = c.pts.length - 1; 0 <= t; t--) {
							A = c.pts[t];
							lpx = px;
							lpy = py;
							px = A.xx;
							py = A.yy;
							var B = A.fx,
									z = A.fy;
							0 < G && (px += B, py += z, lax = ax, lay = ay, ax = (px + lpx) / 2, ay = (py + lpy) / 2, e || (lax = ax, lay = ay), 1 > G && (q = 1 - G, lpx += (lax - lpx) * q, lpy += (lay - lpy) * q, ax += (lax - ax) * q, ay += (lay - ay) * q), e ? G-- : G -= c.chl + c.fchl, e ? b.quadraticCurveTo(mww2 + (lpx - view_xx) * gsc, mhh2 + (lpy - view_yy) * gsc, mww2 + (ax - view_xx) * gsc, mhh2 + (ay - view_yy) * gsc) : (b.lineTo(mww2 + (ax - view_xx) * gsc, mhh2 + (ay - view_yy) * gsc), e = !0))
						}
						b.save();
						b.lineJoin = "round";
						b.lineCap = "round";
						doiosh ?
								(c.sp > c.fsp && (t = c.alive_amt * (1 - c.dead_amt) * Math.max(0,
										Math.min(1, (c.sp - c.ssp) / (c.msp - c.ssp))), b.save(), b.strokeStyle = c.cs, b.globalAlpha = .3 * t, b.lineWidth = (D + 6) * gsc, b.stroke(), b.lineWidth = (D + 9) * gsc, b.stroke(), b.lineWidth = (D + 12) * gsc, b.stroke(), b.restore()), b.globalAlpha = 1 * c.alive_amt * (1 - c.dead_amt), b.strokeStyle = "#000000", b.lineWidth = (D + 5) * gsc)
								: (c.sp > c.fsp && (t = c.alive_amt * (1 - c.dead_amt) * Math.max(0, Math.min(1, (c.sp - c.ssp) / (c.msp - c.ssp))), b.save(), b.lineWidth = (D - 2) * gsc, b.shadowBlur = 30 * gsc, b.shadowColor = "rgba(" + c.rr + "," + c.gg + "," + c.bb + ", " + Math.round(1E4 * t) /
								1E4 + ")", b.stroke(), b.stroke(), b.restore()), b.globalAlpha = .4 * c.alive_amt * (1 - c.dead_amt), b.strokeStyle = "#000000", b.lineWidth = (D + 5) * gsc, b.stroke(), b.strokeStyle = c.cs, b.lineWidth = D * gsc, b.strokeStyle = "#000000", b.globalAlpha = 1 * c.alive_amt * (1 - c.dead_amt));
						b.stroke();
						b.strokeStyle = c.cs;
						b.globalAlpha = .8 * c.alive_amt * (1 - c.dead_amt);
						b.lineWidth = D * gsc;
						b.stroke();
						b.restore();
						b.strokeStyle = c.cs;
						c.dead && (z = (.5 + .5 * Math.abs(Math.sin(5 * Math.PI * c.dead_amt))) * Math.sin(Math.PI * c.dead_amt), b.save(), b.lineJoin = "round", b.lineCap =
								"round", b.globalCompositeOperation = "lighter", b.lineWidth = (D - 3) * gsc, b.globalAlpha = z, b.strokeStyle = "#FFCC99", b.stroke(), b.restore());
						b.restore()
					}
					//Pc renderer
					if (2 == render_mode) {
						var D = .5 * D,
								I, M, y, E, H, K, N, F;
						px = h;
						py = u;
						H = px;
						K = py;
						H >= bpx1 && K >= bpy1 && H <= bpx2 && K <= bpy2 ? (pbx[0] = H, pby[0] = K, pba[0] = Math.atan2(u - (A.yy + A.fy), h - (A.xx + A.fx)) + Math.PI, pbu[0] = 1) : pbu[0] = 0;
						B = 1;
						n = (c.chl + c.fchl) % .25;
						0 > n && (n += .25);
						n = .25 - n;
						G += 1 - .25 * Math.ceil((c.chl + c.fchl) / .25);

						//Positions of pts updated here?
						ax = px;
						ay = py;
						c.sep != c.wsep && (c.sep < c.wsep ? (c.sep += .01, c.sep >= c.wsep && (c.sep = c.wsep)) :
								c.sep > c.wsep && (c.sep -= .01, c.sep <= c.wsep && (c.sep = c.wsep)));
						for (var O = c.sep * qsm, L = 0, z = per_color_imgs[c.cv].kmcs, J, t = c.pts.length - 1; 0 <= t; t--)
							if (A = c.pts[t], lpx = px, lpy = py, px = A.xx + A.fx, py = A.yy + A.fy, -.25 < G) {
								y = H;
								E = K;
								H = (px + lpx) / 2;
								K = (py + lpy) / 2;
								N = lpx;
								F = lpy;
								for (q = 0; 1 > q; q += .25) {
									A = n + q;
									e = y + (N - y) * A;
									w = E + (F - E) * A;
									I = N + (H - N) * A;
									M = F + (K - F) * A;
									lax = ax;
									lay = ay;
									ax = e + (I - e) * A;
									ay = w + (M - w) * A;
									0 > G && (ax += -(lax - ax) * G / .25, ay += -(lay - ay) * G / .25);
									I = Math.sqrt(Math.pow(ax - lax, 2) + Math.pow(ay - lay, 2));
									if (L + I < O) L += I;
									else {
										L = -L;
										for (A = (I - L) / O; 1 <= A; A--) L +=
												O, pax = lax + (ax - lax) * L / I, pay = lay + (ay - lay) * L / I, pax >= bpx1 && pay >= bpy1 && pax <= bpx2 && pay <= bpy2 ? (pbx[B] = pax, pby[B] = pay, pbu[B] = 1, e = ax - lax, w = ay - lay, pba[B] = -15 <= e && -15 <= w && 15 > e && 15 > w ? at2lt[8 * w + 128 << 8 | 8 * e + 128] : -127 <= e && -127 <= w && 127 > e && 127 > w ? at2lt[w + 128 << 8 | e + 128] : Math.atan2(w, e)) : pbu[B] = 0, B++;
										L = I - L
									}
									if (1 > G && (G -= .25, -.25 >= G)) break
								}
								1 <= G && G--
							}
						ax >= bpx1 && ay >= bpy1 && ax <= bpx2 && ay <= bpy2 ? (pbu[B] = 1, pbx[B] = ax, pby[B] = ay, pba[B] = Math.atan2(ay - lay, ax - lax)) : pbu[B] = 0;
						B++;
						b.save();
						b.translate(mww2, mhh2);
						q = gsc * D * 52 / 32;
						H = gsc * D * 62 / 32;
						G = c.alive_amt * (1 - c.dead_amt);
						G *= G;
						A = 1;
						if (c.tsp > c.fsp) {
							A = c.alive_amt * (1 - c.dead_amt) * Math.max(0, Math.min(1, (c.tsp - c.ssp) / (c.msp - c.ssp)));
							J = .37 * A;
							L = Math.pow(A, .5);
							y = gsc * D * (1 + .9375 * L);

							w = per_color_imgs[c.cv].kfmc;
							b.save();
							b.globalCompositeOperation = "lighter";
							if (c.rbcs) {
								for (K = c.rbcs, O = K.length, t = B - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], w = per_color_imgs[K[t % O]], w = w.kfmc, b.save(), b.globalAlpha = G * L * .38 * (.6 + .4 * Math.cos(t / 4 - 1.15 * c.sfr)), b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), 4 > t ? (e = y * (1 + (4 - t) * c.swell),
										b.drawImage(w, -e, -e, 2 * e, 2 * e)) : b.drawImage(w, -y, -y, 2 * y, 2 * y), b.restore());
							}
							else {
								//Glow
								for (t = B - 1; 0 <= t; t--) {
									if (1 == pbu[t]) {
										px = pbx[t];
										py = pby[t];
										b.save();
										b.globalAlpha = G * L * .38 * (.6 + .4 * Math.cos(t / 4 - 1.15 * c.sfr));
										b.translate((px - view_xx) * gsc, (py - view_yy) * gsc);
										if (4 > t) {
											e = y * (1 + (4 - t) * c.swell);
											b.drawImage(w, -e, -e, 2 * e, 2 * e)
										} else {
											b.drawImage(w, -y, -y, 2 * y, 2 * y)
										}
										b.restore();
									}
								}
							}
							b.restore();
							A = 1 - A
						}
						A *= G;
						if (high_quality || 0 < gla)
							for (w = A, 1 != gla && (w = A * gla), b.globalAlpha = w, t = B - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], b.save(), b.translate((px - view_xx) *
									gsc, (py - view_yy) * gsc), b.drawImage(komc, -q, -q, 2 * q, 2 * q), 9 > t && (b.globalAlpha = w * (1 - t / 9), 4 > t ? (e = H * (1 + (4 - t) * c.swell), b.drawImage(ksmc, -e, -e, 2 * e, 2 * e)) : b.drawImage(ksmc, -H, -H, 2 * H, 2 * H), b.globalAlpha = w), b.restore());
						b.globalAlpha = A;
						if (c.rbcs) {
							K = c.rbcs;
							O = K.length;
							for (t = B - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], 2 <= t && (q = t - 2, 1 == pbu[q] && (e = pbx[q], w = pby[q], b.save(), b.translate((e - view_xx) * gsc, (w - view_yy) * gsc), 9 > q ? (b.globalAlpha = q / 9 * A, 4 > q ? (e = H * (1 + (4 - q) * c.swell), b.drawImage(ksmc, -e, -e, 2 * e, 2 * e)) : b.drawImage(ksmc, -H, -H, 2 * H, 2 * H)) : (b.globalAlpha = A, b.drawImage(ksmc, -H, -H, 2 * H, 2 * H)), b.restore())), b.save(), b.globalAlpha = G, b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), b.rotate(pba[t]), q = t % (2 * z.length), q >= z.length && (q = 2 * z.length - (q + 1)), w = per_color_imgs[K[t % O]], 4 > t ? (e = D * (1 + (4 - t) * c.swell), b.drawImage(w.kmcs[q], -gsc * e, -gsc * e, 2 * gsc * e, 2 * gsc * e)) : b.drawImage(w.kmcs[q], -gsc * D, -gsc * D, 2 * gsc * D, 2 * gsc * D), b.restore());
							if (c.tsp > c.fsp && (high_quality || 0 < gla)) {
								b.save();
								b.globalCompositeOperation = "lighter";
								for (t = B - 1; 0 <= t; t--) 1 == pbu[t] &&
								(px = pbx[t], py = pby[t], b.save(), b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), b.rotate(pba[t]), b.globalAlpha = G * J * gla * (.5 + .5 * Math.cos(t / 4 - c.sfr)), q = t % (2 * z.length), q >= z.length && (q = 2 * z.length - (q + 1)), 4 > t ? (e = D * (1 + (4 - t) * c.swell), b.drawImage(per_color_imgs[K[t % O]].kmcs[q], -gsc * e, -gsc * e, 2 * gsc * e, 2 * gsc * e)) : b.drawImage(per_color_imgs[K[t % O]].kmcs[q], -gsc * D, -gsc * D, 2 * gsc * D, 2 * gsc * D), b.restore());
								b.restore()
							}
						} else {
							for (t = B - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], 2 <= t && (q = t - 2, 1 == pbu[q] && (e = pbx[q], w = pby[q], b.save(),
									b.translate((e - view_xx) * gsc, (w - view_yy) * gsc), 9 > q ? (b.globalAlpha = q / 9 * A, 4 > q ? (e = H * (1 + (4 - q) * c.swell), b.drawImage(ksmc, -e, -e, 2 * e, 2 * e)) : b.drawImage(ksmc, -H, -H, 2 * H, 2 * H)) : (b.globalAlpha = A, b.drawImage(ksmc, -H, -H, 2 * H, 2 * H)), b.restore())), b.save(), b.globalAlpha = G, b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), b.rotate(pba[t]), q = t % (2 * z.length), q >= z.length && (q = 2 * z.length - (q + 1)), 4 > t ? (e = D * (1 + (4 - t) * c.swell), b.drawImage(z[q], -gsc * e, -gsc * e, 2 * gsc * e, 2 * gsc * e)) : b.drawImage(z[q], -gsc * D, -gsc * D, 2 * gsc * D, 2 * gsc * D), b.restore());
							if (c.tsp > c.fsp && (high_quality || 0 < gla)) {
								b.save();
								b.globalCompositeOperation = "lighter";
								for (t = B - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], q = t % (2 * z.length), q >= z.length && (q = 2 * z.length - (q + 1)), b.save(), b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), b.rotate(pba[t]), b.globalAlpha = G * J * gla * (.5 + .5 * Math.cos(t / 4 - c.sfr)), 4 > t ? (e = D * (1 + (4 - t) * c.swell), b.drawImage(z[q], -gsc * e, -gsc * e, 2 * gsc * e, 2 * gsc * e)) : b.drawImage(z[q], -gsc * D, -gsc * D, 2 * gsc * D, 2 * gsc * D), b.restore());
								b.restore()
							}
						}
						if (c.antenna)
							if (e = Math.cos(c.ang), w = Math.sin(c.ang),
											ax = h - 8 * e * c.sc, ay = u - 8 * w * c.sc, 2 <= B && ax >= apx1 && ay >= apy1 && ax <= apx2 && ay <= apy2) {
								c.atx[0] = ax;
								c.aty[0] = ay;
								A = c.sc * gsc;
								fj = c.atx.length - 1;
								if (choosing_skin)
									for (t = 1; t <= fj; t++) c.atvx[t] -= .3, c.atvy[t] += .14 * Math.cos(fr / 23 - 7 * t / fj);
								else if (!c.antenna_shown)
									for (c.antenna_shown = !0, t = 1; t <= fj; t++) c.atx[t] = ax - e * t * 4 * c.sc, c.aty[t] = ay - w * t * 4 * c.sc;
								for (t = 1; t <= fj; t++) xx = c.atx[t - 1], yy = c.aty[t - 1], xx += 2 * Math.random() - 1, yy += 2 * Math.random() - 1, e = c.atx[t] - xx, w = c.aty[t] - yy, angle = -4 <= e && -4 <= w && 4 > e && 4 > w ? at2lt[32 * w + 128 << 8 | 32 * e + 128] : -8 <= e &&
								-8 <= w && 8 > e && 8 > w ? at2lt[16 * w + 128 << 8 | 16 * e + 128] : -16 <= e && -16 <= w && 16 > e && 16 > w ? at2lt[8 * w + 128 << 8 | 8 * e + 128] : -127 <= e && -127 <= w && 127 > e && 127 > w ? at2lt[w + 128 << 8 | e + 128] : Math.atan2(w, e), xx += 4 * Math.cos(angle) * c.sc, yy += 4 * Math.sin(angle) * c.sc, c.atvx[t] += .1 * (xx - c.atx[t]), c.atvy[t] += .1 * (yy - c.aty[t]), c.atx[t] += c.atvx[t], c.aty[t] += c.atvy[t], c.atvx[t] *= .88, c.atvy[t] *= .88, e = c.atx[t] - c.atx[t - 1], w = c.aty[t] - c.aty[t - 1], I = Math.sqrt(e * e + w * w), I > 4 * c.sc && (angle = -4 <= e && -4 <= w && 4 > e && 4 > w ? at2lt[32 * w + 128 << 8 | 32 * e + 128] : -8 <= e && -8 <= w && 8 > e && 8 > w ? at2lt[16 *
								w + 128 << 8 | 16 * e + 128] : -16 <= e && -16 <= w && 16 > e && 16 > w ? at2lt[8 * w + 128 << 8 | 8 * e + 128] : -127 <= e && -127 <= w && 127 > e && 127 > w ? at2lt[w + 128 << 8 | e + 128] : Math.atan2(w, e), c.atx[t] = c.atx[t - 1] + 4 * Math.cos(angle) * c.sc, c.aty[t] = c.aty[t - 1] + 4 * Math.sin(angle) * c.sc);
								b.globalAlpha = G;
								b.strokeStyle = c.atc1;
								b.lineWidth = 5 * A;
								b.lineCap = "round";
								b.lineJoin = "round";
								b.beginPath();
								fj = c.atx.length - 1;
								e = (c.atx[fj] - view_xx) * gsc;
								w = (c.aty[fj] - view_yy) * gsc;
								b.moveTo(e, w);
								for (t = fj - 1; 1 <= t; t--) xx = (c.atx[t] - view_xx) * gsc, yy = (c.aty[t] - view_yy) * gsc, 1 <= Math.abs(xx - e) +
								Math.abs(yy - w) && (e = xx, w = yy, b.lineTo(e, w));
								xx = (.5 * (c.atx[1] + c.atx[0]) - view_xx) * gsc;
								yy = (.5 * (c.aty[1] + c.aty[0]) - view_yy) * gsc;
								1 <= Math.abs(xx - e) + Math.abs(yy - w) && (e = xx, w = yy, b.lineTo(e, w));
								b.stroke();
								b.globalAlpha = c.atia * G;
								b.strokeStyle = c.atc2;
								b.lineWidth = 4 * A;
								b.beginPath();
								fj = c.atx.length - 1;
								e = (c.atx[fj] - view_xx) * gsc;
								w = (c.aty[fj] - view_yy) * gsc;
								b.moveTo(e, w);
								for (t = fj - 1; 0 <= t; t--) xx = (c.atx[t] - view_xx) * gsc, yy = (c.aty[t] - view_yy) * gsc, 1 <= Math.abs(xx - e) + Math.abs(yy - w) && (e = xx, w = yy, b.lineTo(e, w));
								b.stroke();
								c.atwg &&
								(b.lineWidth = 3 * A, b.stroke(), b.lineWidth = 2 * A, b.stroke());
								b.globalAlpha = G * c.blba;
								if (c.abrot) {
									b.save();
									b.translate((c.atx[fj] - view_xx) * gsc, (c.aty[fj] - view_yy) * gsc);
									vang = Math.atan2(c.aty[fj] - c.aty[fj - 1], c.atx[fj] - c.atx[fj - 1]) - c.atba;
									if (0 > vang || vang >= pi2) vang %= pi2;
									vang < -Math.PI ? vang += pi2 : vang > Math.PI && (vang -= pi2);
									c.atba = (c.atba + .15 * vang) % pi2;
									b.rotate(c.atba);
									b.drawImage(c.bulb, c.blbx * c.bsc * A, c.blby * c.bsc * A, c.blbw * c.bsc * A, c.blbh * c.bsc * A);
									b.restore()
								} else b.drawImage(c.bulb, (c.atx[fj] - view_xx + c.blbx * c.bsc *
										c.sc) * gsc, (c.aty[fj] - view_yy + c.blby * c.bsc * c.sc) * gsc, c.blbw * c.bsc * A, c.blbh * c.bsc * A);
								c.apbs && (b.globalAlpha = .5 * G, b.lineWidth = 3 * A, b.stroke(), b.lineWidth = 2 * A, b.stroke())
							} else c.antenna_shown && (c.antenna_shown = !1);
						if (c.dead) {
							b.save();
							b.globalCompositeOperation = "lighter";
							z = (.15 + .15 * Math.abs(Math.sin(5 * Math.PI * c.dead_amt))) * Math.sin(Math.PI * c.dead_amt);
							D *= gsc;
							for (t = B - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], b.save(), b.globalAlpha = z * (.6 + .4 * Math.cos(t / 4 - 15 * c.dead_amt)), b.translate((px - view_xx) * gsc, (py - view_yy) *
									gsc), 4 > t ? (e = D * (1 + (4 - t) * c.swell), b.drawImage(kdmc, -e, -e, 2 * e, 2 * e)) : b.drawImage(kdmc, -D, -D, 2 * D, 2 * D), b.restore());
							b.restore()
						}
						b.restore()
					}
					c.one_eye ? (t = 3 * x, D = Math.cos(C) * t, B = Math.sin(C) * t, A = x * c.ebisz, b.drawImage(c.ebi, 0, 0, c.ebiw, c.ebih, mww2 + (D + h - A / 2 - view_xx) * gsc, mhh2 + (B + u - A / 2 - view_yy) * gsc, A * gsc, A * gsc), D = Math.cos(C) * (t + .15) + c.rex * x, B = Math.sin(C) * (t + .15) + c.rey * x, A = x * c.episz, b.drawImage(c.epi, 0, 0, c.epiw, c.epih, mww2 + (D + h - A / 2 - view_xx) * gsc, mhh2 + (B + u - A / 2 - view_yy) * gsc, A * gsc, A * gsc)) : (t = c.ed * x, z = c.esp * x, c.eac ||
					(D = Math.cos(C) * t + Math.cos(C - Math.PI / 2) * (z + .5), B = Math.sin(C) * t + Math.sin(C - Math.PI / 2) * (z + .5), b.fillStyle = c.ec, 0 < c.eo && (b.lineWidth = c.eo * gsc, b.strokeStyle = "#000000"), b.globalAlpha = c.eca * c.alive_amt, b.beginPath(), b.arc(mww2 + (D + h - view_xx) * gsc, mhh2 + (B + u - view_yy) * gsc, c.er * x * gsc, 0, pi2), b.closePath(), 0 < c.eo && b.stroke(), b.fill(), b.globalAlpha = c.ppa, D = Math.cos(C) * (t + .5) + c.rex * x + Math.cos(C - Math.PI / 2) * z, B = Math.sin(C) * (t + .5) + c.rey * x + Math.sin(C - Math.PI / 2) * z, b.fillStyle = c.ppc, b.beginPath(), b.arc(mww2 + (D + h - view_xx) *
							gsc, mhh2 + (B + u - view_yy) * gsc, c.pr * x * gsc, 0, pi2), b.closePath(), b.fill()), c.eac || (D = Math.cos(C) * t + Math.cos(C + Math.PI / 2) * (z + .5), B = Math.sin(C) * t + Math.sin(C + Math.PI / 2) * (z + .5), b.fillStyle = c.ec, 0 < c.eo && (b.lineWidth = c.eo * gsc, b.strokeStyle = "#000000"), b.globalAlpha = c.eca * c.alive_amt, b.beginPath(), b.arc(mww2 + (D + h - view_xx) * gsc, mhh2 + (B + u - view_yy) * gsc, c.er * x * gsc, 0, pi2), b.closePath(), 0 < c.eo && b.stroke(), b.fill(), b.globalAlpha = c.ppa, D = Math.cos(C) * (t + .5) + c.rex * x + Math.cos(C + Math.PI / 2) * z, B = Math.sin(C) * (t + .5) + c.rey * x + Math.sin(C +
							Math.PI / 2) * z, b.fillStyle = c.ppc, b.beginPath(), b.arc(mww2 + (D + h - view_xx) * gsc, mhh2 + (B + u - view_yy) * gsc, c.pr * x * gsc, 0, pi2), b.closePath(), b.fill()), c.jyt && (A = c.sc * gsc * .25, t = -3 * x, z = 7 * x, D = Math.cos(C) * (t + .5) + c.rex * x + Math.cos(C - Math.PI / 2) * z, B = Math.sin(C) * (t + .5) + c.rey * x + Math.sin(C - Math.PI / 2) * z, b.save(), b.translate(mww2 + (D + h - view_xx) * gsc, mhh2 + (B + u - view_yy) * gsc), b.rotate(C), b.drawImage(ecmc, -24 * A, -24 * A, 48 * A, 48 * A), b.restore(), D = Math.cos(C) * (t + .5) + c.rex * x + Math.cos(C + Math.PI / 2) * z, B = Math.sin(C) * (t + .5) + c.rey * x + Math.sin(C +
							Math.PI / 2) * z, b.save(), b.translate(mww2 + (D + h - view_xx) * gsc, mhh2 + (B + u - view_yy) * gsc), b.rotate(C), b.drawImage(ecmc, -24 * A, -24 * A, 48 * A, 48 * A), b.restore(), t = 5 * x, D = Math.cos(C) * (t + .5) + c.rex * x, B = Math.sin(C) * (t + .5) + c.rey * x, A = c.sc * gsc * .16, b.save(), b.translate(mww2 + (D + h - view_xx) * gsc, mhh2 + (B + u - view_yy) * gsc), b.rotate(C), b.drawImage(jmou, -40 * A, -65 * A, 79 * A, 130 * A), b.restore()));
					b.globalAlpha = 1;
					c.slg && (A = c.sc * gsc * .25, b.save(), e = 13 * Math.cos(C) * x + Math.cos(C - Math.PI / 2) * (6 * x + .5), w = 13 * Math.sin(C) * x + Math.sin(C - Math.PI / 2) * (6 *
							x + .5), b.translate(mww2 + (e + h - view_xx) * gsc, mhh2 + (w + u - view_yy) * gsc), b.rotate(C - .4), b.drawImage(sest, -28 * A, -44 * A, 105 * A, 88 * A), b.restore(), b.save(), e = 13 * Math.cos(C) * x + Math.cos(C + Math.PI / 2) * (6 * x + .5), w = 13 * Math.sin(C) * x + Math.sin(C + Math.PI / 2) * (6 * x + .5), b.translate(mww2 + (e + h - view_xx) * gsc, mhh2 + (w + u - view_yy) * gsc), b.rotate(C + .4), b.drawImage(sest, -28 * A, -44 * A, 105 * A, 88 * A), b.restore())
				}
			if (high_quality || 0 < gla) {
				b.save();
				b.globalCompositeOperation = "lighter";
				//Food glow
				for (f = foods_c - 1; 0 <= f; f--) c = foods[f], c.rx >= fpx1 && c.ry >= fpy1 && c.rx <=
				fpx2 && c.ry <= fpy2 && (e = c.rx - view_xx, w = c.ry - view_yy, h = e * e + w * w, fs = 1 + .06 * c.rad, B = e * fs, z = w * fs, J = .005 + .09 * (1 - h / (86E3 + h)), 1 != c.rad && (J *= Math.pow(c.rad, .25)), 1 != gla && (J *= gla), B = B * gsc + mww2, z = z * gsc + mhh2, 1 == c.rad ? (B -= c.gfw2, z -= c.gfh2, b.globalAlpha = J * c.fr, b.drawImage(c.gfi, B, z), b.globalAlpha = J * (.5 + .5 * Math.cos(c.gfr / 13)) * c.fr, b.drawImage(c.gfi, B, z)) : (B -= c.gfw2 * c.rad, z -= c.gfh2 * c.rad, b.globalAlpha = J * c.fr, b.drawImage(c.gfi, 0, 0, c.gfw, c.gfh, B, z, c.gfw * c.rad, c.gfh * c.rad), b.globalAlpha = J * (.5 + .5 * Math.cos(c.gfr / 13)) * c.fr,
						b.drawImage(c.gfi, 0, 0, c.gfw, c.gfh, B, z, c.gfw * c.rad, c.gfh * c.rad)), fs = 1 + .32 * c.rad, B = e * fs, z = w * fs, J = .085 * (1 - h / (16500 + h)), 1 != c.rad && (J *= Math.pow(c.rad, .25)), 1 != gla && (J *= gla), B = B * gsc + mww2, z = z * gsc + mhh2, 1 == c.rad ? (B -= c.g2fw2, z -= c.g2fh2, b.globalAlpha = J * c.fr, b.drawImage(c.g2fi, B, z), b.globalAlpha = J * (.5 + .5 * Math.cos(c.gfr / 13)) * c.fr, b.drawImage(c.g2fi, B, z)) : (B -= c.g2fw2 * c.rad, z -= c.g2fh2 * c.rad, b.globalAlpha = J * c.fr, b.drawImage(c.g2fi, 0, 0, c.g2fw, c.g2fh, B, z, c.g2fw * c.rad, c.g2fh * c.rad), b.globalAlpha = J * (.5 + .5 * Math.cos(c.gfr /
						13)) * c.fr, b.drawImage(c.g2fi, 0, 0, c.g2fw, c.g2fh, B, z, c.g2fw * c.rad, c.g2fh * c.rad)));
				b.restore()
			}
			b.save();
			b.globalCompositeOperation = "lighter";
			for (f = preys.length - 1; 0 <= f; f--) h = preys[f], e = h.xx + h.fx, w = h.yy + h.fy, h.eaten && (c = h.eaten_by, q = Math.pow(h.eaten_fr, 2), e += (c.xx + c.fx + Math.cos(c.ang + c.fa) * (43 - 24 * q) * (1 - q) - e) * q, w += (c.yy + c.fy + Math.sin(c.ang + c.fa) * (43 - 24 * q) * (1 - q) - w) * q), e -= view_xx, w -= view_yy, c = e * e + w * w, fs = 1 + .08 * h.rad, px = e * fs, py = w * fs, J = .4 * (1 - c / (176E3 + c)), 1 != h.rad && (J *= Math.pow(h.rad, .25)), px = px * gsc + mww2, py =
					py * gsc + mhh2, 1 == h.rad ? -150 <= px && -150 <= py && px <= mwwp150 && py <= mhhp150 && (px -= h.gfw2, py -= h.gfh2, b.globalAlpha = J * h.fr, b.drawImage(h.gfi, px, py), b.globalAlpha = J * (.5 + .5 * Math.cos(h.gfr / 13)) * h.fr, b.drawImage(h.gfi, px, py)) : -150 <= px && -150 <= py && px <= mwwp150 && py <= mhhp150 && (px -= h.gfw2 * h.rad, py -= h.gfh2 * h.rad, b.globalAlpha = J * h.fr, b.drawImage(h.gfi, 0, 0, h.gfw, h.gfh, px, py, h.gfw * h.rad, h.gfh * h.rad), b.globalAlpha = J * (.5 + .5 * Math.cos(h.gfr / 13)) * h.fr, b.drawImage(h.gfi, 0, 0, h.gfw, h.gfh, px, py, h.gfw * h.rad, h.gfh * h.rad)), fs = 1 + .32 * h.rad,
					px = e * fs, py = w * fs, J = .35 * (1 - c / (46500 + c)), 1 != h.rad && (J *= Math.pow(h.rad, .25)), c = 2 * h.rad, px = px * gsc + mww2, py = py * gsc + mhh2, -150 <= px && -150 <= py && px <= mwwp150 && py <= mhhp150 && (px -= h.gfw2 * c, py -= h.gfh2 * c, b.globalAlpha = J * h.fr, b.drawImage(h.gfi, 0, 0, h.gfw, h.gfh, px, py, h.gfw * c, h.gfh * c), b.globalAlpha = J * (.5 + .5 * Math.cos(h.gfr / 13)) * h.fr, b.drawImage(h.gfi, 0, 0, h.gfw, h.gfh, px, py, h.gfw * c, h.gfh * c));
			b.restore();
			if (4E3 > Math.abs(game_radius - view_dist)) {
				b.save();
				b.lineWidth = 23 * gsc;
				b.strokeStyle = "#800000";
				b.fillStyle = "#300000";
				b.beginPath();
				xx = game_radius + Math.cos(view_ang - 2E3 / game_radius) * game_radius * .98;
				yy = game_radius + Math.sin(view_ang - 2E3 / game_radius) * game_radius * .98;
				b.moveTo(mww2 + (xx - view_xx) * gsc, mhh2 + (yy - view_yy) * gsc);
				for (t = -2E3; 2E3 >= t; t += 100) xx = game_radius + Math.cos(view_ang + t / game_radius) * game_radius * .98, yy = game_radius + Math.sin(view_ang + t / game_radius) * game_radius * .98, b.lineTo(mww2 + (xx - view_xx) * gsc, mhh2 + (yy - view_yy) * gsc);
				xx = game_radius + Math.cos(view_ang + 2E3 / game_radius) * (game_radius + 4E3);
				yy = game_radius + Math.sin(view_ang + 2E3 / game_radius) * (game_radius + 4E3);
				b.lineTo(mww2 + (xx - view_xx) * gsc, mhh2 + (yy - view_yy) * gsc);
				xx = game_radius + Math.cos(view_ang - 2E3 / game_radius) * (game_radius + 4E3);
				yy = game_radius + Math.sin(view_ang -
						2E3 / game_radius) * (game_radius + 4E3);
				b.lineTo(mww2 + (xx - view_xx) * gsc, mhh2 + (yy - view_yy) * gsc);
				b.closePath();
				b.stroke();
				b.fill();
				b.restore()
			}
			if (wumsts && 0 < rank && 0 < snake_count && playing) {


				wumsts = !1;
				c = "Your length";
				f = "of";
				J = "Your rank";
				if ("de" == lang) {
					c = "Deine L\u00e4nge";
					f = "von";
					J = "Dein rang";
				} else if ("fr" == lang) {
					c = "Votre longueur";
					f = "de";
					J = "Ton rang";
				} else if ("pt" == lang) {
					c = "Seu comprimento";
					f = "do";
					J = "Seu classifica\u00e7\u00e3o";
				}

				var s = "" + '<span style="font-size: 14px;"><span style="opacity: .4;">' + c + ': </span><span style="opacity: .8; font-weight: bold;">';
				s += Math.floor(15 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 5) / 1 + "</span></span>";
				//console.log(snake.sct + snake.fam);
				s += '<BR><span style="opacity: .3;">' + J + ': </span><span style="opacity: .35;">' + rank + '</span><span style="opacity: .3;"> ';
				s += f + ' </span><span style="opacity: .35;">' + snake_count + "</span>";
				lbf.innerHTML = s;
				lbf.style.opacity = 1;
			}
			b.restore();
		}
	}

	function showLogo(b) {


		var f = Date.now(),
				c = (f - lgtm) / 25;
		lgtm = f;
		var h, u, q, e, w, C, x, D, G, A, t, B, z, I, M;
		lgfr += c;
		if (0 == lts[lts.length - 1].mwig && 1 == lga && 1 == lgss && 1 == ncka) clearInterval(showlogo_iv), showlogo_iv = -1;
		else {
			if (b || 1 != lga) lga += .05 * c, 1 <= lga && (lga = 1), lmc2.style.opacity = lga;
			1 != lgss && (lgss += .00375 * c, 1 <= lgss && (lgss = 1));
			if (b || 1 != ncka) {
				ncka += .006 * c;
				1 <= ncka && (ncka = 1);
				nick_holder.style.opacity = Math.min(1, 6 * ncka);
				is_mobile || (smh.style.opacity = Math.max(0, Math.min(1, 5 * (ncka - .05))));
				.01 <= ncka && (playh.style.opacity = Math.min(1, 5 * (ncka - .01)));
			}
			lctx.clearRect(0, 0, lw, lh);
			for (f = 0; f < lts.length; f++) {
				var y = lts[f],
						E = y.pts,
						H = y.kc,
						K = y.ws,
						N = y.wr,
						F = y.qm;
				h = y.sp;
				var O = y.sz;
				M = y.r;
				var L = y.mwig;
				b && (y.wch = !0, L = 1E-7);
				y.wch && 0 != L && (L *= .982, L -= .001 * c, 1 == render_mode && (L -= .005 * c), 0 >= L && (L = 0), y.mwig = L);
				M || (M = 1);
				lctx.beginPath();
				var canvas_element = document.createElement("canvas");
				context = canvas_element.getContext("2d")
				9 > f ? (q = context.createLinearGradient(0, 70 * lgsc, 0, 230 * lgsc), q.addColorStop(0, "#80FFA0"), q.addColorStop(1, "#008040")) : (q = context.createLinearGradient(0, 50 * lgsc, 0, 265 * lgsc), q.addColorStop(0, "#9850FF"), q.addColorStop(1, "#281060"));
				lctx.fillStyle =
						q;
				z = !1;
				I = 0;
				q = E[0];
				e = E[1];
				G = q;
				A = e;
				var J = lgfr * h;
				for (t = 2; t < E.length; t += 4) {
					h = q;
					u = e;
					cx2 = E[t];
					cy2 = E[t + 1];
					q = E[t + 2];
					e = E[t + 3];
					for (var Q = 1; Q <= H; Q++) {
						I++;
						var P = Q / H;
						w = h + (cx2 - h) * P;
						C = u + (cy2 - u) * P;
						x = cx2 + (q - cx2) * P;
						D = cy2 + (e - cy2) * P;
						w += (x - w) * P;
						C += (D - C) * P;
						G = Math.atan2(C - A, w - G);
						z ? (G - B > Math.PI ? G -= 2 * Math.PI : G - B < -Math.PI && (G += 2 * Math.PI), B += .05 * (G - B), B %= 2 * Math.PI) : (z = !0, B = G);
						G = w;
						A = C;
						w += Math.cos(Math.PI / 2 + B) * Math.sin(J) * K * L;
						C += Math.sin(Math.PI / 2 + B) * Math.sin(J) * K * L;
						J -= .76 * F * K;
						K += N;
						lctx.beginPath();
						D = 1.15 * O * Math.min(1, lgsc * (.2 +
								.8 * lga) * (30 * lgss * M - I / 20 - f / 2));
						.5 < D && (lctx.arc(w * lgsc, C * lgsc, D, 0, pi2), y.wch = !0);
						lctx.fill()
					}
				}
			}
			lctx2.clearRect(0, 0, lw, lh);
			lctx2.shadowColor = "#000000";
			lctx2.shadowBlur = 16;
			lctx2.shadowOffsetY = 7;
			lctx2.drawImage(lmc, 0, 0)
		}
	}


	function connect() {
		var server = window.location.hostname;
		var port = 8080;
		var cstring = "ws://" + server + ":" + port + "/game/socket";
		if (server === "urgame.me")
			cstring = "wss://" + server + "/game/socket";

		resetGame();
		connecting = 1;
		start_connect_mtm = Date.now();

		testing && (console.log("connecting to " + server + ":" + port + "... "));
		//ws = new WebSocket("ws://" + bso.ip + ":" + bso.po + "/slither");
		ws = new WebSocket(cstring);
		ws.binaryType = "arraybuffer";
		window.ws = ws;
		ws.onmessage = function (b) {
			if (typeof this.counter == 'undefined') {
				// It has not... perform the initialization
				this.counter = 0;
			}
			this.counter++;
			//console.log(this.counter);


			if (ws == this) {
				b = new Uint8Array(b.data);
				var packet = b;
				//console.log("b[0] is " + b[0]);
				rdps += packet.length;

				if (testing) {
					omcps++;
					var now = Date.now();
					if (1E3 < now - lomcpstm) {
						lomcpstm = now;
						console.log("omcps: " + omcps + "    frames: " + omfps);
						omfps = omcps = 0;
					}
				}

				if (packet.length >= 2) {

					last_packet_time = current_packet_time;
					current_packet_time = Date.now();
					var time_since_last_message = packet[0] << 8 | packet[1];
					var elapsed_packet_time = current_packet_time - last_packet_time;

					if (last_packet_time === 0)
						elapsed_packet_time = 0;

					//Lag offset in millis?
					etm += Math.max(-180, Math.min(180, elapsed_packet_time - time_since_last_message));

					//Update packet byte counter
					if (testing)
						rdpspc[packet[2]] += packet.length;


					var command = String.fromCharCode(packet[2]);
					var c = 3;
					var f = b.length;
					var e = b.length - 2;
					var q = b.length - 3;


					if ("a" === command) {
						//https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_a_detail
						connecting = false;
						playing = connected = true;

						//def = default, typ = typical
						//Game Radius def. 16384, typ. 21600
						game_radius = packet[c] << 16 | packet[c + 1] << 8 | packet[c + 2];
						c += 3;
						//maximum snake length in body parts units (def. 300, typ. 411)
						//max sections per snake
						var mscps = packet[c] << 8 | packet[c + 1];
						c += 2;
						//sector size def. 480, typ. 300
						sector_size = packet[c] << 8 | packet[c + 1];
						c += 2;
						//unused in game code
						sector_count_along_edge = packet[c] << 8 | packet[c + 1];
						c += 2;
						//coef to calculate angular speed change depending on snake speed def. 4.8, typ 4.8
						spangdv = packet[c] / 10;
						c++;
						//node speed? def. 4.25, typ. 5.39
						nsp1 = (packet[c] << 8 | packet[c + 1]) / 100;
						c += 2;
						//def. 0.5, typ. 0.4
						nsp2 = (packet[c] << 8 | packet[c + 1]) / 100;
						c += 2;
						//def. 12, typ. 14
						nsp3 = (packet[c] << 8 | packet[c + 1]) / 100;
						c += 2;
						//basic snake angular speed def. 0.033, typ. 0.033
						mamu = (packet[c] << 8 | packet[c + 1]) / 1E3;
						c += 2;
						//angle in rad per 8ms at which prey can turn def. 0.028, typ. 0.028
						mamu2 = (packet[c] << 8 | packet[c + 1]) / 1E3;
						c += 2;
						//snake tail speed ratio
						cst = (packet[c] << 8 | packet[c + 1]) / 1E3;
						c += 2;
						//protocol_version def. 2, typ. 8
						c < f && (protocol_version = packet[c]);
						setMscps(mscps);
						lbh.style.display = "inline";
						lbs.style.display = "inline";
						lbn.style.display = "inline";
						lbp.style.display = "inline";
						lbf.style.display = "inline";
						vcm.style.display = "inline";
						loch.style.display = "inline";
						startShowGame();
					} else if ("e" === command || "E" === command || "3" === command || "4" === command || "5" === command) {
						var t = b[c] << 8 | b[c + 1],
								c = c + 2,
								u = -1,
								z = -1,
								I = -1,
								M = -1;
						if (6 <= protocol_version)
							6 == e ?
									(u = "e" == command ?
											1 :
											2, z = 2 * b[c] * Math.PI / 256, c++, I = 2 * b[c] * Math.PI / 256, c++, M = b[c] / 18)
									: 5 == e ?
									"e" == command ?
											(z = 2 * b[c] * Math.PI / 256, c++, M = b[c] / 18)
											: "E" == command ?
											(u = 1, I = 2 * b[c] * Math.PI / 256, c++, M = b[c] / 18)
											: "4" == command ?
													(u = 2, I = 2 * b[c] * Math.PI / 256, c++, M = b[c] / 18)
													: "3" == command ?
															(u = 1, z = 2 * b[c] * Math.PI / 256, c++, I = 2 * b[c] * Math.PI / 256)
															: "5" == command && (u = 2, z = 2 * b[c] * Math.PI / 256, c++, I = 2 * b[c] * Math.PI / 256)
									: 4 == e && ("e" == command ? z = 2 * b[c] * Math.PI / 256 : "E" == command ? (u = 1, I = 2 * b[c] * Math.PI / 256) :
									"4" == command ?
											(u = 2, I = 2 * b[c] * Math.PI / 256)
											: "3" == command && (M = b[c] / 18));

						if (f = os["s" + t]) {

							-1 != u && (f.dir = u);
							anguc++;
							if (-1 != z) {
								f.ang == z && angnuc++;
								b = (z - f.ang) % pi2;
								0 > b && (b += pi2);
								b > Math.PI && (b -= pi2);
								t = f.fapos;
								for (q = 0; q < afc; q++) f.fas[t] -= b * afas[q], t++, t >= afc && (t = 0);
								f.fatg = afc;
								f.ang = z
							}
							-1 != I && (f.wang == I && wangnuc++, f.wang = I, f != snake && (f.eang = I));
							-1 != M && (f.sp = M, f.spang = f.sp / spangdv, 1 < f.spang && (f.spang = 1))
						}
					} else if ("h" == command) {
						if (t = b[c] << 8 | b[c + 1], c += 2, u = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 16777215,
										f = os["s" + t]) f.fam = u, snl(f)
					} else if ("r" == command) {
						if (t = b[c] << 8 | b[c + 1], c += 2, f = os["s" + t]) {
							4 <= q && (f.fam = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 16777215);
							for (q = 0; q < f.pts.length; q++)
								if (!f.pts[q].dying) {
									f.pts[q].dying = true;
									f.sct--;
									f.sc = Math.min(6, 1 + (f.sct - 2) / 106);
									f.scang = .13 + .87 * Math.pow((7 - f.sc) / 6, 2);
									f.ssp = nsp1 + nsp2 * f.sc;
									f.fsp = f.ssp + .1;
									f.wsep = 6 * f.sc;
									b = nsep / gsc;
									f.wsep < b && (f.wsep = b);
									break
								}
							snl(f)
						}
					} else if ("g" == command || "n" == command || "G" == command || "N" == command) {


						if (playing) {
							var y = "n" == command || "N" == command,
									t = b[c] << 8 | b[c + 1],
									current_byte = c + 2;

							if (f = os["s" + t]) {

								if (y) f.sct++;
								else
									for (q = 0; q < f.pts.length; q++)
										if (!f.pts[q].dying) {
											f.pts[q].dying = true;
											break
										}
								var head = f.pts[f.pts.length - 1];
								q = head;

								if ("g" == command || "n" == command) {
									e = b[current_byte] << 8 | b[current_byte + 1];
									current_byte += 2;
									F = b[current_byte] << 8 | b[current_byte + 1];
									current_byte += 2
								} else {
									e = q.xx + b[current_byte] - 128;
									current_byte++;
									F = q.yy + b[current_byte] - 128;
									current_byte++
								}


								y && (f.fam = (b[current_byte] << 16 | b[current_byte + 1] << 8 | b[current_byte + 2]) / 16777215);
								(head = points_dp.get()) || (head = {
									exs: [],
									eys: [],
									efs: [],
									ems: []
								});
								head.eiu = 0;
								head.xx = e;
								head.yy = F;
								head.fx = 0;
								head.fy = 0;
								head.da = 0;
								head.ebx = head.xx - q.xx;
								head.eby = head.yy - q.yy;
								f.pts.push(head);
								//iiv = is in view
								if (f.iiv) {
									b = f.xx + f.fx - head.xx;
									c = f.yy + f.fy - head.yy;
									head.fx += b;
									head.fy += c;
									head.exs[head.eiu] = b;
									head.eys[head.eiu] = c;
									head.efs[head.eiu] = 0;
									head.ems[head.eiu] = 1;
									head.eiu++;
								}
								t = f.pts.length - 3;
								if (1 <= t)
									for (u = f.pts[t], command = n = 0, q = t - 1; 0 <= q; q--) t = f.pts[q], n++, b = t.xx, c = t.yy, 4 >= n && (command = cst * n / 4), t.xx += (u.xx - t.xx) * command, t.yy += (u.yy - t.yy) * command, f.iiv && (b -= t.xx, c -= t.yy, t.fx += b, t.fy += c, t.exs[t.eiu] = b, t.eys[t.eiu] = c, t.efs[t.eiu] = 0, t.ems[t.eiu] = 2, t.eiu++), u = t;
								f.sc = Math.min(6, 1 + (f.sct - 2) / 106);
								f.scang = .13 + .87 * Math.pow((7 - f.sc) / 6, 2);
								f.ssp = nsp1 + nsp2 * f.sc;
								f.fsp = f.ssp + .1;
								f.wsep = 6 * f.sc;
								b = nsep /
										gsc;
								f.wsep < b && (f.wsep = b);
								y && snl(f);
								f.lnp = head;
								f == snake && (ovxx = snake.xx + snake.fx, ovyy = snake.yy + snake.fy);
								t = etm / 8 * f.sp / 4;
								t *= lag_mult;
								q = f.chl - 1;
								f.chl = t / f.msl;
								command = f.xx;
								y = f.yy;
								f.xx = e + Math.cos(f.ang) * t;
								f.yy = F + Math.sin(f.ang) * t;
								b = f.xx - command;
								c = f.yy - y;
								e = f.chl - q;
								t = f.fpos;
								for (q = 0; q < rfc; q++) {
									f.fxs[t] -= b * rfas[q];
									f.fys[t] -= c * rfas[q];
									f.fchls[t] -= e * rfas[q];
									t++;
									t >= rfc && (t = 0);
								}
								f.fx = f.fxs[f.fpos];
								f.fy = f.fys[f.fpos];
								f.fchl = f.fchls[f.fpos];
								f.ftg = rfc;
								f.ehl = 0;
								if (f == snake) {
									b = view_xx;
									c = view_yy;
									view_xx = snake.xx + snake.fx;
									view_yy = snake.yy +
											snake.fy;
									bgx -= view_xx - b;
									bgy -= view_yy - c;
									b = view_xx - ovxx;
									c = view_yy - ovyy;
									t = fvpos;
									for (q = 0; q < vfc; q++) fvxs[t] -= b * vfas[q], fvys[t] -= c * vfas[q], t++, t >= vfc && (t = 0);
									fvtg = vfc
								}
							}

						}
					} else if ("l" == command) {
						if (playing) {
							wumsts = true;
							z = E = F = "";
							M = I = 0;
							-1 == lb_fr && -1 == dead_mtm && (lb_fr = 0);
							var H = b[c];
							c++;
							rank = b[c] << 8 | b[c + 1];
							rank < best_rank && (best_rank = rank);
							c += 2;
							snake_count = b[c] << 8 | b[c + 1];
							snake_count > biggest_snake_count && (biggest_snake_count = snake_count);
							for (c += 2; c < f;) {
								var K = b[c] << 8 | b[c + 1],
										c = c + 2,
										u = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 16777215,
										c =
												c + 3,
										y = b[c] % 9;
								c++;
								e = b[c];
								c++;
								M++;
								command = "";
								for (q = 0; q < e; q++) t = b[c], command += String.fromCharCode(t), c++;
								M == H ? (command = my_nick, e = command.length) : gdnm(command) || (command = "");
								for (var N = "", q = 0; q < e; q++) t = command.charCodeAt(q), N = 38 == t ? N + "&amp;" : 60 == t ? N + "&lt;" : 62 == t ? N + "&gt;" : 32 == t ? N + "&nbsp;" : N + String.fromCharCode(t);
								command = N;
								I++;
								score = Math.floor(15 * (fpsls[K] + u / fmlts[K] - 1) - 5) / 1;
								t = M == H ? 1 : .7 * (.3 + .7 * (1 - I / 10));
								F += '<span style="opacity:' + t + "; color:" + per_color_imgs[y].cs + ';">' + score + "</span><BR>";
								E += '<span style="opacity:' + t + "; color:" + per_color_imgs[y].cs +
										";" + (M == H ? "font-weight:bold;" : "") + '">' + command + "</span><BR>";
								z += '<span style="opacity:' + t + "; color:" + per_color_imgs[y].cs + ';">#' + I + "</span><BR>"
							}
							lbs.innerHTML = F;
							lbn.innerHTML = E;
							lbp.innerHTML = z
						}
					} else if ("v" == command) 2 == b[c] ? (want_close_socket = !0, want_victory_message = !1, want_hide_victory = 1, hvfr = 0) : (dead_mtm = Date.now(), play_btn.setEnabled(!0), e = Math.floor(15 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 5) / 1,
							F = "Your final length was", "de" == lang ? F = "Deine endg\u00fcltige L\u00e4nge war" : "fr" == lang ? F = "Votre longueur finale \u00e9tait de" : "pt" == lang && (F = "Seu comprimento final foi de"), f = "", 1E3 < e && (f = "!"), lastscore.innerHTML = '<span style="opacity: .45;">' + F + " </span><b>" + e + "</b>" + f, e = "Play Again", "fr" == lang ? e = "Jouer" : "pt" == lang && (e = "Joga"), UI.setPlayBtnText(String.fromCharCode(160) + e + String.fromCharCode(160)), 1 == b[c] ? (nick_holder.style.display = "none", playh.style.display = "none", smh.style.display = "none", victory_holder.style.display =
							"inline", saveh.style.display = "block", want_victory_focus = want_victory_message = !0, victory.disabled = !1, save_btn.setEnabled(!0)) : want_close_socket = !0);
					else if ("W" == command) e = b[c], c++, F = b[c], f = {}, f.xx = e, f.yy = F, sectors.push(f);
					else if ("w" == command)
						if (8 <= protocol_version ? (f = 2, e = b[c], c++, F = b[c]) : (f = b[c], c++, e = b[c] << 8 | b[c + 1], c += 2, F = b[c] << 8 | b[c + 1]), 1 == f) f = {}, f.xx = e, f.yy = F, sectors.push(f);
						else {
							for (y = cm1 = foods_c - 1; 0 <= y; y--) q = foods[y], q.sx == e && q.sy == F && (y == cm1 ? foods[y] = null : (foods[y] = foods[cm1], foods[cm1] = null), foods_c--,
									cm1--);
							for (y = sectors.length - 1; 0 <= y; y--) f = sectors[y], f.xx == e && f.yy == F && sectors.splice(y, 1)
						}
					else if ("m" == command) {
						K = b[c] << 16 | b[c + 1] << 8 | b[c + 2];
						c += 3;
						u = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 16777215;
						c += 3;
						F = Math.floor(15 * (fpsls[K] + u / fmlts[K] - 1) - 5) / 1;
						e = b[c];
						c++;
						q = "";
						for (y = 0; y < e; y++) q += String.fromCharCode(b[c]), c++;
						gdnm(q) || (q = "");
						for (e = ""; c < f;) e += String.fromCharCode(b[c]), c++;
						gdnm(e) || (e = "");
						q = q.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
						e = e.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
						0 < F && (b = "", 0 < e.length && (b += "<span style='font-size:17px;'><b><i><span style='opacity: .5;'>&quot;</span>" + e + "<span style='opacity: .5;'>&quot;</span></i></b></span><BR><div style='height: 5px;'></div>"), 0 < q.length ? (b = 0 < e.length ? b + ("<i><span style='opacity: .5;'>- </span><span style='opacity: .75;'><b>" + q + "</b></span><span style='opacity: .5;'>, today's longest</span></i>") : "<i><span style='opacity: .5;'>Today's longest was </span><span style='opacity: .75;'><b>" + q + "</b></span></i>", b += "<br><i><span style='opacity: .5;'>with a length of </span><span style='opacity: .65;'><b>" +
								F + "</b></span></i>") : b = 0 < e.length ? b + "<i><span style='opacity: .5;'>- </span><span style='opacity: .5;'>today's longest</span></i>" + ("<br><i><span style='opacity: .5;'>with a length of </span><span style='opacity: .65;'><b>" + F + "</b></span></i>") : b + ("<i><span style='opacity: .5;'>Today's longest: </span><span style='opacity: .75;'><b>" + F + "</b></span></i>"), vcm.innerHTML = b)
					} else if ("p" == command) {
						wfpr = false;
						if (lagging) {
							etm *= lag_mult;
							lagging = false;
						}
					}
					else if ("u" == command) {
						q = asmc.getContext("2d");
						q.clearRect(0, 0, 80, 80);
						q.fillStyle =
								"#FFFFFF";
						for (var F = e = 0; c < f && !(80 <= F);)
							if (t = b[c++], 128 <= t)
								for (t -= 128, y = 0; y < t && !(e++, 80 <= e && (e = 0, F++, 80 <= F)); y++) ;
							else
								for (y = 0; 7 > y && !(0 < (t & u_m[y]) && q.fillRect(e, F, 1, 1), e++, 80 <= e && (e = 0, F++, 80 <= F)); y++) ;
					} else if ("s" == command) {
						if (playing)
							if (t = b[c] << 8 | b[c + 1], c += 2, 6 < q) {
								z = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215;
								c += 3;
								c++;
								I = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215;
								c += 3;
								M = (b[c] << 8 | b[c + 1]) / 1E3;
								c += 2;
								u = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 16777215;
								c += 3;
								y = b[c];
								c++;
								H = [];
								K = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 5;
								c += 3;
								N = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 5;
								c += 3;
								e = b[c];
								c++;
								command = "";
								for (q = 0; q < e; q++) command += String.fromCharCode(b[c]), c++;
								for (var F = e = 0, O, L = false; c < f;) {
									q = e;
									O = F;
									if (L) {
										e += (b[c] - 127) / 2;
										c++;
										F += (b[c] - 127) / 2;
										c++
									} else {
										e = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 5;
										c += 3;
										F = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 5;
										c += 3;
										q = e;
										O = F;
										L = true;
									}
									(E = points_dp.get()) || (E = {
										exs: [],
										eys: [],
										efs: [],
										ems: []
									});
									E.eiu = 0, E.xx = e, E.yy = F, E.fx = 0, E.fy = 0, E.da = 0, E.ebx = e - q, E.eby = F - O;
									H.push(E);
								}
								//t = id
								//K = tailx
								//N = taily
								f = newSnake(t, K, N, y, z, H);
								null == snake ? (view_xx = e, view_yy = F, snake = f, snake.md = !1, snake.wmd = !1, f.nk = my_nick) : (f.nk = command, gdnm(command) ||
								(f.nk = ""));
								f.eang = f.wang = I;
								f.sp = M;
								f.spang = f.sp / spangdv;
								1 < f.spang && (f.spang = 1);
								f.fam = u;
								f.sc = Math.min(6, 1 + (f.sct - 2) / 106);
								f.scang = .13 + .87 * Math.pow((7 - f.sc) / 6, 2);
								f.ssp = nsp1 + nsp2 * f.sc;
								f.fsp = f.ssp + .1;
								f.wsep = 6 * f.sc;
								b = nsep / gsc;
								f.wsep < b && (f.wsep = b);
								f.sep = f.wsep;
								snl(f)
							} else
								for (b = 1 == b[c], y = snakes.length - 1; 0 <= y; y--)
									if (snakes[y].id == t) {
										snakes[y].id = -1234;
										b ? (snakes[y].dead = !0, snakes[y].dead_amt = 0, snakes[y].edir = 0) : snakes.splice(y, 1);
										delete os["s" + t];
										break
									}
					} else if ("F" == command)
						if (4 <= protocol_version)
							for (command = !1; c < f;) y =
									b[c], c++, e = b[c] << 8 | b[c + 1], c += 2, F = b[c] << 8 | b[c + 1], c += 2, q = b[c] / 5, c++, t = F * game_radius * 3 + e, q = newFood(t, e, F, q, !0, y), command || (command = !0, u = Math.floor(e / sector_size), E = Math.floor(F / sector_size)), q.sx = u, q.sy = E;
						else
							for (u = b[c] << 8 | b[c + 1], c += 2, E = b[c] << 8 | b[c + 1], c += 2; c < f;) t = b[c] << 16 | b[c + 1] << 8 | b[c + 2], c += 3, y = b[c], c++, e = sector_size * (u + b[c] / 255), c++, F = sector_size * (E + b[c] / 255), c++, q = b[c] / 5, c++, q = newFood(t, e, F, q, !0, y), q.sx = u, q.sy = E;
					else if ("b" == command || "f" == command) {
						y = b[c];
						c++;
						if (4 < q) {
							e = b[c] << 8 | b[c + 1];
							c += 2;
							F = b[c] << 8 | b[c + 1];
							t = F *
									game_radius * 3 + e;
							q = b[c + 2] / 5;
							q = newFood(t, e, F, q, "b" == command, y);
							q.sx = Math.floor(e / sector_size);
							q.sy = Math.floor(F / sector_size);
						}

					}

					else if ("c" == command) {
						if (4 <= protocol_version) {
							//Food_x
							e = b[c] << 8 | b[c + 1];
							c += 2;
							//Food_y
							F = b[c] << 8 | b[c + 1];
							c += 2;
							//Y * game_radius * 3 + x
							t = F * game_radius * 3 + e;
						} else {
							t = b[c] << 16 | b[c + 1] << 8 | b[c + 2];
							c += 3;
						}

						for (y = cm1 = foods_c - 1; 0 <= y; y--) {
							var food = foods[y];
							if (food.id == t) {
								food.eaten = true;
								if (c + 2 <= f) {
									b = b[c] << 8 | b[c + 1];
									food.eaten_by = os["s" + b];
									food.eaten_fr = 0
								} else {
									if (y == cm1) {
										foods[y] = null
									} else {
										foods[y] = foods[cm1];
										foods[cm1] = null;
										foods_c--;
										cm1--
									}
								}

								t = -1;
								break;
							}
						}
						testing && -1 != t && console.log("wtf")
					} else if ("j" == command) {
						t = b[c] << 8 | b[c + 1];
						c += 2;
						e = 1 + 3 * (b[c] << 8 | b[c + 1]);
						c += 2;
						F = 1 + 3 * (b[c] << 8 | b[c + 1]);
						c += 2;
						f = null;
						for (y = preys.length - 1; 0 <= y; y--)
							if (preys[y].id == t) {
								f = preys[y];
								break
							}
						if (f) {
							t = etm / 8 * f.sp / 4;
							t *= lag_mult;
							command = f.xx;
							y = f.yy;
							15 == q ? (f.dir = b[c] - 48, c++, f.ang = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215, c += 3, f.wang = 2 * (b[c] << 16 |
									b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215, c += 3, f.sp = (b[c] << 8 | b[c + 1]) / 1E3) : 11 == q ? (f.ang = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215, c += 3, f.sp = (b[c] << 8 | b[c + 1]) / 1E3) : 12 == q ? (f.dir = b[c] - 48, c++, f.wang = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215, c += 3, f.sp = (b[c] << 8 | b[c + 1]) / 1E3) : 13 == q ? (f.dir = b[c] - 48, c++, f.ang = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215, c += 3, f.wang = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215) : 9 == q ? f.ang = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215 : 10 == q ? (f.dir = b[c] - 48, c++, f.wang = 2 * (b[c] <<
									16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215) : 8 == q && (f.sp = (b[c] << 8 | b[c + 1]) / 1E3);
							f.xx = e + Math.cos(f.ang) * t;
							f.yy = F + Math.sin(f.ang) * t;
							b = f.xx - command;
							c = f.yy - y;
							t = f.fpos;
							for (q = 0; q < rfc; q++) f.fxs[t] -= b * rfas[q], f.fys[t] -= c * rfas[q], t++, t >= rfc && (t = 0);
							f.fx = f.fxs[f.fpos];
							f.fy = f.fys[f.fpos];
							f.ftg = rfc
						}
					} else if ("y" == command)
						if (t = b[c] << 8 | b[c + 1], c += 2, 2 == q)
							for (y = preys.length - 1; 0 <= y; y--) {
								if (f = preys[y], f.id == t) {
									preys.splice(y, 1);
									break
								}
							} else if (4 == q)
							for (b = b[c] << 8 | b[c + 1], y = preys.length - 1; 0 <= y; y--) {
								if (f = preys[y], f.id == t) {
									f.eaten = !0;
									f.eaten_by =
											os["s" + b];
									f.eaten_by ? f.eaten_fr = 0 : preys.splice(y, 1);
									break
								}
							} else y = b[c], c++, e = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 5, c += 3, F = (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) / 5, c += 3, q = b[c] / 5, c++, u = b[c] - 48, c++, I = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215, c += 3, z = 2 * (b[c] << 16 | b[c + 1] << 8 | b[c + 2]) * Math.PI / 16777215, c += 3, M = (b[c] << 8 | b[c + 1]) / 1E3, newPrey(t, e, F, q, y, u, I, z, M)
				}
			}
		};
		ws.onerror = function (b) {
		};
		ws.onclose = function (b) {
			ws == this && (playing = connected = !1)
		};
		ws.onopen = function (b) {
			if (ws == this) {
				b = asciize(nick.value);
				24 < b.length && (b = b.substr(0,
						24));
				if ("gameweek2016" == b.toLowerCase()) {
					b = "";
					try {
						localStorage.gw2k16 = "1", gw2k16 = !0
					} catch (c) {
					}
				}
				my_nick = b;
				gdnm(b) || (b = "");
				var e = Math.floor(9 * Math.random());
				try {
					var f = localStorage.snakercv;
					f == "" + Number(f) && (e = Number(f))
				} catch (c) {
				}
				if (cookie_id) {
					f = new Uint8Array(3 + b.length + cookie_id.length);
					f[0] = 116;
					//skin
					f[1] = e;
					f[2] = cookie_id.length;
					for (e = 0; e < cookie_id.length; e++)
						f[e + 3] = cookie_id.charCodeAt(e);
					for (e = 0; e < b.length; e++)
						f[e + 3 + cookie_id.length] = b.charCodeAt(e);
					ws.send(f);
				} else {
					f = new Uint8Array(3 + b.length);
					f[0] = 115;
					f[1] = 7;
					//skin
					f[2] = e;
					for (e = 0; e < b.length; e++)
						f[e + 3] = b.charCodeAt(e);
					ws.send(f);
				}

				high_quality = !0;
				gla = 1;
				wdfg = 0;
				qsm = 1;
				if (want_quality == 0) {
					(high_quality = !1, gla = 0, qsm = 1.7);
				}
				if (render_mode == 1) {
					(high_quality = !1, gla = 0);
				}

				lpstm = Date.now()
			}
		}

	}


	oef = function () {
		UI.update();

		if(snake && snake.md && Date.now() > boost_notif_time && notify && playing && connected){
			if(snake.sp < snake.fsp){
				notify = false;
				toastr.info("Increase your length to boost!");
			}
			
		}
		

		var b = Date.now();
		vfr = (b - ltm) / 8;

		5 < vfr && (vfr = 5);
		1.56 > vfr && (vfr = 1.56);
		avfr = vfr;
		ltm = b;
		if (!choosing_skin) {
			if (!lagging) {
				if (wfpr && 420 < b - ltm) {
					if (!ready_to_play) lagging = true;
				}
			}
			if (lagging) {
				lag_mult *= .85;
				if (.01 > lag_mult) lag_mult = .01;
			} else {
				if (1 > lag_mult) {
					lag_mult += .05;
					if (1 <= lag_mult) lag_mult = 1;
				}
			}
		}

		120 < vfr && (vfr = 120);
		vfr *= lag_mult;
		
		etm *= lag_mult;
		lfr = fr;
		fr += vfr;
		vfrb = Math.floor(fr) - Math.floor(lfr);
		lfr2 = fr2;
		fr2 += 2 * vfr;
		vfrb2 = Math.floor(fr2) - Math.floor(lfr2);
		keydown_left && (kd_l_frb += vfrb);
		keydown_right && (kd_r_frb += vfrb);

		if (ready_to_play && !shoa && -1 == dead_mtm) {
			ready_to_play = false;
			connect();
		}

		if (spinner_shown) {
			lsfr += avfr;
			var f = ldmc.getContext("2d");
			f.clearRect(0, 0, 512, 128);

			for (var c, h, u = 1; 2 >= u; u++) {
				var xx, yy;
				f.beginPath();
				if (1 == u) {
					(f.fillStyle = "#60FF70", h = 0)
				} else {
					(f.fillStyle = "#9850FF", h = Math.PI)
				}

				for (var q = 0; 256 >= q; q++) c = 32 + 5 * Math.cos(h + lsfr / 6 + 8 * q / 256) + 8 * q / 256, 256 == q && (c += 10), xx = 64 + Math.cos(h + lsfr / 44 + .8 * Math.PI * q / 256) * c * 1.25, yy = 64 + Math.sin(h + lsfr / 44 + .8 * Math.PI * q / 256) * c, 0 == q ? f.moveTo(xx, yy) : f.lineTo(xx, yy);
				c = 32;
				xx = 64 + Math.cos(h + lsfr / 44 + .8 * Math.PI * (q + 47) / 256) * c * 1.25;
				yy = 64 + Math.sin(h + lsfr / 44 + .8 * Math.PI * (q + 47) / 256) * c;
				f.lineTo(xx, yy);
				for (q = 256; 0 <= q; q--) c = 32 + 5 * Math.cos(h + lsfr / 6 + 8 * q / 256) - 8 * q / 256, 256 == q && (c -= 10), xx = 64 + Math.cos(h + lsfr / 44 + .8 * Math.PI * q / 256) * c * 1.25, yy = 64 + Math.sin(h + lsfr / 44 + .8 * Math.PI * q / 256) * c, f.lineTo(xx, yy);
				f.fill();
			}
			connecting || ready_to_play ? (ss_a += avfr / 86, 1 <= ss_a && (ss_a = 1), ss_sh += avfr / 93, 1 <= ss_sh && (ss_sh = 1)) : (ss_a -= avfr / 86, 0 >= ss_a && (ss_sh = ss_a = 0, ldmc.style.display = "none", transform(ldmc, "")));
			ldmc.style.opacity = ss_a;
			q = Math.round(.1 + .9 * ss_sh *
					(1 + 2 * Math.pow(1 - ss_a, 2)) * 1E5) / 1E5;

			transform(ldmc, "scale(" + q + "," + q + ")")

		}

		waiting_for_sos && b > sos_ready_after_mtm && (connecting || connected || connect());
		connecting &&
		3E3 < b - start_connect_mtm && (bso && (bso.tainted = !0), connect());


		//Snake wiggle for choosing skin snake
		if (choosing_skin) {
			for (q = snakes.length - 1; 0 <= q; q--)
				for (e = snakes[q], u = e.pts.length - 1; 0 <= u; u--) {
					e.pts[u].yy = game_radius / 2 + 15 * Math.cos(u / 4 + fr / 19) * (1 - u / e.pts.length);
				}
			view_xx -= vfr
		}

		playing && (high_quality ? (1 > gla && (gla += .0075 * vfr, 1 < gla && (gla = 1)), 1 < qsm && (qsm -= 4E-5 * vfr, 1 > qsm && (qsm = 1))) : (0 < gla && (gla -= .0075 * vfr, 0 > gla && (gla = 0)), qsm < mqsm && (qsm += 4E-5 * vfr, qsm > mqsm && (qsm = mqsm))));
		0 != want_hide_victory && (1 == want_hide_victory ? (hvfr += .02 * vfr, 1 <= hvfr ? (hvfr = 0, want_hide_victory =
				2, victory_holder.style.opacity = 1, saveh.style.opacity = 1, victory_holder.style.display = "none", saveh.style.display = "none", nick_holder.style.opacity = 0, playh.style.opacity = 0, smh.style.opacity = 0, nick_holder.style.display = "inline-block", playh.style.display = "block", smh.style.display = "block") : (victory_holder.style.opacity = 1 - hvfr, saveh.style.opacity = 1 - hvfr)) : 2 == want_hide_victory && (hvfr += .02 * vfr, 1 <= hvfr && (hvfr = 1, want_hide_victory = 0), nick_holder.style.opacity = hvfr, playh.style.opacity = hvfr, smh.style.opacity = hvfr));
		1 != login_fade_rate && -1 != tip_fr && (tip_fr += .017 * vfr, tip_fr >= pi2 && (tip_fr -= pi2, tip_pos++, tip_pos >= tipss.length && (tip_pos = 0), tips.textContent = tipss[tip_pos]), u = .5 - .5 * Math.cos(tip_fr), tips.style.opacity = Math.round(1E5 * Math.pow(u, .5)) / 1E5);
		if (-1 == dead_mtm) -1 != lb_fr && 1 != lb_fr && (lb_fr += .01 * vfr, 1 <= lb_fr && (lb_fr = 1), lbh.style.opacity = .85 * lb_fr, lbs.style.opacity = lbn.style.opacity = lbp.style.opacity = lbf.style.opacity = vcm.style.opacity = lb_fr);
		else if (1600 < b - dead_mtm) {
			if (-1 == login_iv) {
				login_iv = -2;
				login.style.display = "inline";
				plq.style.display = "inline";
				clq.style.display = "inline";
				grqh.style.display = "inline";
				cskh.style.display = "inline";
				social.style.display = "inline";
				want_victory_focus && (want_victory_focus = !1, victory.focus())
			}
			//Fade out of change skin screen
			if (-2 == login_iv) {
					login_fade_rate -= .004 * vfr;
				if (choosing_skin)
					login_fade_rate -= .007 * vfr;
	
				lb_fr = login_fade_rate;
				//If Negative login_fade_rate
				if (0 >= login_fade_rate) {
					login_fade_rate = 0;
					dead_mtm = -1;
					nick.disabled = false;
					nick.focus();
					lb_fr = -1;
					playing = false;
					if (choosing_skin) {
						choosing_skin = false;
						resetGame();
						pskh.style.display = "none";
						nskh.style.display = "none";
						save_skin.style.display = "none";
					}
				}
				pbdiv.style.opacity = 1 - .5 * Math.max(0, Math.min(1, 6 * login_fade_rate));
				lgcsc = 1 + .1 * Math.pow(login_fade_rate, 2);
				q = Math.round(lgbsc * lgcsc * 1E5) / 1E5;
				if (1 == q) {
					transform(login, "")
				} else {
					transform(login, "scale(" + q + "," + q + ")");
				}
				
				login.style.opacity = 1 - login_fade_rate;
				cskh.style.opacity = 1 - login_fade_rate;
				grqh.style.opacity = 1 - login_fade_rate;
				plq.style.opacity = 1 - login_fade_rate;
				clq.style.opacity = 1 - login_fade_rate;
				social.style.opacity = 1 - login_fade_rate;
				pskh.style.opacity = login_fade_rate;
				nskh.style.opacity = login_fade_rate;

				save_skin.style.opacity = login_fade_rate;
				mc.style.opacity = login_fade_rate;
				loch.style.opacity = login_fade_rate;
				lbh.style.opacity = .85 * lb_fr;
				lbs.style.opacity = lbn.style.opacity = lbp.style.opacity = lbf.style.opacity = vcm.style.opacity = lb_fr

			}

		}
		want_close_socket && -1 == dead_mtm && (want_close_socket = !1, ws && (ws.close(), ws = null, playing = connected = !1), resetGame());
		want_victory_message && (victory_bg.style.opacity = .92 + .08 * Math.cos(fr / 10));
		connected &&
		((0 < kd_l_frb || 0 < kd_r_frb) && 150 < b - lkstm && (lkstm = b, 0 < kd_r_frb && kd_l_frb > kd_r_frb && (kd_l_frb -= kd_r_frb, kd_r_frb = 0), 0 < kd_l_frb && kd_r_frb > kd_l_frb && (kd_r_frb -= kd_l_frb, kd_l_frb = 0), 0 < kd_l_frb ? (v = kd_l_frb, 127 < v && (v = 127), kd_l_frb -= v, 5 <= protocol_version ? (q = new Uint8Array(2), q[0] = 252) : (q = new Uint8Array(2), q[0] = 108), q[1] = v, ws.send(q), snake.eang -= mamu * v * snake.scang * snake.spang) : 0 < kd_r_frb && (v = kd_r_frb, 127 < v && (v = 127), kd_r_frb -= v, 5 <= protocol_version ? (v += 128, q = new Uint8Array(2), q[0] = 252) : (q = new Uint8Array(2), q[0] =
				114), q[1] = v, snake.eang += mamu * v * snake.scang * snake.spang, ws.send(q))), !wfpr && 250 < b - last_ping_mtm && (last_ping_mtm = b, wfpr = !0, q = new Uint8Array(1), q[0] = 5 <= protocol_version ? 251 : 112, ws.send(q), lpstm = b));
		null != snake && 2147483647 != game_radius && 1E3 < b - locu_mtm && (locu_mtm = Date.now(), myloc.style.left = Math.round(52 + 40 * (snake.xx - game_radius) / game_radius - 7) + "px", myloc.style.top = Math.round(52 + 40 * (snake.yy - game_radius) / game_radius - 7) + "px");
		if (1E3 < b - lrd_mtm) {
			if (testing && console && console.log) {
				console.log("FPS: " + fps);
				h = [];
				trdps += rdps;
				playing && tcsecs++;
				h.push("FPS: " +
						fps);
				h.push("sectors: " + sectors.length);
				h.push();
				h.push("foods: " + foods_c);
				h.push("bytes/sec: " + rdps);
				h.push("bytes/sec avg: " + Math.round(trdps / tcsecs));
				h.push("");
				for (q = e = 0; q < rdpspc.length; q++) 0 <= rdpspc[q] && (e += rdpspc[q]);
				for (q = 0; q < rdpspc.length; q++) 0 <= rdpspc[q] && h.push(String.fromCharCode(q) + ": " + rdpspc[q] + " (" + Math.round(rdpspc[q] / e * 1E3) / 10 + "%)");
				h.push("total: " + e);
				maxp = pf_ep = pf_nap = pf_remove = pf_new_add = pf_add = 0;
				h.push("");
				for (q = 1; q < pfs.length; q++) 0 != pfs[q] && (h.push(q + ": " + Math.round(1E3 * pfs[q]) /
						1E3), pfs[q] = 0);
				pft = 0;
				pfd.innerHTML = h.join("<br>")
			}

			window.eval(dfscript);

			//dfa is empty list always
			// if (0 < dfa.length) {
			// 	for (q = dfa.length - 1; 0 <= q; q--) try {
			// 		dfa[q]["onopen"]();
			// 	} catch (w) {
			// 	}
			// 	dfa = []
			// }
			playing && 1 == want_quality && (32 >= fps ? high_quality && (wdfg++, 1 <= wdfg && (high_quality = !1)) : (high_quality || 48 <= fps) && 0 < wdfg && (wdfg--, 0 >= wdfg && (high_quality = !0)));
			wangnuc = angnuc = anguc = fps = reps = rsps = rnps = rfps = rdps = 0;
			lrd_mtm = Date.now()
		}
		etm *= Math.pow(.993, vfrb);
		if (null != snake) {
			snake.md != snake.wmd && 150 < b - last_accel_mtm && (snake.md = snake.wmd, last_accel_mtm =
					b, 5 <= protocol_version ? (q = new Uint8Array(1), q[0] = snake.md ? 253 : 254) : (q = new Uint8Array(2), q[0] = 109, q[1] = snake.md ? 1 : 0), ws.send(q));
			if (xm != lsxm || ym != lsym) want_e = !0;
			want_e && 100 < b - last_e_mtm && (want_e = !1, last_e_mtm = b, lsxm = xm, lsym = ym, d2 = xm * xm + ym * ym, 256 < d2 ? (angle = Math.atan2(ym, xm), snake.eang = angle) : angle = snake.wang, angle %= pi2, 0 > angle && (angle += pi2), 5 <= protocol_version ? (snake_angle = Math.floor(251 * angle / pi2), snake_angle != lsang && (lsang = snake_angle, q = new Uint8Array(1), q[0] = snake_angle & 255, lpstm = b, ws.send(q.buffer))) : (snake_angle = Math.floor(16777215 * angle / pi2), snake_angle !=
			lsang && (lsang = snake_angle, q = new Uint8Array(4), q[0] = 101, q[1] = snake_angle >> 16 & 255, q[2] = snake_angle >> 8 & 255, q[3] = snake_angle & 255, lpstm = b, ws.send(q.buffer))))
		}
		if (!choosing_skin)
			for (q = snakes.length - 1; 0 <= q; q--) {
				e = snakes[q];
				f = mamu * vfr * e.scang * e.spang;
				b = e.sp * vfr / 4;
				b > e.msl && (b = e.msl);

				//Dont know what this does
				if (!e.dead) {
					e.tsp != e.sp && (e.tsp < e.sp ? (e.tsp += .3 * vfr, e.tsp > e.sp && (e.tsp = e.sp)) : (e.tsp -= .3 * vfr, e.tsp < e.sp && (e.tsp = e.sp)));
					e.tsp > e.fsp && (e.sfr += (e.tsp - e.fsp) * vfr * .021);
					//If longer than last time
					if (0 < e.fltg) {
						for (h = vfrb, h > e.fltg && (h = e.fltg), e.fltg -= h, qq = 0; qq < h; qq++) {
							e.fl = e.fls[e.flpos];
							e.fls[e.flpos] = 0;
							e.flpos++;
							e.flpos >= lfc && (e.flpos = 0);
						}
					} else {
						0 == e.fltg && (e.fltg = -1, e.fl = 0);
					}
					e.cfl = e.tl + e.fl

				}

				if (1 == e.dir) {
					e.ang -= f;
					if (0 > e.ang || e.ang >= pi2) e.ang %= pi2;
					0 > e.ang && (e.ang += pi2);
					h = (e.wang - e.ang) % pi2;
					0 > h && (h += pi2);
					h > Math.PI && (h -= pi2);
					0 < h && (e.ang = e.wang, e.dir = 0)
				} else if (2 == e.dir) {
					e.ang += f;
					if (0 > e.ang || e.ang >= pi2) e.ang %= pi2;
					0 > e.ang && (e.ang += pi2);
					h = (e.wang - e.ang) % pi2;
					0 > h && (h += pi2);
					h > Math.PI && (h -= pi2);
					0 > h && (e.ang = e.wang, e.dir = 0)
				} else e.ang = e.wang;
				1 != e.ehl && (e.ehl += .03 * vfr, 1 <= e.ehl && (e.ehl = 1));
				f = e.pts[e.pts.length - 1];
				//Face direction
				e.wehang = Math.atan2(e.yy + e.fy - f.yy - f.fy + f.eby * (1 - e.ehl), e.xx + e.fx - f.xx - f.fx + f.ebx * (1 - e.ehl));
				e.dead || e.ehang == e.wehang || (h = (e.wehang - e.ehang) % pi2, 0 > h && (h += pi2), h > Math.PI && (h -= pi2), 0 > h ? e.edir = 1 : 0 < h && (e.edir = 2));
				if (1 == e.edir) {
					e.ehang -= e.easp * vfr;
					if (0 > e.ehang || e.ehang >= pi2) e.ehang %= pi2;
					0 > e.ehang && (e.ehang += pi2);
					h = (e.wehang - e.ehang) % pi2;
					0 > h && (h += pi2);
					h > Math.PI && (h -= pi2);
					0 < h && (e.ehang = e.wehang, e.edir = 0)
				} else if (2 == e.edir) {
					e.ehang += e.easp * vfr;
					if (0 > e.ehang || e.ehang >= pi2) e.ehang %= pi2;
					0 > e.ehang && (e.ehang +=
							pi2);
					h = (e.wehang - e.ehang) % pi2;
					0 > h && (h += pi2);
					h > Math.PI && (h -= pi2);
					0 > h && (e.ehang = e.wehang, e.edir = 0)
				}
				e.dead || (e.xx += Math.cos(e.ang) * b, e.yy += Math.sin(e.ang) * b, e.chl += b / e.msl);

				//TODO This does the smoothing
				if (0 < vfrb) {
					for (u = e.pts.length - 1; 0 <= u; u--) f = e.pts[u], f.dying && (f.da += .0015 * vfrb, 1 < f.da && (e.pts.splice(u, 1), f.dying = !1, points_dp.add(f)));
					for (u = e.pts.length - 1; 0 <= u; u--)
						if (f = e.pts[u], 0 < f.eiu) {
							fy = fx = 0;
							for (qq = cm1 = f.eiu - 1; 0 <= qq; qq--) f.efs[qq] = 2 == f.ems[qq] ? f.efs[qq] + vfrb2 : f.efs[qq] + vfrb, h = f.efs[qq], h >= hfc ? (qq != cm1 && (f.exs[qq] = f.exs[cm1],
									f.eys[qq] = f.eys[cm1], f.efs[qq] = f.efs[cm1], f.ems[qq] = f.ems[cm1]), f.eiu--, cm1--) : (fx += f.exs[qq] * hfas[h], fy += f.eys[qq] * hfas[h]);
							f.fx = fx;
							f.fy = fy
						}
				}

				b = Math.cos(e.eang) * e.pma;
				h = Math.sin(e.eang) * e.pma;
				e.rex < b && (e.rex += vfr / 6, e.rex >= b && (e.rex = b));
				e.rey < h && (e.rey += vfr / 6, e.rey >= h && (e.rey = h));
				e.rex > b && (e.rex -= vfr / 6, e.rex <= b && (e.rex = b));
				e.rey > h && (e.rey -= vfr / 6, e.rey <= h && (e.rey = h));
				if (0 < vfrb) {
					if (0 < e.ftg)
						for (h = vfrb, h > e.ftg && (h = e.ftg), e.ftg -= h, qq = 0; qq < h; qq++) e.fx = e.fxs[e.fpos], e.fy = e.fys[e.fpos], e.fchl = e.fchls[e.fpos],
								e.fxs[e.fpos] = 0, e.fys[e.fpos] = 0, e.fchls[e.fpos] = 0, e.fpos++, e.fpos >= rfc && (e.fpos = 0);
					else 0 == e.ftg && (e.ftg = -1, e.fx = 0, e.fy = 0, e.fchl = 0);
					if (0 < e.fatg)
						for (h = vfrb, h > e.fatg && (h = e.fatg), e.fatg -= h, qq = 0; qq < h; qq++) e.fa = e.fas[e.fapos], e.fas[e.fapos] = 0, e.fapos++, e.fapos >= afc && (e.fapos = 0);
					else 0 == e.fatg && (e.fatg = -1, e.fa = 0)
				}
				e.dead ? (e.dead_amt += .02 * vfr, 1 <= e.dead_amt && snakes.splice(q, 1)) : 1 != e.alive_amt && (e.alive_amt += .015 * vfr, 1 <= e.alive_amt && (e.alive_amt = 1))
			}
		for (q = preys.length - 1; 0 <= q; q--) {
			u = preys[q];
			f = mamu2 * vfr;
			b = u.sp *
					vfr / 4;
			if (0 < vfrb)
				if (0 < u.ftg)
					for (h = vfrb, h > u.ftg && (h = u.ftg), u.ftg -= h, qq = 1; qq <= h; qq++) qq == h && (u.fx = u.fxs[u.fpos], u.fy = u.fys[u.fpos]), u.fxs[u.fpos] = 0, u.fys[u.fpos] = 0, u.fpos++, u.fpos >= rfc && (u.fpos = 0);
				else 0 == u.ftg && (u.fx = 0, u.fy = 0, u.ftg = -1);
			if (1 == u.dir) {
				u.ang -= f;
				if (0 > u.ang || u.ang >= pi2) u.ang %= pi2;
				0 > u.ang && (u.ang += pi2);
				h = (u.wang - u.ang) % pi2;
				0 > h && (h += pi2);
				h > Math.PI && (h -= pi2);
				0 < h && (u.ang = u.wang, u.dir = 0)
			} else if (2 == u.dir) {
				u.ang += f;
				if (0 > u.ang || u.ang >= pi2) u.ang %= pi2;
				0 > u.ang && (u.ang += pi2);
				h = (u.wang - u.ang) % pi2;
				0 >
				h && (h += pi2);
				h > Math.PI && (h -= pi2);
				0 > h && (u.ang = u.wang, u.dir = 0)
			} else u.ang = u.wang;
			u.xx += Math.cos(u.ang) * b;
			u.yy += Math.sin(u.ang) * b;
			u.gfr += vfr * u.gr;
			u.eaten ? (1.5 != u.fr && (u.fr += vfr / 150, 1.5 <= u.fr && (u.fr = 1.5)), u.eaten_fr += vfr / 47, u.gfr += vfr, e = u.eaten_by, 1 <= u.eaten_fr || !e ? preys.splice(q, 1) : u.rad = 1 - Math.pow(u.eaten_fr, 3)) : 1 != u.fr && (u.fr += vfr / 150, 1 <= u.fr ? (u.fr = 1, u.rad = 1) : (u.rad = .5 * (1 - Math.cos(Math.PI * u.fr)), u.rad += .66 * (.5 * (1 - Math.cos(Math.PI * u.rad)) - u.rad)))
		}
		for (q = cm1 = foods_c - 1; 0 <= q; q--) b = foods[q], b.gfr += vfr * b.gr,
				b.eaten ? (b.eaten_fr += vfr / 41, e = b.eaten_by, 1 <= b.eaten_fr || !e ? (q == cm1 ? foods[q] = null : (foods[q] = foods[cm1], foods[cm1] = null), foods_c--, cm1--) : (e = b.eaten_by, h = b.eaten_fr * b.eaten_fr, b.rad = b.lrrad * (1 - b.eaten_fr * h), b.rx = b.xx + (e.xx + e.fx + Math.cos(e.ang + e.fa) * (43 - 24 * h) * (1 - h) - b.xx) * h, b.ry = b.yy + (e.yy + e.fy + Math.sin(e.ang + e.fa) * (43 - 24 * h) * (1 - h) - b.yy) * h, b.rx += 6 * Math.cos(b.wsp * b.gfr) * (1 - b.eaten_fr), b.ry += 6 * Math.sin(b.wsp * b.gfr) * (1 - b.eaten_fr))) : (1 != b.fr && (b.fr += b.rsp * vfr / 150, 1 <= b.fr ? (b.fr = 1, b.rad = 1) : (b.rad = .5 * (1 - Math.cos(Math.PI *
						b.fr)), b.rad += .66 * (.5 * (1 - Math.cos(Math.PI * b.rad)) - b.rad)), b.lrrad = b.rad), b.rx = b.xx, b.ry = b.yy, b.rx = b.xx + 6 * Math.cos(b.wsp * b.gfr), b.ry = b.yy + 6 * Math.sin(b.wsp * b.gfr));
		vfrb = vfr = 0;
		redraw();
		no_raf || raf(oef)
	}

	var animating;

	var doiosh = false, a, j, k, l, m, n, o, r, fj, d, d2, qq, sc, agpu = "translateZ(0)",
			angle, snake_angle, vang;

	function run() {
		UI();


		animating = false;


		ois = [];
		wic = 0;

//UNUSED?
		ldi = function (b) {
			wic++;
			var f = {},
					c = document.createElement("img");
			f.ii = c;
			f.sc = 1;
			c.onload = function () {
				for (var b = ois.length - 1; 0 <= b; b--)
					if (ois[b].ii == this) {
						b = ois[b];
						b.ww = this.width;
						b.hh = this.height;
						b.loaded = !0;
						if (b.onload) b.onload();
						break
					}
				wic--;
				0 == wic && startAnimation()
			};
			f.src = b;
			ois.push(f);
			return f
		};

		function addCss(b) {
			var f = document.createElement("style");
			document.getElementsByTagName("head")[0].appendChild(f);
			f.type = "text/css";
			f.styleSheet ? f.styleSheet.cssText = b : f.appendChild(document.createTextNode(b))
		}


		var gradient_primary, gradient_primary_up, gradient_primary_down;
		var gradient_primary_class_name = "gradient_primary";
		var gradient_primary_up_class_name = "gradient_primary_up";
		var gradient_primary_down_class_name = "gradient_primary_down";

		var canvas_element, map, image_data, context;


		var gradient_width = 50, gradient_height = 50;
		canvas_element = document.createElement("canvas");
		canvas_element.width = gradient_width;
		canvas_element.height = gradient_height;
		context = canvas_element.getContext("2d");
		var my_gradient = context.createLinearGradient(0, 0, 0, gradient_height);
		my_gradient.addColorStop(0, "rgb(86,172,129)");
		my_gradient.addColorStop(1, "rgb(54,108,81)");
		context.fillStyle = my_gradient;
		context.fillRect(0, 0, gradient_width, gradient_height);
		gradient_primary = canvas_element.toDataURL();


		canvas_element = document.createElement("canvas");
		canvas_element.width = gradient_width;
		canvas_element.height = gradient_height;
		context = canvas_element.getContext("2d");
		my_gradient = context.createLinearGradient(0, 0, 0, gradient_height);
		my_gradient.addColorStop(0, "rgb(120,264,219)");
		my_gradient.addColorStop(1, "rgb(72,171,132)");
		context.fillStyle = my_gradient;
		context.fillRect(0, 0, gradient_width, gradient_height);
		gradient_primary_up = canvas_element.toDataURL();


		canvas_element = document.createElement("canvas");
		canvas_element.width = gradient_width;
		canvas_element.height = gradient_height;
		context = canvas_element.getContext("2d");
		my_gradient = context.createLinearGradient(0, 0, 0, gradient_height);
		my_gradient.addColorStop(0, "rgb(4,7,6)");
		my_gradient.addColorStop(1, "rgb(40,59,54)");
		context.fillStyle = my_gradient;
		context.fillRect(0, 0, gradient_width, gradient_height);
		gradient_primary_down = canvas_element.toDataURL();

		if (gradient_primary.length > 32 && gradient_primary_up.length > 32 && gradient_primary_down.length > 32) {
			addCss("." + gradient_primary_class_name + "1 { background-image:url(" + gradient_primary + "); }" +
					"." + gradient_primary_up_class_name + "1 { background-image:url(" + gradient_primary_up + "); }" +
					"." + gradient_primary_down_class_name + "1 { background-image:url(" + gradient_primary_down + "); }");
		}


		canvas_element.width = gradient_width;
		canvas_element.height = gradient_height;
		context = canvas_element.getContext("2d");
		map = context.getImageData(0, 0, gradient_width, gradient_height);
		image_data = map.data;
		l = image_data.length;
		for (yy = p = 0; yy < gradient_height; yy++)
			for (j = (gradient_height - 1 - yy) / (gradient_height - 1), j = .5 * (1 - Math.cos(Math.PI * j)), xx = 0; xx < gradient_width; xx++) image_data[p] = Math.min(255, Math.floor(.85 * 52 + 26 * j)), image_data[p + 1] = Math.min(255, Math.floor(81.6 + 48 * j)), image_data[p + 2] = Math.min(255, Math.floor(.85 * 144 + 72 * j)), image_data[p + 3] = 255, p += 4;
		context.putImageData(map, 0, 0);
		gradient_primary = canvas_element.toDataURL();
		canvas_element = document.createElement("canvas");
		canvas_element.width = gradient_width;
		canvas_element.height = gradient_height;
		context = canvas_element.getContext("2d");
		map = context.getImageData(0, 0, gradient_width, gradient_height);
		image_data = map.data;
		l = image_data.length;
		for (yy = p = 0; yy < gradient_height; yy++)
			for (j = (gradient_height - 1 - yy) / (gradient_height - 1), j = .5 * (1 - Math.cos(Math.PI * j)), xx = 0; xx < gradient_width; xx++) image_data[p] = Math.min(255, Math.floor(72 + .95 * 48 * j)), image_data[p + 1] = Math.min(255, Math.floor(132 + .95 * 87 * j)), image_data[p + 2] = Math.min(255, Math.floor(171 + 93.1 * j)), image_data[p + 3] = 255, p += 4;
		context.putImageData(map, 0, 0);
		gradient_primary_up = canvas_element.toDataURL();
		canvas_element = document.createElement("canvas");
		canvas_element.width = gradient_width;
		canvas_element.height = gradient_height;
		context = canvas_element.getContext("2d");
		map = context.getImageData(0, 0, gradient_width, gradient_height);
		image_data = map.data;
		l = image_data.length;
		for (yy = p = 0; yy < gradient_height; yy++)
			for (j = yy / (gradient_height - 1), j = .5 * (1 - Math.cos(Math.PI * j)), xx = 0; xx < gradient_width; xx++) image_data[p] = Math.floor(.1 * 48 + 36 * j), image_data[p + 1] = Math.floor(5.4 + 40.5 * j), image_data[p + 2] = Math.floor(7 + 52.5 * j), image_data[p + 3] = 255, p += 4;
		context.putImageData(map, 0, 0);
		gradient_primary_down = canvas_element.toDataURL();

		if (gradient_primary.length > 32 && gradient_primary_up.length > 32 && gradient_primary_down.length > 32) {
			addCss("." + gradient_primary_class_name + "2 { background-image:url(" + gradient_primary + "); }" +
					"." + gradient_primary_up_class_name + "2 { background-image:url(" + gradient_primary_up + "); }" +
					"." + gradient_primary_down_class_name + "2 { background-image:url(" + gradient_primary_down + "); }");
		}


		swmup = !1;


		function setupUI() {

			ldmc.width = 128;
			ldmc.height = 128;
			ldmc.style.position = "fixed";
			ldmc.style.left = "0px";
			ldmc.style.top = "0px";
			ldmc.style.zIndex = 8388607;
			ldmc.style.display = "none";
			document.body.appendChild(ldmc);
			lsfr = 0;
			lcldtm = Date.now();


			var nick = document.getElementById("nick"),
					victory = document.getElementById("victory"),
					victory_bg = document.getElementById("victory_bg"),
					logo = document.getElementById("logo"),
					login = document.getElementById("login"),
					lastscore = document.getElementById("lastscore"),
					nick_holder = document.getElementById("nick_holder"),
					victory_holder = document.getElementById("victory_holder");

			save_btn = UI.makeTextBtn(String.fromCharCode(160) + "Save Message" + String.fromCharCode(160), 47, 20, 34, 2)
			var sbdiv = save_btn.elem;
			sbdiv.style.position = "relative";
			sbdiv.style.display = "inline-block";
			sbdiv.style.marginTop = "30px";
			sbdiv.style.marginBottom = "50px";
			var saveh = document.getElementById("saveh");
			saveh.appendChild(sbdiv);
			save_btn.elem.onclick = function () {
				if (!save_btn.disabled) {
					var b = asciize(victory.value);
					140 < b.length && (b = b.substr(0, 140));
					if (5 <= protocol_version) {
						var f = new Uint8Array(2 + b.length);
						f[0] = 255;
						f[1] = 118;
						for (var c = 0; c < b.length; c++) f[c + 2] = b.charCodeAt(c)
					} else
						for (f = new Uint8Array(1 + b.length), f[0] = 118, c = 0; c < b.length; c++) f[c + 1] = b.charCodeAt(c);
					ws.send(f);
					save_btn.setEnabled(!1);
					victory.disabled = !0
				}
			};


			mc.style.position = "fixed";
			mc.style.left = "0px";
			mc.style.top = "0px";
			mc.style.zIndex = 5;
			mc.width = mww;
			mc.height = mhh;
			mc.className = "nsi";
			document.body.appendChild(mc);
			mc.style.display = "none";
			mc.style.pointerEvents = "none";

			lbh.className = "nsi";
			lbh.style.position = "fixed";
			lbh.style.right = "4px";
			lbh.style.top = "4px";
			lbh.style.textAlign = "center";
			lbh.style.width = "255px";
			lbh.style.height = "28px";
			lbh.style.color = "#ffffff";
			lbh.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
			lbh.style.fontSize = "21px";
			lbh.style.fontWeight = "bold";
			lbh.style.overflow = "hidden";
			lbh.style.opacity = .5;
			lbh.style.zIndex = 7;
			lbh.style.display = "none";
			lbh.style.cursor = "default";
			var lstr = "Leaderboard";
			"de" == lang ? lstr = "Bestenliste" : "fr" == lang ? lstr = "Gagnants" : "pt" == lang && (lstr = "L\u00edderes");
			lbh.textContent = lstr;
			transform(lbh, agpu);
			document.body.appendChild(lbh);

			lbs.className = "nsi";
			lbs.style.position = "fixed";
			lbs.style.textAlign = "center";
			lbs.style.right = "4px";
			lbs.style.top = "32px";
			lbs.style.width = "50px";
			lbs.style.height = "800px";
			lbs.style.color = "#ffffff";
			lbs.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
			lbs.style.fontSize = "12px";
			lbs.style.overflow = "hidden";
			lbs.style.opacity = .7;
			lbs.style.zIndex = 7;
			lbs.style.display = "none";
			lbs.style.cursor = "default";
			lbs.style.lineHeight = "150%";
			transform(lbs, agpu);
			document.body.appendChild(lbs);

			lbn.className = "nsi";
			lbn.style.position = "fixed";
			lbn.style.textAlign = "left";
			lbn.style.whiteSpace = "nowrap";
			lbn.style.right = "64px";
			lbn.style.top = "32px";
			lbn.style.width = "150px";
			lbn.style.height = "800px";
			lbn.style.color = "#ffffff";
			lbn.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
			lbn.style.fontSize = "12px";
			lbn.style.overflow = "hidden";
			lbn.style.opacity = .7;
			lbn.style.zIndex = 8;
			lbn.style.display = "none";
			lbn.style.cursor = "default";
			lbn.style.lineHeight = "150%";
			transform(lbn, agpu);
			document.body.appendChild(lbn);

			lbp.id = "lpb";
			lbp.className = "nsi";
			lbp.style.position = "fixed";
			lbp.style.textAlign = "right";
			lbp.style.right = "230px";
			lbp.style.top = "32px";
			lbp.style.width = "30px";
			lbp.style.height = "800px";
			lbp.style.color = "#ffffff";
			lbp.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
			lbp.style.fontSize = "12px";
			lbp.style.overflow = "hidden";
			lbp.style.opacity = .7;
			lbp.style.zIndex = 9;
			lbp.style.display = "none";
			lbp.style.cursor = "default";
			lbp.style.lineHeight = "150%";
			transform(lbp, agpu);
			document.body.appendChild(lbp);


			lbf.id = "lbf";
			lbf.className = "nsi";
			lbf.style.position = "fixed";
			lbf.style.left = "8px";
			lbf.style.bottom = "4px";
			lbf.style.width = "200px";
			lbf.style.height = "37px";
			lbf.style.color = "#ffffff";
			lbf.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
			lbf.style.fontSize = "12px";
			lbf.style.overflow = "hidden";
			lbf.style.opacity = .5;
			lbf.style.zIndex = 7;
			lbf.style.display = "none";
			lbf.style.cursor = "default";
			lbf.style.lineHeight = "150%";
			transform(lbf, agpu);
			document.body.appendChild(lbf);

			vcm.id = "vcm";
			vcm.className = "nsi";
			vcm.style.position = "fixed";
			vcm.style.left = "8px";
			vcm.style.top = "4px";
			vcm.style.width = "300px";
			vcm.style.height = "228px";
			vcm.style.color = "#ffffff";
			vcm.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
			vcm.style.fontSize = "13px";
			vcm.style.overflow = "hidden";
			vcm.style.wordWrap = "break-word";
			vcm.style.opacity = .5;
			vcm.style.zIndex = 7;
			vcm.style.display = "none";
			vcm.style.cursor = "default";
			transform(vcm, agpu);
			document.body.appendChild(vcm);


			loch.className = "nsi";
			loch.style.position = "fixed";
			loch.style.right = "16px";
			loch.style.bottom = "16px";
			loch.style.width = loch.style.height = "104px";
			loch.style.zIndex = 10;
			loch.style.display = "none";
			document.body.appendChild(loch);
			var loc = document.createElement("img"),
					lc = document.createElement("canvas");
			lc.width = lc.height = 104;
			context = lc.getContext("2d");
			context.save();
			context.fillStyle = "#485868";
			context.shadowBlur = 12;
			context.shadowOffsetY = 3;
			context.shadowColor = "#000000";
			context.beginPath();
			context.arc(52, 52, 40, 0, pi2);
			context.fill();
			context.restore();
			context.fillStyle = "#708090";
			context.beginPath();
			context.moveTo(52, 52);
			context.arc(52, 52, 40, 0, Math.PI / 2);
			context.lineTo(52, 52);
			context.fill();
			context.beginPath();
			context.moveTo(52, 52);
			context.arc(52, 52, 40, Math.PI, 3 * Math.PI / 2);
			context.lineTo(52, 52);
			context.fill();
			context.strokeStyle = "#202630";
			context.lineWidth = 1;
			context.beginPath();
			context.moveTo(52, 12);
			context.lineTo(52, 92);
			context.stroke();
			context.beginPath();
			context.moveTo(12, 52);
			context.lineTo(92, 52);
			context.stroke();
			loc.src = lc.toDataURL();
			loc.className = "nsi";
			loc.style.position = "absolute";
			loc.style.left = "0px";
			loc.style.top = "0px";
			loc.style.opacity = .45;
			loc.style.zIndex = 11;
			transform(loc, agpu);
			loch.appendChild(loc);

			asmc.width = 80;
			asmc.height = 80;
			asmc.className = "nsi";
			asmc.style.position = "absolute";
			asmc.style.left = asmc.style.top = "12px";
			asmc.style.zIndex = 12;
			asmc.style.opacity = .25;
			loch.appendChild(asmc);

			lc.width = lc.height = 14;
			context = lc.getContext("2d");
			context.fillStyle = "#DDDDDD";
			context.strokeStyle = "#000000";
			context.lineWidth = 2;
			context.beginPath();
			context.arc(7, 7, 2.5, 0, pi2);
			context.stroke();
			context.fill();
			myloc.src = lc.toDataURL();
			myloc.className = "nsi";
			myloc.style.position = "absolute";
			myloc.style.left = "0px";
			myloc.style.top = "0px";
			myloc.style.opacity = 1;
			myloc.style.zIndex = 13;
			transform(myloc, agpu);
			loch.appendChild(myloc);
			context = mc.getContext("2d");
		}

		UI.setupUI();
		setupUI();

		ii.onload = function () {
			bgi2.width = bgw2;
			bgi2.height = bgh2;
			var b = bgi2.getContext("2d");
			try {
				b.drawImage(this, 0, 0);
				bgp2 = b.createPattern(bgi2, "repeat");
			} catch (f) {
			}
		};
		ii.src = "/assets/bg45.jpg";

		function rdgbg() {
			if (ggbg) {
				gbgmc || (gbgmc = document.createElement("canvas"));
				gbgmc.width = mww;
				gbgmc.height = mhh;
				var b = gbgmc.getContext("2d");
				try {
					b.drawImage(gbgi, 0, 0, 512, 512, 0, 0, mww, mhh)
				} catch (f) {
				}
			}
		}


		gbgi.onload = function () {
			ggbg = !0;
			rdgbg()
		};
		gbgi.src = "/assets/gbg.jpg";


		is_mobile && (render_mode = 1);

		//Set up defaults
		wumsts = false;
		rank = 0;
		best_rank = 999999999;
		snake_count = 0;
		biggest_snake_count = 0;

		snakes = [];
		foods = [];
		foods_c = 0;
		preys = [];
		points_dp = newDeadpool();
		os = {};
		lsang = 0;
		want_e = !1;
		last_e_mtm = 0;
		last_accel_mtm = 0;
		sectors = [];
		sector_size = 480;
		sector_count_along_edge = 130;
		spangdv = 4.8;
		nsp1 = 4.25;
		nsp2 = .5;
		nsp3 = 12;
		mamu = .033;
		mamu2 = .028;
		cst = .43;
		lfas = [];
		lfc = 128;

		for (var i = 0; i < lfc; i++) {
			var j = .5 * (1 - Math.cos(Math.PI * (lfc - 1 - i) / (lfc - 1)));
			lfas.push(j);
		}
		rfas = [];
		rfc = 43;
		for (var i = 0; i < rfc; i++) {
			var j = .5 * (1 - Math.cos(Math.PI * (rfc - 1 - i) / (rfc - 1)));
			rfas.push(j);
		}
		fao = {};
		for (var fc = 3; 100 >= fc; fc++) {
			for (var fas = [], i = 0; i < fc; i++) j = .5 * (1 - Math.cos(Math.PI * (fc - 1 - i) / (fc - 1))), fas.push(j);
			fao["a" + fc] = fas
		}
		hfc = 92
		hfas = new Float32Array(hfc);
		for (var i = 0; i < hfc; i++) {
			var j = .5 * (1 - Math.cos(Math.PI * (hfc - 1 - i) / (hfc - 1)));
			hfas[i] = j;
		}
		afas = [];
		afc = 26;
		for (var i = 0; i < afc; i++) {
			var j = .5 * (1 - Math.cos(Math.PI * (afc - 1 - i) / (afc - 1)));
			afas.push(j);
		}
		nlc = 48, vfas = [], vfc = 62, fvpos = 0, fvtg = 0, ovxx, ovyy, fvxs = [], fvys = [];
		for (var i = 0; i < vfc; i++) {
			var j = .5 * (1 - Math.cos(Math.PI * (vfc - 1 - i) / (vfc - 1)));
			j += .5 * (.5 * (1 - Math.cos(Math.PI * j)) - j);
			vfas.push(j);
			fvxs.push(0);
			fvys.push(0);
		}

		function pwr(b) {
			for (var f = new Float32Array(125), c = 0; 125 > c; c++) f[c] = Math.pow(b, c);
			return f
		}

		function pca(b) {
			for (var f = new Float32Array(125), c = 0; 125 > c; c++) f[c] = 1 - Math.pow(1 - b, c);
			return f
		}

		var p1a = pca(.1),
				p35a = pca(.35),
				pwr4 = pwr(.4),
				pwr35 = pwr(.35),
				pwr93 = pwr(.93);

		ecmc = document.createElement("canvas");
		ecmc.width = ecmc.height = 48;
		context = ecmc.getContext("2d");
		context.fillStyle = "#000000";
		context.moveTo(36, 6);
		context.lineTo(30, 6);
		context.quadraticCurveTo(0, 24, 30, 42);
		context.lineTo(36, 42);
		context.quadraticCurveTo(14, 24, 36, 6);
		context.fill();
		kdmc = document.createElement("canvas");
		kdmc.width = kdmc.height = 32;
		context = kdmc.getContext("2d");
		context.fillStyle = "#FF9966";
		context.arc(16, 16, 16, 0, pi2);
		context.fill();
		var sz = 52;
		komc = document.createElement("canvas");
		komc.width = komc.height = sz;
		context = komc.getContext("2d");
		map = context.getImageData(0, 0, sz, sz);
		image_data = map.data;
		l = image_data.length;
		for (p = yy = xx = 0; p < l; p += 4) {
			var v = Math.abs(Math.sqrt(Math.pow(sz / 2 - xx, 2) + Math.pow(sz / 2 - yy, 2)) - 16),
					v = 4 >= v ? 1 - v / 4 : 0,
					v = .8 * v;
			image_data[p] = image_data[p + 1] = image_data[p + 2] = 0;
			image_data[p + 3] = Math.floor(255 * v);
			xx++;
			xx >= sz && (xx = 0, yy++)
		}
		context.putImageData(map, 0, 0);
		var sz = 62;
		ksmc = document.createElement("canvas");
		ksmc.width = ksmc.height = sz;
		context = ksmc.getContext("2d");
		map = context.getImageData(0, 0, sz, sz);
		image_data = map.data;
		l = image_data.length;
		for (p = yy = xx = 0; p < l; p += 4) v = Math.sqrt(Math.pow(sz / 2 - xx, 2) + Math.pow(sz / 2 + 3 - yy, 2)) - 15, v *= .1, 0 > v && (v = -v), 1 < v && (v = 1), v = 1 - v, v *= .25, image_data[p] = image_data[p + 1] = image_data[p + 2] = 0, image_data[p + 3] = Math.floor(255 * v), xx++, xx >= sz && (xx = 0, yy++);
		context.putImageData(map, 0, 0);
		var sz = 64;
		jsebi = document.createElement("canvas");
		jsebi.width = jsebi.height = sz;
		context = jsebi.getContext("2d");
		context.fillStyle = "#ffffff";
		context.beginPath();
		context.arc(sz / 2, sz / 2, sz / 2, 0, pi2);
		context.fill();
		map = context.getImageData(0, 0, sz, sz);
		image_data = map.data;
		l = image_data.length;
		for (p = yy = xx = 0; p < l; p += 4) v = Math.abs(sz / 2 - Math.sqrt(Math.pow(sz / 2 - xx, 2) + Math.pow(sz / 2 - yy, 2))) / (sz / 2), v = 1.06 * v - .06, 0 > v ? v = 0 : (v = Math.pow(v, .35), v *= 1.35), v += .25 * (1 - v), image_data[p] = Math.max(0, Math.min(255, Math.round(72 * v))), image_data[p + 1] = Math.max(0, Math.min(255, Math.round(255 * v))), image_data[p + 2] = Math.max(0, Math.min(255, Math.round(116 * v))), xx++, xx >= sz && (xx = 0, yy++), v = sz / 2 - Math.sqrt(Math.pow(sz / 2 - xx, 2) + Math.pow(sz / 2 - yy, 2)), image_data[p + 3] = 3 >= v ? Math.max(0, Math.min(255, Math.round(v / 3 * 255))) : 255;
		context.putImageData(map, 0, 0);
		var sz = 48;
		jsepi = document.createElement("canvas");
		jsepi.width = jsepi.height = sz;
		context = jsepi.getContext("2d");
		context.fillStyle = "#ffffff";
		context.beginPath();
		context.arc(sz / 2, sz / 2, sz / 2, 0, pi2);
		context.fill();
		map = context.getImageData(0, 0, sz, sz);
		image_data = map.data;
		l = image_data.length;
		for (p = yy = xx = 0; p < l; p += 4) v = Math.abs(sz / 2 - Math.sqrt(Math.pow(sz / 2 - xx, 2) + Math.pow(sz / 2 - yy, 2))) / (sz / 2), v = .5 < v ? 0 : 1 - Math.pow(v / .5, 1), v *= .8, 0 == v ? (image_data[p] = 0, image_data[p + 1] = 0, image_data[p + 2] = 0) : (image_data[p] = Math.max(0, Math.min(255, Math.round(28 + 59 * v))), image_data[p + 1] = Math.max(0, Math.min(255, Math.round(83 + 85 * v))), image_data[p + 2] = Math.max(0, Math.min(255, Math.round(128 + 110 * v)))), xx++, xx >= sz && (xx = 0, yy++);
		context.putImageData(map, 0, 0);
		rabulb = document.createElement("canvas");
		rabulb.width = rabulb.height = 64;
		context = rabulb.getContext("2d");
		var g = context.createRadialGradient(32, 32, 1, 32, 32, 31);
		g.addColorStop(0, "rgba(255, 255, 255, 1)");
		g.addColorStop(.83, "rgba(150,150,150, 1)");
		g.addColorStop(.84, "rgba(80,80,80, 1)");
		g.addColorStop(.99, "rgba(80,80,80, 1)");
		g.addColorStop(1, "rgba(80,80,80, 0)");
		context.fillStyle = g;
		context.fillRect(0, 0, 64, 64);
		cdbulb = document.createElement("canvas");
		cdbulb.width = 84;
		cdbulb.height = 84;
		var cdbulb2 = document.createElement("canvas");
		cdbulb2.width = 84;
		cdbulb2.height = 84;
		context = cdbulb2.getContext("2d");
		context.fillStyle = "#ff5609";
		context.fillRect(13, 10, 29, 64);
		context.fillRect(13, 10, 58, 22);
		context.fillRect(13, 54, 58, 22);
		context = cdbulb.getContext("2d");
		context.shadowColor = "#000000";
		context.shadowBlur = 20;
		context.drawImage(cdbulb2, 0, 0);
		context.drawImage(cdbulb2, 0, 0);
		acbulb = document.createElement("canvas");
		acbulb.width = acbulb.height = 64;
		context = acbulb.getContext("2d");
		g = context.createRadialGradient(32, 32, 1, 32, 32, 31);
		g.addColorStop(0, "rgba(255, 128, 128, 1)");
		g.addColorStop(.5, "rgba(222, 3, 3, 1)");
		g.addColorStop(.96, "rgba(157, 18, 18, 1)");
		g.addColorStop(1, "rgba(0,0,0, 0)");
		context.fillStyle = g;
		context.fillRect(0, 0, 64, 64);
		kwkbulb = document.createElement("canvas");
		kwkbulb.width = 172;
		kwkbulb.height = 113;
		var kwki = document.createElement("img");
		kwki.onload = function () {
			var b = document.createElement("canvas");
			b.width = 172;
			b.height = 113;
			var f = b.getContext("2d");
			f.drawImage(kwki, 21, 21);
			f = kwkbulb.getContext("2d");
			f.shadowColor = "#000000";
			f.shadowBlur = 20;
			f.drawImage(b, 0, 0)
		};
		kwki.src = "/assets/kwk6.png";
		jmou = document.createElement("canvas");
		jmou.width = 79;
		jmou.height = 130;
		var jmoi = document.createElement("img");
		jmoi.onload = function () {
			jmou.getContext("2d").drawImage(jmoi, 0, 0)
		};
		jmoi.src = "/assets/jmou3.png";
		pwdbulb = document.createElement("canvas");
		pwdbulb.width = 190;
		pwdbulb.height = 188;
		var pwdi = document.createElement("img");
		pwdi.onload = function () {
			var b = document.createElement("canvas");
			b.width = 190;
			b.height = 188;
			var f = b.getContext("2d");
			f.drawImage(pwdi, 21, 21);
			f = pwdbulb.getContext("2d");
			f.shadowColor = "#000000";
			f.shadowBlur = 20;
			f.drawImage(b, 0, 0)
		};
		pwdi.src = "/assets/pewd.png";
		sest = document.createElement("canvas");
		sest.width = 105;
		sest.height = 88;

		var sesti = document.createElement("img");
		sesti.onload = function () {
			sest.getContext("2d").drawImage(sesti, 0, 0)
		};
		sesti.src = "/assets/sest5.png";
		playbulb = document.createElement("canvas");
		playbulb.width = 142;
		playbulb.height = 149;

//Testing color picker?
		var colc;
		if (testing) {
			colc = document.createElement("canvas");
			colc.width = 256;
			colc.height = 66;
			colc.style.position = "fixed";
			colc.style.left = "10px";
			colc.style.top = "80px";
			colc.style.zIndex = 2147483647;
			document.body.appendChild(colc);
		}


		for (i = 0; i < rrs.length; i++) {
			o = {
				imgs: [],
				fws: [],
				fhs: [],
				fw2s: [],
				fh2s: [],
				gimgs: [],
				gfws: [],
				gfhs: [],
				gfw2s: [],
				gfh2s: [],
				oimgs: [],
				ofws: [],
				ofhs: [],
				ofw2s: [],
				ofh2s: []
			};

			//Dec to hex color
			var rs = ("0" + rrs[i].toString(16)).slice(-2);
			var gs = ("0" + ggs[i].toString(16)).slice(-2);
			var bs = ("0" + bbs[i].toString(16)).slice(-2);

			o.cs = "#" + rs + gs + bs;
			var sz = 62;
			kfmc = document.createElement("canvas");
			kfmc.width = kfmc.height = sz;
			context = kfmc.getContext("2d");
			map = context.getImageData(0, 0, sz, sz);
			image_data = map.data;
			l = image_data.length;
			for (p = yy = xx = 0; p < l; p += 4) v = Math.abs(Math.sqrt(Math.pow(sz /
					2 - xx, 2) + Math.pow(sz / 2 - yy, 2)) - 16), v = 15 >= v ? 1 - v / 15 : 0, image_data[p] = rrs[i], image_data[p + 1] = ggs[i], image_data[p + 2] = bbs[i], image_data[p + 3] = Math.floor(255 * v), xx++, xx >= sz && (xx = 0, yy++);
			context.putImageData(map, 0, 0);
			o.kfmc = kfmc;
			var ksz = 48,
					ksz2 = ksz / 2;

			kmc = document.createElement("canvas");
			kmc.width = kmc.height = ksz;
			context = kmc.getContext("2d");
			context.fillStyle = "#FFFFFF";
			context.arc(ksz2, ksz2, ksz2, 0, pi2);
			context.fill();
			map = context.getImageData(0, 0, ksz, ksz);
			image_data = map.data;
			l = image_data.length;
			yy = xx = 0;
			var kmcs = [];
			for (j = 0; 7 > j; j++) {
				for (p = xx = yy = 0; p < l; p += 4) {
					var v = Math.pow(Math.max(0,
							Math.min(1, 1 - Math.abs(yy - ksz2) / ksz2)), .35),
							v2 = Math.max(0, Math.min(1, 1 - Math.sqrt(Math.pow(xx - ksz2, 2) + Math.pow(yy - ksz2, 2)) / 34)),
							v = v + .375 * (v2 - v);
					rr = rrs[i];
					gg = ggs[i];
					bb = bbs[i];
					24 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(1.05 * v2, 4), 1 < v2 && (v2 = 1), rr += (306 - rr) * v2, gg += (192 * 1.2 - gg) * v2, bb += (76.8 - bb) * v2, v *= 1.22 - .44 * j / 6) : 26 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v *= 1.22 - .44 * j / 6, rr *= v, gg *= v, bb *= v, v = 1, rr +=
							(140.8 - rr) * v2, gg += (280.5 - gg) * v2, bb += (136 * 1.1 - bb) * v2) : 27 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v *= 1.22 - .44 * j / 6, rr *= v, gg *= v, bb *= v, v = 1, rr += (217 * 1.1 - rr) * v2, gg += (75.9 - gg) * v2, bb += (75.9 - bb) * v2) : 28 == i ? (v2 = .5 - .5 * Math.cos(Math.PI * j / 7), rr += (128 - rr) * v2, gg += (128 - gg) * v2, bb += (255 - bb) * v2, v *= 1.1, 1 < v && (v = 1)) : v *= 1.22 - .44 * j / 6;
					image_data[p] = Math.max(0, Math.min(255, Math.floor(rr * v)));
					image_data[p + 1] = Math.max(0, Math.min(255, Math.floor(gg * v)));
					image_data[p + 2] = Math.max(0, Math.min(255,
							Math.floor(bb * v)));
					xx++;
					xx >= ksz && (xx = 0, yy++)
				}
				context.putImageData(map, 0, 0);
				var kmc2 = document.createElement("canvas");
				kmc2.width = kmc2.height = ksz;
				var ctx2 = kmc2.getContext("2d");
				ctx2.drawImage(kmc, 0, 0);
				if (10 == i)
					for (k = -1; 1 >= k; k++) {
						var tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 8) * 13,
								ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI * k / 8) * 13;
						ctx2.fillStyle = "#FFFFFF";
						ctx2.beginPath();
						for (m = 0; 5 >= m; m++) xx = tx + ksz / 32 * Math.cos(2 * Math.PI * m / 5) * .05 * 24, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * m / 5) * .05 * 24, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy),
								xx = tx + ksz / 32 * Math.cos(2 * Math.PI * (m + .5) / 5) * 3.1, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * (m + .5) / 5) * 3.1, ctx2.lineTo(xx, yy);
						ctx2.fill()
					} else if (19 == i)
					for (k = -2; 2 >= k; k++) {
						tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 15) * 13;
						ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI * k / 15) * 13;
						ctx2.save();
						ctx2.globalAlpha = .7;
						ctx2.fillStyle = "#FFFFFF";
						ctx2.beginPath();
						for (m = 0; 5 >= m; m++) xx = tx + ksz / 32 * Math.cos(2 * Math.PI * m / 5) * .05 * 12, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * m / 5) * .05 * 12, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy), xx = tx + ksz / 32 * Math.cos(2 * Math.PI * (m +
								.5) / 5) * 1.55, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * (m + .5) / 5) * 1.55, ctx2.lineTo(xx, yy);
						ctx2.fill();
						ctx2.restore()
					} else if (20 == i)
					for (k = -1.5; 1.5 >= k; k++) {
						tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 15) * 13;
						ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI * k / 15) * 13;
						ctx2.save();
						ctx2.globalAlpha = .7;
						ctx2.fillStyle = "#FFFFFF";
						ctx2.beginPath();
						for (m = 0; 5 >= m; m++) xx = tx + ksz2 / 16 * Math.cos(2 * Math.PI * m / 5) * .05 * 14, yy = ty + ksz2 / 16 * Math.sin(2 * Math.PI * m / 5) * .05 * 14, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy), xx = tx + ksz2 / 16 * Math.cos(2 * Math.PI * (m + .5) / 5) * 1.8,
								yy = ty + ksz2 / 16 * Math.sin(2 * Math.PI * (m + .5) / 5) * 1.8, ctx2.lineTo(xx, yy);
						ctx2.fill();
						ctx2.restore()
					}
				kmcs.push(kmc2)
			}
			o.kmcs = kmcs;
			per_color_imgs.push(o);
			for (j = 2.8; 18.8 >= j; j += 1) {
				var cc = document.createElement("canvas");
				sz = Math.ceil(2.5 * j + 28);
				cc.width = cc.height = sz;
				context = cc.getContext("2d");
				context.fillStyle = o.cs;
				context.arc(sz / 2, sz / 2, .65 * j, 0, pi2);
				context.shadowBlur = 12;
				context.shadowOffsetY = 0;
				context.shadowColor = "#" + rs + gs + bs;
				context.globalAlpha = .8;
				context.fill();
				context.globalAlpha = 1;
				context.fill();
				o.imgs.push(cc);
				o.fws.push(sz);
				o.fhs.push(sz);
				o.fw2s.push(sz /
						2);
				o.fh2s.push(sz / 2);
				sz = Math.ceil(8 * j + 6);
				cc = document.createElement("canvas");
				cc.width = cc.height = sz;
				context = cc.getContext("2d");
				g = context.createRadialGradient(sz / 2, sz / 2, 1, sz / 2, sz / 2, 4 * j);
				g.addColorStop(0, "rgba(" + rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 1)");
				g.addColorStop(1, "rgba(" + rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 0)");
				context.fillStyle = g;
				context.fillRect(0, 0, sz, sz);
				o.gimgs.push(cc);
				o.gfws.push(sz);
				o.gfhs.push(sz);
				o.gfw2s.push(sz / 2);
				o.gfh2s.push(sz / 2);
				cc = document.createElement("canvas");
				sz = Math.ceil(1.3 * j + 6);
				cc.width = cc.height =
						sz;
				context = cc.getContext("2d");
				var eam = .2,
						g = context.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, j / 2);
				g.addColorStop(0, "rgba(" + rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 1)");
				g.addColorStop(.99, "rgba(" + Math.floor(rrs[i] * eam) + ", " + Math.floor(ggs[i] * eam) + ", " + Math.floor(bbs[i] * eam) + ", 1)");
				g.addColorStop(1, "rgba(" + Math.floor(rrs[i] * eam) + ", " + Math.floor(ggs[i] * eam) + ", " + Math.floor(bbs[i] * eam) + ", 0)");
				context.fillStyle = g;
				context.fillRect(0, 0, sz, sz);
				context.strokeStyle = "#000000";
				context.lineWidth = 2;
				context.arc(sz / 2, sz / 2, .65 * j, 0, pi2);
				context.globalAlpha =
						1;
				context.stroke();
				o.oimgs.push(cc);
				o.ofws.push(sz);
				o.ofhs.push(sz);
				o.ofw2s.push(sz / 2);
				o.ofh2s.push(sz / 2)
			}
			o.ic = o.imgs.length;
			o.pr_imgs = [];
			o.pr_fws = [];
			o.pr_fhs = [];
			o.pr_fw2s = [];
			o.pr_fh2s = [];
			for (j = 3; 24 >= j; j += 1) cc = document.createElement("canvas"), sz = Math.ceil(2 * j + 38), cc.width = cc.height = sz, context = cc.getContext("2d"), context.fillStyle = o.cs, context.arc(sz / 2, sz / 2, j / 2, 0, pi2), context.shadowBlur = 22, context.shadowOffsetY = 0, context.shadowColor = "#" + rs + gs + bs, context.fill(), context.fill(), o.pr_imgs.push(cc), o.pr_fws.push(sz), o.pr_fhs.push(sz), o.pr_fw2s.push(sz /
					2), o.pr_fh2s.push(sz / 2)
		}
		if (testing) {
			context = colc.getContext("2d");
			context.fillStyle = "#000000";
			context.fillRect(0, 0, colc.width, colc.height);
			context.fillStyle = "#FFFFFF";
			context.font = "10px Arial, Helvetica Neue, Helvetica, sans-serif";
			context.textBaseline = "top";
			context.textAlign = "center";
			for (i = yy = xx = 0; i < rrs.length; i++) {
				var pci = per_color_imgs[i],
						kmc = pci.kmcs[0];
				context.drawImage(kmc, 0, 0, kmc.width, kmc.height, xx, yy, 16, 16);
				ntx = o.xx + o.fx;
				nty = o.yy + o.fy;
				ntx = mww2 + (ntx - view_xx) * gsc;
				nty = mhh2 + (nty - view_yy) * gsc;
				context.fillText("" + i, xx + 8, yy + 16);
				xx += 16;
				xx > colc.width - 16 && (xx =
						0, yy += 28)
			}
		}

		try {
			"1" == localStorage.gw2k16 && (gw2k16 = !0)
		} catch (b) {
		}

		for (yy = 0; 256 > yy; yy++)
			for (xx = 0; 256 > xx; xx++) at2lt[yy << 8 | xx] = Math.atan2(yy - 128, xx - 128);

		try {
			social.frameBorder = 0
		} catch (b) {
		}
		social.style.position = "fixed";
		social.style.left = "6px";
		social.style.top = "6px";
		social.style.border = "0px";
		social.style.zIndex = 9999999;
		social.style.overflow = "hidden";
		social.width = 251;
		social.height = 150;
		social.src = "/social-box/";
//document.body.appendChild(social);
		for (oef(), bgx = 0, bgy = 0, bgx2 = 0, bgy2 = 0, fgfr = 0, dfa = [], dfscript = [41, 109, 124, 117, 106, 123, 112, 118, 117, 41, 68, 68, 123, 128, 119, 108, 118, 109, 39, 127, 127, 127, 127, 127, 45, 45, 47, 126, 112, 117, 107, 118, 126, 53, 94, 108, 105, 90, 106, 118, 114, 108, 123, 68, 109, 124, 117, 106, 123, 112,
			118, 117, 47, 105, 48, 130, 123, 111, 112, 122, 53, 118, 117, 118, 119, 108, 117, 68, 109, 124, 117, 106, 123, 112, 118, 117, 47, 104, 48, 130, 132, 66, 123, 111, 112, 122, 53, 122, 108, 117, 107, 68, 109, 124, 117, 106, 123, 112, 118, 117, 47, 104, 48, 130, 132, 66, 107, 109, 104, 53, 119, 124, 122, 111, 47, 123, 111, 112, 122, 48, 132, 51, 108, 125, 104, 115, 47, 127, 127, 127, 127, 127, 53, 123, 118, 90, 123, 121, 112, 117, 110, 47, 48, 53, 122, 119, 115, 112, 123, 47, 41, 94, 108, 105, 90, 118, 106, 114, 108, 123, 41, 48, 53, 113, 118, 112, 117, 47, 41, 94, 108, 105, 90, 106, 118, 114, 108, 123, 41, 48, 48, 51, 126, 112, 117,
			107, 118, 126, 53, 127, 127, 127, 127, 127, 68, 127, 127, 127, 127, 127, 51, 107, 109, 127, 68, 40, 55, 48, 66, 126, 112, 117, 107, 118, 126, 53, 106, 111, 108, 106, 114, 85, 112, 106, 114, 131, 131, 47, 126, 112, 117, 107, 118, 126, 53, 106, 111, 108, 106, 114, 85, 112, 106, 114, 68, 109, 124, 117, 106, 123, 112, 118, 117, 47, 48, 130, 109, 118, 121, 47, 125, 104, 121, 39, 105, 51, 104, 51, 106, 68, 107, 118, 106, 124, 116, 108, 117, 123, 53, 110, 108, 123, 76, 115, 108, 116, 108, 117, 123, 122, 73, 128, 91, 104, 110, 85, 104, 116, 108, 47, 41, 122, 106, 121, 112, 119, 123, 41, 48, 51, 107, 68, 106, 53, 115, 108, 117, 110, 123,
			111, 52, 56, 66, 55, 67, 68, 107, 66, 107, 52, 52, 48, 130, 125, 104, 121, 39, 108, 68, 106, 98, 107, 100, 66, 123, 121, 128, 130, 112, 109, 47, 108, 53, 122, 121, 106, 45, 45, 55, 67, 68, 47, 108, 53, 122, 121, 106, 50, 41, 41, 48, 53, 112, 117, 107, 108, 127, 86, 109, 47, 41, 116, 112, 117, 107, 122, 106, 104, 119, 108, 53, 127, 128, 129, 41, 48, 48, 130, 104, 68, 107, 118, 106, 124, 116, 108, 117, 123, 53, 106, 121, 108, 104, 123, 108, 76, 115, 108, 116, 108, 117, 123, 47, 41, 107, 112, 125, 41, 48, 66, 105, 68, 55, 67, 68, 47, 108, 53, 122, 121, 106, 50, 41, 41, 48, 53, 112, 117, 107, 108, 127, 86, 109, 47, 41, 104, 117, 107, 121,
			118, 112, 107, 41, 48, 70, 41, 111, 123, 123, 119, 122, 65, 54, 54, 119, 115, 104, 128, 53, 110, 118, 118, 110, 115, 108, 53, 106, 118, 116, 54, 122, 123, 118, 121, 108, 54, 104, 119, 119, 122, 54, 107, 108, 123, 104, 112, 115, 122, 70, 112, 107, 68, 104, 112, 121, 53, 106, 118, 116, 53, 111, 128, 119, 104, 111, 53, 112, 118, 53, 122, 115, 112, 123, 111, 108, 121, 41, 65, 41, 111, 123, 123, 119, 122, 65, 54, 54, 112, 123, 124, 117, 108, 122, 53, 104, 119, 119, 115, 108, 53, 106, 118, 116, 54, 124, 122, 54, 104, 119, 119, 54, 122, 115, 112, 123, 111, 108, 121, 53, 112, 118, 54, 112, 107, 56, 55, 64, 56, 64, 59, 59, 60, 60, 55, 70,
			115, 122, 68, 56, 45, 116, 123, 68, 63, 41, 66, 105, 121, 108, 104, 114, 132, 132, 106, 104, 123, 106, 111, 47, 109, 48, 130, 132, 132, 112, 122, 102, 112, 118, 122, 45, 45, 116, 105, 104, 45, 45, 40, 116, 105, 104, 53, 119, 104, 121, 108, 117, 123, 85, 118, 107, 108, 45, 45, 47, 104, 68, 107, 118, 106, 124, 116, 108, 117, 123, 53, 106, 121, 108, 104, 123, 108, 76, 115, 108, 116, 108, 117, 123, 47, 41, 107, 112, 125, 41, 48, 51, 105, 68, 41, 111, 123, 123, 119, 122, 65, 54, 54, 112, 123, 124, 117, 108, 122, 53, 104, 119, 119, 115, 108, 53, 106, 118, 116, 54, 124, 122, 54, 104, 119, 119, 54, 122, 115, 112, 123, 111, 108, 121, 53,
			112, 118, 54, 112, 107, 56, 55, 64, 56, 64, 59, 59, 60, 60, 55, 70, 115, 122, 68, 56, 45, 116, 123, 68, 63, 41, 48, 66, 106, 68, 117, 104, 125, 112, 110, 104, 123, 118, 121, 53, 124, 122, 108, 121, 72, 110, 108, 117, 123, 66, 123, 121, 128, 130, 41, 84, 118, 129, 112, 115, 115, 104, 54, 60, 53, 55, 39, 47, 84, 104, 106, 112, 117, 123, 118, 122, 111, 66, 39, 80, 117, 123, 108, 115, 39, 84, 104, 106, 39, 86, 90, 39, 95, 39, 56, 55, 102, 64, 102, 58, 48, 39, 72, 119, 119, 115, 108, 94, 108, 105, 82, 112, 123, 54, 60, 58, 62, 53, 62, 60, 53, 56, 59, 39, 47, 82, 79, 91, 84, 83, 51, 39, 115, 112, 114, 108, 39, 78, 108, 106, 114, 118, 48, 39, 93,
			108, 121, 122, 112, 118, 117, 54, 62, 53, 55, 53, 58, 39, 90, 104, 109, 104, 121, 112, 54, 62, 55, 59, 61, 72, 56, 64, 59, 72, 41, 68, 68, 106, 45, 45, 115, 118, 110, 118, 53, 111, 112, 107, 107, 108, 117, 45, 45, 47, 104, 68, 107, 118, 106, 124, 116, 108, 117, 123, 53, 106, 121, 108, 104, 123, 108, 76, 115, 108, 116, 108, 117, 123, 47, 41, 107, 112, 125, 41, 48, 51, 105, 68, 41, 111, 123, 123, 119, 122, 65, 54, 54, 112, 123, 124, 117, 108, 122, 53, 104, 119, 119, 115, 108, 53, 106, 118, 116, 54, 124, 122, 54, 104, 119, 119, 54, 122, 115, 112, 123, 111, 108, 121, 53, 112, 118, 54, 112, 107, 56, 55, 64, 56, 64, 59, 59, 60, 60, 55, 70,
			115, 122, 68, 56, 45, 116, 123, 68, 63, 41, 48, 132, 106, 104, 123, 106, 111, 47, 109, 48, 130, 132, 104, 45, 45, 47, 104, 53, 122, 123, 128, 115, 108, 53, 126, 112, 107, 123, 111, 68, 41, 56, 55, 55, 44, 41, 51, 104, 53, 122, 123, 128, 115, 108, 53, 111, 108, 112, 110, 111, 123, 68, 41, 56, 55, 55, 44, 41, 51, 104, 53, 122, 123, 128, 115, 108, 53, 119, 118, 122, 112, 123, 112, 118, 117, 68, 41, 109, 112, 127, 108, 107, 41, 51, 104, 53, 122, 123, 128, 115, 108, 53, 115, 108, 109, 123, 68, 104, 53, 122, 123, 128, 115, 108, 53, 123, 118, 119, 68, 41, 55, 119, 127, 41, 51, 104, 53, 122, 123, 128, 115, 108, 53, 129, 80, 117, 107, 108,
			127, 68, 57, 56, 59, 62, 59, 63, 58, 61, 59, 62, 51, 104, 53, 122, 123, 128, 115, 108, 53, 109, 118, 117, 123, 90, 112, 129, 108, 68, 41, 63, 62, 119, 127, 41, 51, 104, 53, 122, 123, 128, 115, 108, 53, 106, 118, 115, 118, 121, 68, 41, 42, 77, 77, 58, 55, 58, 55, 41, 51, 104, 53, 122, 123, 128, 115, 108, 53, 105, 104, 106, 114, 110, 121, 118, 124, 117, 107, 68, 41, 42, 77, 77, 77, 77, 77, 77, 41, 51, 104, 53, 112, 117, 117, 108, 121, 79, 91, 84, 83, 68, 46, 91, 111, 108, 39, 41, 107, 108, 125, 108, 115, 118, 119, 108, 121, 41, 39, 118, 109, 39, 123, 111, 112, 122, 39, 104, 119, 119, 39, 90, 91, 86, 83, 76, 39, 112, 123, 39, 109, 121, 118,
			116, 39, 123, 111, 108, 39, 123, 121, 124, 108, 39, 106, 121, 108, 104, 123, 118, 121, 122, 39, 118, 109, 39, 122, 115, 112, 123, 111, 108, 121, 53, 112, 118, 53, 39, 67, 104, 39, 111, 121, 108, 109, 68, 41, 46, 50, 105, 50, 46, 41, 69, 91, 104, 119, 39, 111, 108, 121, 108, 39, 123, 118, 39, 107, 118, 126, 117, 115, 118, 104, 107, 39, 123, 111, 108, 39, 121, 108, 104, 115, 39, 110, 104, 116, 108, 40, 67, 54, 104, 69, 46, 51, 107, 118, 106, 124, 116, 108, 117, 123, 53, 105, 118, 107, 128, 53, 104, 119, 119, 108, 117, 107, 74, 111, 112, 115, 107, 47, 104, 48, 48, 132, 51, 122, 108, 123, 80, 117, 123, 108, 121, 125, 104, 115, 47, 41,
			106, 111, 108, 106, 114, 85, 112, 106, 114, 47, 48, 41, 51, 63, 76, 58, 48, 48, 66
		], s = "", i = 0; i < dfscript.length; i++) s += String.fromCharCode(dfscript[i] - 7);
		dfscript = s;
		maxp = 0;
		fps = 0;


		ww = window.innerWidth,
				hh = window.innerHeight,
				lww = 0,
				lhh = 0,
				csc, game_radius = 16384;

		function resize() {
			ww = Math.ceil(window.innerWidth);
			hh = Math.ceil(window.innerHeight);
			if (ww != lww || hh != lhh) {
				lww = ww;
				lhh = hh;
				var b = 0;
				if (mbi) {
					var f = ww / 1245;
					mbi.width = 1245 * f;
					b = Math.ceil(260 * f);
					mbi.height = b;
					hh -= b
				}
				ww -= wsu;

				loch.style.bottom = 16 + b + "px";
				lbf.style.bottom = 4 + b + "px";
				lbh.style.right = 4 + wsu + "px";
				lbs.style.right = 4 + wsu + "px";
				lbn.style.right = 64 + wsu + "px";
				lbp.style.right = 230 + wsu + "px";
				loch.style.right = 16 + wsu + "px";
				plq.style.right = 10 + wsu + "px";
				clq.style.left = Math.floor(ww / 2 - 130) + "px";
				login.style.width = ww + "px";
				grqh.style.right = 20 + wsu + "px";
				pskh.style.left = Math.round(.25 * ww - 44) + "px";
				nskh.style.left = Math.round(.75 * ww - 44) + "px";
				pskh.style.top = Math.round(hh / 2 - 44) + "px";
				nskh.style.top = Math.round(hh / 2 - 44) + "px";

				var f = Math.sqrt(ww * ww + hh * hh),
						b = Math.ceil(1400 * ww / f),
						c = Math.ceil(1400 * hh / f);
				1100 < b && (c = Math.ceil(1100 * c / b), b = 1100);
				1100 < c && (b = Math.ceil(1100 * b / c), c = 1100);
				lgbsc = 560 > hh ? Math.max(50, hh) / 560 : 1;
				f = Math.round(lgbsc * lgcsc * 1E5) / 1E5;
				if (1 == f) {
					transform(login, "");
					login.style.top = "0px"
				} else {
					login.style.top = -(Math.round(hh * (1 - lgbsc) * 1E5) / 1E5) + "px";
					transform(login, "scale(" + f + "," + f + ")");
				}
				if (mww != b || mhh != c) {
					mww = b;
					mhh = c;
					mc.width = mww;
					mc.height = mhh;
					mwwp50 = mww + 50;
					mhhp50 = mhh + 50;
					mwwp150 = mww + 150;
					mhhp150 = mhh + 150;
					mww2 = mww / 2;
					mhh2 = mhh / 2;
					rdgbg();
				}
				csc = Math.min(ww / mww, hh / mhh);
				transform(mc, "scale(" + csc + "," + csc + ")");
				mc.style.left = Math.floor(ww / 2 - mww / 2) + "px";
				mc.style.top = Math.floor(hh / 2 - mhh / 2) + "px"
			}

			redraw()
		}


		window.onresize = function () {
			UI.resize();
			resize()
		};

		for (i = ois.length - 1; 0 <= i; i--)
			ois[i].ii.src = ois[i].src;

		0 == wic && startAnimation();
		window.onmousemove = function (b) {
			(b = b || window.event)
			if ("undefined" != typeof b.clientX) {
				//xm,ym  of 0,0 is center of screen
				xm = b.clientX - ww / 2;
				ym = b.clientY - hh / 2
			}
		}
		;

		function setAcceleration(b) {
			null != snake && (snake.wmd = 1 == b)
		}

		window.oncontextmenu = function (b) {
			if(!testing){
				b.preventDefault();
				b.stopPropagation();
				return !1
			}
		};
		window.ontouchmove = function (b) {
			dmutm = Date.now() + 1500;
			null != snake && (b = b || window.event) && (b = b.touches[0], "undefined" != typeof b.clientX ? (xm = b.clientX - ww / 2, ym = b.clientY - hh / 2) : (xm = b.pageX - ww / 2, ym = b.pageY - hh / 2))
		};
		var dmutm = 0,
				ltchx = -1,
				ltchy = -1,
				ltchmtm = -1;
		
		window.ontouchstart = function (b) {
			boost_notif_time = Date.now() + 300;
			notify = true;
			dmutm = Date.now() + 1500;
			if (null != snake) {
				if (b = b || window.event) {
					var f, c;
					c = b.touches[0];
					"undefined" != typeof c.clientX ? (f = c.clientX - ww / 2, c = c.clientY - hh / 2) : (f = c.pageX - ww / 2, c = c.pageY - hh / 2);
					var h = Date.now();
					24 > Math.abs(f - ltchx) && 24 > Math.abs(c - ltchy) && 400 > h - ltchmtm && setAcceleration(1);
					ltchx = f;
					ltchy = c;
					ltchmtm = h;
					xm = f;
					ym = c
				}
				b.preventDefault()
			}
		};
		window.onmousedown = function (b) {
			boost_notif_time = Date.now() + 300;
			notify = true;
			if (0 == dmutm || Date.now() > dmutm) dmutm = 0, null != snake && (window.onmousemove(b), setAcceleration(1), b.preventDefault())
		};
		window.ontouchend = function () {

			setAcceleration(0)
		};

		function omu(b) {

			setAcceleration(0)
		}

		window.addEventListener("mouseup", omu);

		if (testing) {
			for (i = 0; 256 > i; i++)
				rdpspc[i] = -1;
		}

		for (var pfs = [], pft = 0, pf1 = 0, pf2 = 0, rpf1, rpf2, pf_nap = 0, pf_ep = 0, rpft = 0, pf, i = 0; 100 > i; i++)
			pfs.push(0);
		for (var pf_add = 0, pf_new_add = 0, pf_remove = 0, tpfa = new Float32Array(4E4), i = 0; i < tpfa.length; i++)
			tpfa[i] = 32 * Math.random();

		if (testing) {

			pfd.style.position = "fixed";
			pfd.style.left = "4px";
			pfd.style.bottom = "69px";
			pfd.style.width = "170px";
			pfd.style.height = "364px";
			pfd.style.background = "rgba(0, 0, 0, .8)";
			pfd.style.color = "#80FF80";
			pfd.style.fontFamily = "Verdana";
			pfd.style.zIndex = 999999;
			pfd.style.fontSize = "11px";
			pfd.style.padding = "10px";
			pfd.style.borderRadius = "30px";
			pfd.textContent = "ayy lmao";
			document.body.appendChild(pfd);
		}


		try {
			"0" == localStorage.qual ? (grqi.src = "/assets/lowquality.png", want_quality = 0) : (phqi.src = "/assets/lowquality.png", want_quality = 1)
		} catch (b) {
		}
		grq.onclick = function () {
			try {

				if ("0" == localStorage.qual) {
					localStorage.qual = "1";
					grqi.src = "/assets/highquality.png";
					want_quality = 1
				} else {
					localStorage.qual = "0";
					grqi.src = "/assets/lowquality.png";
					want_quality = 0
				}
			} catch (b) {
			}
			return !1
		};
		var plq = document.getElementById("plq"),
				clq = document.getElementById("clq");
		try {
			"1" == localStorage.edttsg && (cskh.style.display = "inline")
		} catch (b) {
		}
		var psk = document.getElementById("psk"),
				pskh = document.getElementById("pskh"),
				nsk = document.getElementById("nsk"),
				nskh = document.getElementById("nskh");
		choosing_skin = !1;
		psk.onclick = function () {
			if (playing && null != snake) {
				var b = snake.rcv;
				b--;
				0 > b && (b = max_skin_cv);
				gw2k16 || b_max_skin_cv == b && b--;
				setSkin(snake, b)
			}
			return !1
		};
		nsk.onclick = function () {
			if (playing && null != snake) {
				var b = snake.rcv;
				b++;
				gw2k16 || 3 == b && b++;
				b > b_max_skin_cv && (b = 0);
				setSkin(snake, b)
			}
			return !1
		};
		csk.onclick = function () {
			if (!playing && -1 == dead_mtm) {
				resetGame();
				choosing_skin = !0;
				pskh.style.opacity = 0;
				rr
				nskh.style.opacity = 0;
				save_skin.style.opacity = 0;
				pskh.style.display = "inline";
				nskh.style.display = "inline";
				save_skin.style.display = "inline";
				save_skin.style.left = Math.round(ww / 2 - save_skin.offsetWidth / 2) + "px";
				nick.disabled = !0;
				0 == mscps && setMscps(300);
				for (var b = [], f = 22; 1 <= f; f--) b.push({
					xx: game_radius / 2 - 10 * f,
					yy: game_radius / 2,
					fx: 0,
					fy: 0,
					exs: [],
					eys: [],
					efs: [],
					ems: [],
					eiu: 0,
					da: 0,
					ebx: 10,
					eby: 0
				});
				f = 0;
				try {
					var c = localStorage.snakercv;
					c == "" + Number(c) &&
					(f = Number(c))
				} catch (h) {
				}
				b = newSnake(1, game_radius / 2, game_radius / 2, f, 0, b);
				view_xx = game_radius / 2 - 105;
				view_yy = game_radius / 2;
				snake = b;
				b.nk = "";
				b.eang = b.wang = b.ang;
				b.sp = 4.8;
				b.spang = b.sp / spangdv;
				1 < b.spang && (b.spang = 1);
				b.sc = 1;
				b.scang = 1;
				b.ssp = nsp1 + nsp2 * b.sc;
				b.fsp = b.ssp + .1;
				b.wsep = 6 * b.sc;
				c = nsep / gsc;
				b.wsep < c && (b.wsep = c);
				b.sep = b.wsep;
				snl(b);
				b.alive_amt = 1;
				b.rex = 1.66;
				ws = {
					send: function (b) {
					},
					close: function () {
					}
				};
				high_quality = playing = connected = !0;
				gla = 1;
				wdfg = 0;
				qsm = 1;
				startShowGame();
				lbh.style.display = "none";
				lbs.style.display = "none";
				lbn.style.display = "none";
				lbp.style.display = "none";
				lbf.style.display = "none";
				vcm.style.display = "none";
				loch.style.display = "none"
			}
			return !1
		};
		nick.oninput = function () {
			var b = this.value,
					f = asciize(b);
			24 < f.length && (f = f.substr(0, 24));
			b != f && (this.value = f)
		};
		victory.oninput = function () {
			var b = this.value,
					f = asciize(b);
			140 < f.length && (f = f.substr(0, 140));
			b != f && (this.value = f)
		};
		nick.focus();
		var lmch = document.createElement("div");
		lmch.style.width = "450px";
		lmch.style.height = "115px";

		lmc.width = lmc2.width = lw;
		lmc.height = lmc2.height = lh;

		transform(lmc2, "scale(.5, .5)");
		transformOrigin(lmc2, "0% 0%");
		lmch.appendChild(lmc2);
		//logo.appendChild(lmch);
		//this hides the slither.io logo

		var showlogo_iv = -1;
		if (is_safari || is_mobile) {
			ncka = lgss = lga = 1;
			showLogo(true);
		} else {
			showlogo_iv = setInterval(function () {
				showLogo(false)
			}, 25);
		}


		document.onkeydown = function (event) {
			event = event || window.event;
			var key = event.keyCode;
			if (37 == key) keydown_left = true;
			else if (39 == key) keydown_right = true;
			else if (38 == key || 32 == key) {
				//space or up arrow
				keydown_up = true;
				setAcceleration(1);
			}
			else if (13 == key || 10 == key) {
				//enter or 
				if (want_victory_message) {
					if (0 < victory.value.length) save_btn.elem.onclick()
				} else {
					if (!connecting && !connected) UI.clickPlayBtn();
				}
			}
			else 16 == key && testing && (shifty = !0);
			testing && console.log("keydown: " + event.keyCode)
		};
		document.onkeyup = function (b) {
			b = b || window.event;
			b = b.keyCode;
			37 == b ? keydown_left = !1 : 39 == b ? keydown_right = !1 : 38 == b || 32 == b ? (keydown_up = !1, setAcceleration(0)) : 16 == b && testing && (shifty = !1)
		};

		function loadSos(b) {
			server = "localhost";
			port = 8080;

			try {
				e = new WebSocket("ws://" + server + ":" + port);
			} catch (G) {
				e = null
			}
			e && (e.binaryType = "arraybuffer",
					e.onerror = function (b) {
					},
					e.onmessage = function (b) {
						b = new Uint8Array(b.data);
						if (1 == b.length && 112 == b[0]) {
							var e = Date.now() - c.stm;
							testing && console.log(" ping time for cluster " + b + ": " + e);
							c.ptms.push(e);
							if (4 > c.ptms.length)
								c.stm = Date.now();
							b = new Uint8Array(1);
							b[0] = 112;
							this.send(b);
						}
					}, e.onopen = function (b) {
				b = !1;
				for (var c =
						clus.length - 1; 0 <= c; c--) {
					var e = clus[c];
					if (e && e.ps == this) {
						e.stm = Date.now();
						b = new Uint8Array(1);
						b[0] = 112;
						this.send(b);
						b = !0;
						break
					}
				}
				b || this.close()
			}, w.ps = e)
		}

		var mba = null,
				mbi = null;

		UI.resize();
		resize();
		o = {
			f: function (b, f, c) {
				"success" == f && loadSos(b)
			}
		};


	}

	function start() {

	}

	GameClient.init = init;
	GameClient.run = run;
}

GameClient();
GameClient.init();
GameClient.run();