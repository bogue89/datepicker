if(typeof JBTools === 'undefined') {
	var JBTools = {
		hasClass: function(el,cls) {
			return !!el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
		},
		addClass: function(el,cls) {
			if (!JBTools.hasClass(el,cls)) el.className += " "+cls;
		},
		removeClass: function(el,cls) {
			if (JBTools.hasClass(el,cls)) {
				var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
				el.className=el.className.replace(reg,' ').trim();
			}
		},
		ucfirst: function(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		},
		each: function(arry, func) {
			for(var i=0; i<arry.length; i++) {
				func(arry[i], i);
			}
		},
		replaceIfMatched: function(str, regex, func) {
			if(str.match(regex)) {
				if(typeof func == "string") {
					str = str.replace(regex, func);
				} else {
					str = str.replace(regex, func());	
				}
			}
			return str;
		},
		create: function(htmlString) {
			var temp = document.createElement('div');
		    temp.innerHTML = htmlString.trim();
		    return temp.childNodes.length > 1 ? temp.childNodes:temp.firstChild;
		},
		insert: function(el, parent, position) {
			if(parent.childNodes.length>0 && position<parent.childNodes.length && position !== 'bottom') {
				if(position === 'top') {
					position = 0;
				}
				parent.insertBefore(el, parent.childNodes[position]);
			} else {
				parent.appendChild(el);
			}
			return el;
		},
		before: function(el, reference) {
			var parent = reference.parentNode;
			var position = Array.prototype.indexOf.call(parent.childNodes, reference) - 1;
			return JBTools.insert(el, parent, position>0 ? position:0);
		},
		after: function(el, reference) {
			var parent = reference.parentNode;
			var position = Array.prototype.indexOf.call(parent.childNodes, reference) + 1;
			return JBTools.insert(el, parent, position);
		},
		remove: function(el){
			var parent = el.parentNode;
			if(parent) {
				parent.removeChild(el);
			}
		},
		contains: function(el, target) {
			if(el == target) {
				return true;
			}
			if(target && JBTools.contains(el, target.parentNode)) {
				return true;
			}
			return false;
		},
		strip: function(html) {
		   var tmp = document.createElement("DIV");
		   tmp.innerHTML = html;
		   return tmp.textContent || tmp.innerText || "";
		},
		dateFormatOption: function(date, param, format, lang) {
			var options = {};
			options[param] = format;
			if(!(param=="weekday" || param=="year" || param=="month" || param=="day")) {
				options['year'] = 'numeric';
			}
			if(param == "hour" && format == "numeric") {
				options['hour12'] = true;
			} else if(param == "hour12") {
				options['hour'] = 'numeric';
				options['hour12'] = true;
			} else {
				options['hour12'] = false;
			}
			var value = date.toLocaleDateString(lang || "es-ES", options);
			if(param=="weekday" || param=="month") {
				value = JBTools.ucfirst(value);
			} else if(param == "hour" || param == "minute" || param == "second") {
				value = ("0"+value.split(" ")[1]).slice(-2);
			} else if(param == "hour12") {
				var parts = value.split(" ");
				var m = parts[2]+parts[3];
				value = format=="lower" ? m.toLowerCase():m.toUpperCase();
			} else if(param == "timeZoneName") {
				value = value.slice(5);
			}
			return value;
		},
		dateFormat: function(date, format, lang) {
			if(!format) {
				format = "%Y-%m-%d";
			}
			format = JBTools.replaceIfMatched(format, /\%j/g, function() {
				return date.getDate();
			});
			format = JBTools.replaceIfMatched(format, /\%d/g, function() {
				return ("0"+date.getDate()).slice(-2);
			});
			format = JBTools.replaceIfMatched(format, /\%D/g, function() {
				return JBTools.dateFormatOption(date,'weekday','narrow',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%l/g, function() {
				return JBTools.dateFormatOption(date,'weekday','short',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%L/g, function() {
				return JBTools.dateFormatOption(date,'weekday','long',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%n/g, function() {
				return date.getMonth()+1;
			});
			format = JBTools.replaceIfMatched(format, /\%m/g, function() {
				return ("0"+(date.getMonth()+1)).slice(-2);
			});
			format = JBTools.replaceIfMatched(format, /\%f/g, function() {
				return JBTools.dateFormatOption(date,'month','narrow',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%M/g, function() {
				return JBTools.dateFormatOption(date,'month','short',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%F/g, function() {
				return JBTools.dateFormatOption(date,'month','long',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%Y/g, function() {
				return date.getFullYear();
			});
			format = JBTools.replaceIfMatched(format, /\%y/g, function() {
				return ("0"+date.getFullYear()).slice(-2);
			});
			format = JBTools.replaceIfMatched(format, /\%h/g, function() {
				return JBTools.dateFormatOption(date,'hour','numeric',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%H/g, function() {
				return JBTools.dateFormatOption(date,'hour','2-digit',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%i/g, function() {
				return ("0"+date.getMinutes()).slice(-2);
			});
			format = JBTools.replaceIfMatched(format, /\%s/g, function() {
				return ("0"+date.getSeconds()).slice(-2);
			});
			format = JBTools.replaceIfMatched(format, /\%a/g, function() {
				return JBTools.dateFormatOption(date,'hour12', 'lower', lang);
			});
			format = JBTools.replaceIfMatched(format, /\%A/g, function() {
				return JBTools.dateFormatOption(date,'hour12', 'upper', lang);
			});
			format = JBTools.replaceIfMatched(format, /\%t/g, function() {
				return JBTools.dateFormatOption(date,'timeZoneName','short',lang);
			});
			format = JBTools.replaceIfMatched(format, /\%T/g, function() {
				return JBTools.dateFormatOption(date,'timeZoneName','long',lang);
			});
			return format;
		}
	}
}
if(typeof DatePickerJS === 'undefined') {
	var DatePickerJS = function(input, options = {}) {
		this.input = input;
		this.body = document.querySelector('body');
		var parse = Date.parse(input.value);
		this.date = options.date = !isNaN(parse) ? new Date(parse):new Date();
		if(!options.events) options.events = {};
		options.events.onDay = this.onDay.bind(this);
		options.events.loaded = this.loaded.bind(this);
		options.type = 'month';
		options.time = options.time || false;
		this.calendar = new CalendarJS(null, options);
		this.container = document.createElement('div');
		this.container.setAttribute('class', 'datepicker-container');
		this.container.setAttribute('tabindex', '-1');
		JBTools.insert(this.calendar.container, this.container)
		if(options.time) {
			options.events = Object.assign({}, options.events);
			options.events.title = function(cal, _date) {return '';};
			options.events.onControl = this.onTime.bind(this);
			options.type = 'clock';
			this.clock = new CalendarJS(null, options);	
			JBTools.insert(this.clock.container, this.container)
		}
		this.options = options;
		this.behaviour();	
	};
	DatePickerJS.prototype.loaded = function(cal,options) {
		var year = this.date.getFullYear();
		var month = this.date.getMonth()+1;
		var day = this.date.getDate();
		var el = cal.domElement.querySelector('.day[year="'+year+'"][month="'+month+'"][day="'+day+'"]');
		if(el) {
			JBTools.addClass(el, 'selected');
		}
	};
	DatePickerJS.prototype.onTime = function(cal, control) {
		var time = [];
		JBTools.each(cal.domElement.querySelectorAll('.clock-rows input'), function(input) {
			time.push(input.value);
		})
		self.date = new Date(self.date.getFullYear(),self.date.getMonth(),self.date.getDate(),time[0],time[1],time[2]||0);
		self.input.value = cal.format(self.date, cal.options.format);
		self.blur();
	};
	DatePickerJS.prototype.onDay = function(cal,day) {
		self = this;
		self.date = new Date(day.getAttribute('year'),day.getAttribute('month')-1,day.getAttribute('day'));
		JBTools.each(cal.domElement.querySelectorAll('.day.selected'), function(_day) {
			JBTools.removeClass(_day, 'selected');
		});
		JBTools.addClass(day, 'selected');
		if(!self.options.time) {
			self.input.value = cal.format(self.date, cal.options.format);
			self.blur();
		}
	};
	DatePickerJS.prototype.focus = function() {
		self = this;
		clearTimeout(self.timeout);
		setTimeout(function() {
			clearTimeout(self.timeout);
		}, 10);
	};
	DatePickerJS.prototype.blur = function(e) {
		self = this;
		JBTools.removeClass(self.container, 'focus');
		self.body.removeEventListener('click', self.clickOnBody, false);
		self.body.removeEventListener('keydown', self.keyOnBody, false);
		self.input.blur();
		self.timeout2 = setTimeout(function() {
			JBTools.addClass(self.container, 'hidden');
		}, self.options.hidden || 200);
	};
	DatePickerJS.prototype.inputFocus = function() {
		self = this;
		clearTimeout(self.timeout2);
		JBTools.removeClass(self.container, 'hidden');
		JBTools.addClass(self.container, 'focus');
		setTimeout(function(){		
			self.body.addEventListener('click', self.clickOnBody, false);
			self.body.addEventListener('keydown', self.keyOnBody, false);
		},100);
	};
	DatePickerJS.prototype.inputBlur = function() {
		self = this;
		clearTimeout(self.timeout);
		self.timeout = setTimeout(self.blur, 20);
	};
	DatePickerJS.prototype.keyOnBody = function (event) {
		self = this;
		if(event.key=='Escape') {
			self.inputBlur();
		}
	}
	DatePickerJS.prototype.clickOnBody = function (event) {
		self = this;
		if(event.target!=self.input && !JBTools.contains(self.container, event.target)) {
			self.inputBlur();
		}
	};
	DatePickerJS.prototype.behaviour = function() {
		var self = this;
		
		JBTools.addClass(self.container, 'hidden');
		JBTools.after(self.container, self.input);
		
		self.keyOnBody = self.keyOnBody.bind(self);
		self.clickOnBody = self.clickOnBody.bind(self);
		self.inputFocus = self.inputFocus.bind(self);
		self.inputBlur = self.inputBlur.bind(self);
		self.focus = self.focus.bind(self);
		self.blur = self.blur.bind(self);
		self.input.addEventListener('focus', self.inputFocus, true);
		self.input.addEventListener('blur', self.inputBlur, true);
		
		self.container.addEventListener('focus', self.focus, false);
		self.container.addEventListener('click', self.focus, false);
		JBTools.each(self.container.querySelectorAll('button, input'), function(focusable, f){
			focusable.addEventListener('focus', self.focus, false);
			focusable.addEventListener('blur', self.inputBlur, false);
		});
	};
}
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
if(typeof CalendarJS !== 'undefined') {
	if(typeof CalendarJS.Month === 'undefined') {
		CalendarJS.prototype.Month = function(date) {
			const self 		= this;
			const monthDate = new Date(date);
			const today 	= self.format(new Date(),'%Y-%n-%j');
			
			var startsMonday 	= (self.options.startsOnMonday===true ? (date.getDay()==0 ? -6:1):0);
			var weekend			= (self.options.weekend===0 ? 0:(self.options.weekend===1 ? 1:2));
			
			var titleEvent = self.event('title',[self,date],function(calendar, _date){ return self.format(_date, '%F') });
			var leftControlEvent = self.event('controlLeft',[self,date],function(calendar, _date){ return '<button type="button" class="control-left '+self.options.controlsClass+'">«</button>' });
			var rightControlEvent = self.event('controlRight',[self,date],function(calendar, _date){ return '<button type="button" class="control-right '+self.options.controlsClass+'">»</button>' });
			var thead = '<tr><th>'+leftControlEvent+'</th><th class="title" colspan="'+(3 + weekend)+'">'+titleEvent+'</th><th>'+rightControlEvent+'</th></tr>';
			var tbody = '';
			
			monthDate.setDate(1);
			var daytime = 24000 * 3600;
			var dateDay = monthDate.getDay();
			var dateTime = monthDate.getTime();
			
			var weekdays = [];
			
			tbody += '<tr>';
			for(var weekDayNumber = 0; weekDayNumber<7; weekDayNumber++) {
				var saturday 	= startsMonday===0 ? 6:5;
				var sunday 		= startsMonday===0 ? 0:6;
				if(weekDayNumber==sunday && weekend<2) {
					continue;
				}
				if(weekDayNumber==saturday && weekend<1) {
					continue;
				}
				var diff = weekDayNumber - dateDay + startsMonday;
				var time = dateTime + (diff * daytime);
				monthDate.setTime(time);
				weekdays.push(monthDate.getDate());
				var dayEvent = self.event('day',[self,monthDate],function(calendar,_date){ return self.format(_date, "%l") });
				tbody += '<th class="day'+(diff===0 ? " today":"")+'">'+dayEvent+'</th>';
			}
			tbody += '</tr>';

			var weekDayNumber = weekdays.length-1;

			var day 	= weekdays[weekDayNumber] > 15 ? (dateDay==0 ? 2:3):0;
			var month 	= date.getMonth()+1;//<- we increase to get last day, and also user readability
			var year 	= date.getFullYear();

			monthDate.setMonth(month);
			monthDate.setDate(0);

			var lastDay = monthDate.getDate();
			var lastWeekDay = weekdays[weekdays.length-1];
			
			var backup = 0;
			while(day < lastDay) {
				tbody += '<tr>';
				for(var weekDayNumber=0; weekDayNumber<weekdays.length;weekDayNumber++) {
					var weekday = weekdays[weekDayNumber];
					var _day = day > 0 ? day:weekday;
					if(day < 1 && _day > 15) {
						var _month = month-1;
						var _year  = year;
						if(_month<1) {
							_month = 12;
							_year -= 1;
						}
						let dayEvent = self.event('day',[self,_year,_month,_day, false],function(cal,_y,_m,_d,_c){ return '' });
						tbody += '<td class="day" day="'+_day+'" month="'+_month+'" year="'+_year+'">'+dayEvent+'</td>';
					} else if(_day <= lastDay) {
						let dayEvent = self.event('day',[self,year,month,_day, true],function(cal,_y,_m,_d,_c){ return _d });
						tbody += '<td class="day'+(today==(year+'-'+month+'-'+_day) ? ' today':'')+'" current day="'+_day+'" month="'+month+'" year="'+year+'">'+dayEvent+'</td>';
					} else {
						_day -= lastDay;
						var _month = month+1;
						var _year  = year;
						if(_month>12) {
							_month = 1;
							_year += 1;
						}
						let dayEvent = self.event('day',[self,_year,_month,_day, false],function(cal,_y,_m,_d){ return '' });
						tbody += '<td class="day" day="'+_day+'" month="'+_month+'" year="'+_year+'">'+dayEvent+'</td>';
					}
					// day adjusts
					if(day>0) {
						day += 1;
					}
				}
				tbody += '</tr>';
				if(day<1) {
					day = lastWeekDay+1;
				}
				
				day += 2-weekend;

				backup += 1;
				if(backup > 300) {
					break;
				}
			}
			self.domElement = JBTools.create('<table class="calendar-js calendar-'+self.options.type+'-js"><thead>'+thead+'<thead><tbody>'+tbody+'</tbody></table>');
			self.container.innerHTML = '';
			JBTools.insert(self.domElement, self.container);
			JBTools.each(self.domElement.querySelectorAll('td.day'), function(day, d) {
				day.addEventListener('click', function(e) {
					self.event('onDay',[self,day],function(cal,_day) {
						if(JBTools.hasClass(_day, 'selected')) {
							JBTools.removeClass(_day, 'selected');
						} else {
							JBTools.addClass(_day, 'selected');
						}
					})
				}, false);
			});
			var control;
			control = self.domElement.querySelector('.control-left');
			if(control) {
				control.addEventListener('click', function(e) {
					self.event('onControlLeft',[self,control],function(cal,_control) {
						cal.options.date.setMonth(cal.options.date.getMonth() - 1);
						cal.setDate(cal.options.date);
					})
				}, false);
			}
			control = self.domElement.querySelector('.control-right');
			if(control) {
				control.addEventListener('click', function(e) {
					self.event('onControlRight',[self,control],function(cal,_control) {
						cal.options.date.setMonth(cal.options.date.getMonth() + 1);
						cal.setDate(cal.options.date);
					})
				}, false);
			}
		}
	}
}
if(typeof CalendarJS !== 'undefined') {
	if(typeof CalendarJS.Week === 'undefined') {
		CalendarJS.prototype.Week = function(date) {
			const self			= this;
			const weekDate 		= new Date(date);
			const today 		= self.format(new Date(),'%Y-%m-%d');
			
			var startsMonday 	= (self.options.startsOnMonday===true ? (date.getDay()==0 ? -6:1):0);
			var weekend			= (self.options.weekend===0 ? 0:(self.options.weekend===1 ? 1:2));
			var indicators		= self.options.timespanIndicatos === true;
			
			var titleEvent = self.event('title',[self,weekDate],function(calendar, _date){ return self.format(_date, '%F') });
			var leftControlEvent = self.event('controlLeft',[self,weekDate],function(calendar, _date){ return '<button type="button" class="control-left '+self.options.controlsClass+'">«</button>' });
			var rightControlEvent = self.event('controlRight',[self,weekDate],function(calendar, _date){ return '<button type="button" class="control-right '+self.options.controlsClass+'">»</button>' });
			var thead = '<tr>'+(indicators ? '<th></th>':'')+'<th>'+leftControlEvent+'</th><th class="title" colspan="'+(3 + weekend)+'">'+titleEvent+'</th><th>'+rightControlEvent+'</th></tr>';
			var tbody = '';
			
			var daytime = 24000 * 3600;
			var dateDay = date.getDay();
			var dateTime = date.getTime();
			
			var weekdays = [];
			
			tbody += '<tr>';
			if(indicators) {
				tbody += '<th></th>';
			}
			for(var weekDayNumber = 0; weekDayNumber<7; weekDayNumber++) {
				var saturday 	= startsMonday===0 ? 6:5;
				var sunday 		= startsMonday===0 ? 0:6;
				if(weekDayNumber==sunday && weekend<2) {
					continue;
				}
				if(weekDayNumber==saturday && weekend<1) {
					continue;
				}
				var diff = weekDayNumber - dateDay + startsMonday;
				var time = dateTime + (diff * daytime);
				weekDate.setTime(time);
				weekdays.push(self.format(weekDate, "%Y-%m-%d"));
				var dayEvent = self.event('day',[self,weekDate],function(calendar,_date){ return self.format(_date, "%l %d") });
				tbody += '<th class="day'+(diff===0 ? " today":"")+'">'+dayEvent+'</th>';
			}
			tbody += '</tr>';
			
			var starts 			= self.options.starts || (0 * 3600);
			var ends 			= self.options.ends || (24 * 3600);
			var block			= self.options.timespan || 3600;
			
			while(starts < ends) {	
				tbody += '<tr>';
				if(indicators) {
					var indicatorEvent = self.event('indicator',[self,starts,(starts+block)],function(calendar,_starts,_ends){ return self.time2Human(_starts) });
					tbody += '<td class="indicator">'+indicatorEvent+'</td>';
				}
				for(var weekDayNumber=0; weekDayNumber<weekdays.length; weekDayNumber++) {
					var dayTimespan = self.event('timespan',[self,weekdays[weekDayNumber],starts,(starts+block)],function(calendar,_day,_starts,_ends){ return _day });
					var dayDate = weekdays[weekDayNumber];
					tbody += '<td class="timespan'+(dayDate==today ? " today":"")+'" date="'+dayDate+'" starts="'+(starts)+'" ends="'+(starts+block)+'">'+dayTimespan+'</td>';
				}
				tbody += '</tr>';
				starts += block;
			}
			self.domElement = JBTools.create('<table class="calendar-js calendar-'+self.options.type+'-js"><thead>'+thead+'<thead><tbody>'+tbody+'</tbody></table>');
			self.container.innerHTML = '';
			JBTools.insert(self.domElement, self.container);
			var control;
			control = self.domElement.querySelector('.control-left');
			if(control) {
				control.addEventListener('click', function(e) {
						self.event('onControlLeft',[self,control],function(cal,_control) {
						cal.options.date.setDate(cal.options.date.getDate() - 7);
						cal.setDate(cal.options.date);
					})
				}, false);
			}
			control = self.domElement.querySelector('.control-right');
			if(control) {
				control.addEventListener('click', function(e) {
						self.event('onControlRight',[self,control],function(cal,_control) {
						cal.options.date.setDate(cal.options.date.getDate() + 7);
						cal.setDate(cal.options.date);
					})
				}, false);
			}
		}
	}
}
if(typeof CalendarJS !== 'undefined') {
	if(typeof CalendarJS.Day === 'undefined') {
		CalendarJS.prototype.Day = function(date) {
			const self			= this;
			const dayDate 		= new Date(date);
			const today 		= self.format(new Date(),'%Y-%m-%d');
			var indicators		= self.options.timespanIndicatos === true;
			
			var titleEvent = self.event('title',[self,dayDate],(calendar, _date) => self.format(_date, '%l %d'));
			var leftControlEvent = self.event('controlLeft',[self,dayDate],(calendar, _date) => '<button type="button" class="control-left '+self.options.controlsClass+'">&lt;</button>');
			var rightControlEvent = self.event('controlRight',[self,dayDate],(calendar, _date) => '<button type="button" class="control-right '+self.options.controlsClass+'">&gt;</button>');
			var thead = '<tr>'+(indicators ? '<th></th>':'')+'<th>'+leftControlEvent+'</th><th class="title">'+titleEvent+'</th><th>'+rightControlEvent+'</th></tr>';
			var tbody = '';
			
			var daytime = 24000 * 3600;
			var dateDay = self.format(dayDate, '%Y-%m-%d');
			var dateTime = date.getTime();
						
			var starts 			= self.options.starts || (0 * 3600);
			var ends 			= self.options.ends || (24 * 3600);
			var block			= self.options.timespan || 3600;
			
			while(starts < ends) {	
				tbody += '<tr>';
				if(indicators) {
					var indicatorEvent = self.event('indicator',[self,starts,(starts+block)],(calendar,_starts,_ends) => self.time2Human(_starts));
					tbody += '<td class="indicator">'+indicatorEvent+'</td>';
				}
				var dayTimespan = self.event('timespan',[self,dateDay,starts,(starts+block)],(calendar,_day,_starts,_ends) => _day);
				tbody += '<td colspan="3" class="timespan'+(dateDay==today ? " today":"")+'" date="'+dateDay+'" starts="'+(starts)+'" ends="'+(starts+block)+'">'+dayTimespan+'</td>';
					
				tbody += '</tr>';
				starts += block;
			}
			self.domElement = JBTools.create('<table class="calendar-js calendar-'+self.options.type+'-js"><thead>'+thead+'<thead><tbody>'+tbody+'</tbody></table>')
			self.container.innerHTML = '';
			JBTools.insert(self.domElement, self.container);
			var control;
			control = self.domElement.querySelector('.control-left');
			if(control) {
				control.addEventListener('click', (e) => {
						self.event('onControlLeft',[self,control],(cal,_control) => {
						cal.options.date.setDate(cal.options.date.getDate() - 1);
						cal.setDate(cal.options.date);
					})
				}, false);
			}
			control = self.domElement.querySelector('.control-right');
			if(control) {
				control.addEventListener('click', (e) => {
						self.event('onControlRight',[self,control],(cal,_control) => {
						cal.options.date.setDate(cal.options.date.getDate() + 1);
						cal.setDate(cal.options.date);
					})
				}, false);
			}
		}
	}
}
if(typeof CalendarJS !== 'undefined') {
	if(typeof CalendarJS.Clock === 'undefined') {
		CalendarJS.prototype.Clock = function(date) {
			const self		= this;
			const clockDate = new Date(date);
			
			var hour12		= self.options.hour12;
			var seconds		= self.options.seconds;
			
			var titleEvent = self.event('title',[self,clockDate],function(calendar, _date){ return self.format(_date, '%l %d') });
			
			var thead = '<th class="title" colspan="5">'+titleEvent+'</th>';
			var tbody = '';
			
			tbody += '<tr class="clock-rows">';
			if(seconds) {
				tbody += '<td class="hours"><input size="2" value="'+self.format(clockDate, '%H')+'"></td>';
				tbody += '<td>:</td>';
				tbody += '<td class="minutes"><input size="2" value="'+self.format(clockDate, '%i')+'"></td>';
				tbody += '<td>:</td>';
				tbody += '<td class="seconds"><input size="2" value="'+self.format(clockDate, '%s')+'"></td>';
			} else {
				tbody += '<td class="hours" colspan="2"><input size="2" value="'+self.format(clockDate, '%H')+'"></td>';
				tbody += '<td>:</td>';
				tbody += '<td class="minutes" colspan="2"><input size="2" value="'+self.format(clockDate, '%i')+'"></td>';
			}
			tbody += '</tr>';
			
			var controlEvent = self.event('control',[self,clockDate],function(calendar, _date){ return '<button type="button" class="control '+self.options.controlsClass+'">OK</button>' });
			if(controlEvent > "") {			
				tbody += '<tr>';	
				tbody += '<td colspan="5">'+controlEvent+'</td>';
				tbody += '</tr>';
			}
			
			self.container.innerHTML = '';
			self.domElement = JBTools.insert(JBTools.create('<table class="calendar-js calendar-'+self.options.type+'-js"><thead>'+thead+'<thead><tbody>'+tbody+'</tbody></table>'), self.container);
			var inputs = self.domElement.querySelectorAll('.clock-rows input');
			JBTools.each(inputs, function(input, i) {
				self.doubleDigits(input, i==0 ? 23:59, function() {
					JBTools.each(inputs, function(_input, _i) {
						if(_i == 0) {
							clockDate.setHours(parseInt(_input.value))
						} else if(_i == 1) {
							clockDate.setMinutes(parseInt(_input.value))
						} else if(_i == 2) {
							clockDate.setSeconds(parseInt(_input.value))
						}
					});
					self.event('onChange',[self,clockDate],function(calendar, _date){})
				});
			});	
		
			var control;
			control = self.domElement.querySelector('.control');
			if(control) {
				control.addEventListener('click', function(e){
					return self.event('onControl',[self,control], function(cal,_control){ return false })
				}, false);
			}
		}
	}
}