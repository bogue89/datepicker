if(typeof CalendarJS === 'undefined') {
	var CalendarJS = function(container, options = {}) {
		this.container 	= null;
		this.domElement = null;
		this.options	= {
			debug: options.debug || false,
			date: options.date || new Date(),
			format: options.format || '%Y-%m-%d %H:%i:%s',
			lang: options.lang || "es-Es",
			type: options.type || "month",
			containerClass: options.containerClass || "calendarjs-container",
			controlsClass: options.controlsClass || "calendarjs-control",
			events: options.events || {},
			startsOnMonday: options.startsOnMonday || true,
			weekend: options.weekend,
			starts: this.clock2Time(options.starts),
			ends: this.clock2Time(options.ends),	
			timespan: this.clock2Time(options.timespan),
			timespanIndicatos: options.timespanIndicatos || true,
			hour12: options.hour12===true,
			seconds: options.seconds===true,
		};
		this.timeMarks = [
			{time: 604800, suffix: 'w'},
			{time: 86400, suffix: 'd'},
			{time: 3600, suffix: 'h'},
			{time: 60, suffix: 'm'},
			{time: 1, suffix: 's'}
		];
		if(container) {
			if(typeof container == "string") {
				this.container = document.querySelector(container);
			} else {
				this.container = container;
			}
		} else {
			this.container = document.createElement('div');
			this.container.setAttribute('class', this.options.containerClass);
		}
		this.setDate(this.options.date);
	}
	CalendarJS.prototype.format = function(date, format) {
		return JBTools.dateFormat(date, format, this.options.lang)
	}
	CalendarJS.prototype.event = function(name, params, func) {
		if(this.options.events[name]) {
			return this.options.events[name].apply(name, params);
		} else {
			return func.apply(name, params);
		}
	}
	CalendarJS.prototype.time2Human = function(time) {
		time = parseInt(time) || 0;
		var human = "";
		JBTools.each(this.timeMarks, function(timeMark, tm) {
			var value = Math.floor(time / timeMark.time);
			time %= timeMark.time;
			if(value > 0 || (timeMark.suffix=="s" && human=="")) {
				human += (" "+value+timeMark.suffix);
			}
		});
		return human.trim();
	}
	CalendarJS.prototype.time2Clock = function(time, seconds=true) {
		time = parseInt(time) || 0;
		var clock = [];
		JBTools.each([3600,60], function(mark, m) {
			var value = Math.floor(time / mark);
			time %= mark;
			clock.push(("0"+value).slice(-2));
		});
		if(seconds) {
			clock.push(("0"+time).slice(-2));
		}
		return clock.join(':');
	}
	CalendarJS.prototype.human2Time = function(human) {
		var time = 0;
		JBTools.each(this.timeMarks, function(timeMark, tm) {
			var regex = new RegExp('(\\d+)'+timeMark.suffix,'i');
			var matches = regex.exec(human);
			if(matches) {
				time += parseInt(matches[1] * timeMark.time) || 0;	
			}
		})
		return time;
	}
	CalendarJS.prototype.clock2Time = function(clock, seconds=true) {
		var time = 0;
		if(typeof clock === 'string') {
			var time = 0;
			var parts = clock.split(':');
			var marks = [3600,60,1];
			JBTools.each(parts, function(part, m) {
				if(marks[m]) {
					time += part*marks[m];
				}
			});
		} else {
			time = parseInt(clock) || 0;
		}
		return time;
	}
	CalendarJS.prototype.doubleDigits = function(input, limit, change) {
		input.addEventListener('focus', function() {
			if(this.select) {
				this.select();
			} else if(this.setSelectionRange) {
				this.setSelectionRange(0, this.value.length)
			}
		}, false);
		input.addEventListener('change', function() {
			this.value = parseInt(this.value) || 0 + 0;
			this.value = this.value < 0 ? 0:this.value;
			this.value = this.value > limit ? limit:this.value;
			this.value = ("0"+this.value).slice(-2);
			change();
		}, false);
		input.addEventListener('keydown', function(e) {
			if(e.key == 'Enter') {
				e.preventDefault();
				change();
				if("createEvent" in document) {
				    var evt = document.createEvent("HTMLEvents");
				    evt.initEvent("change", false, true);
				    input.dispatchEvent(evt);
				} else {
				    input.fireEvent("onchange");
				}
			}
		}, false);
	}
	CalendarJS.prototype.setDate = function(date) {
		this.options.date = new Date(date);
		if(this.options.debug) {
			var t1 = performance.now();	
		}
		if(this.options.type == "clock") {
			this.Clock(date);
		} else if(this.options.type == "day") {
			this.Day(date);
		} else if(this.options.type == "week") {
			this.Week(date);
		} else if(this.options.type == "month") {
			this.Month(date);
		}
		if(this.options.debug) {
			var t2 = performance.now();
			console.log(t2-t1);
		}
		this.event('loaded',[this,this.options],function(calendar,_options){})
	}
}