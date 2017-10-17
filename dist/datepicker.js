var JBTools = {};
JBTools.initialize = function(obj, options) {
	obj.options = options || {};
	obj.events = obj.options.events || {};
	obj.JBEvent = function(name, params, func) {
		if(obj.events[name]) {
			return obj.events[name].apply(name, params);
		} else {
			return func.apply(name, params);
		}
	};
	return obj;
}
JBTools.hasClass = function(el,cls) {
	return !!el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
JBTools.addClass = function(el,cls) {
	if (!JBTools.hasClass(el,cls)) el.className += " "+cls;
}
JBTools.removeClass = function(el,cls) {
	if (JBTools.hasClass(el,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		el.className=el.className.replace(reg,' ').trim();
	}
}
JBTools.ucfirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
JBTools.each = function(arry, func) {
	for(var i=0; i<arry.length; i++) {
		func(arry[i], i);
	}
};
JBTools.replaceIfMatched = function(str, regex, func) {
	if(str.match(regex)) {
		if(typeof func == "string") {
			str = str.replace(regex, func);
		} else {
			str = str.replace(regex, func());	
		}
	}
	return str;
};
JBTools.create = function(htmlString) {
	var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlString;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
};
JBTools.insert = function(el, parent) {
	if(parent != el.parentNode) {
		if(parent.childNodes.length) {
		    parent.insertBefore(el, parent.childNodes[parent.childNodes.length-1].nextSibling);
	    } else {
			parent.insertBefore(el, parent.childNodes[0]);   
	    }
	}
	return parent.childNodes[0];
};
JBTools.remove = function(el){
	var parent = el.parentNode;
	if(parent) {
		parent.removeChild(el);
	}
};
JBTools.dateFormatOption = function(date, param, format, lang) {
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
}
JBTools.dateFormat = function(date, format, lang) {
	if(!format) {
		format = "%Y-%m-%d";
	}
	format = JBTools.replaceIfMatched(format, /\%j/g, function() {
		return JBTools.dateFormatOption(date, 'day','numeric',lang);
	});
	format = JBTools.replaceIfMatched(format, /\%d/g, function() {
		return JBTools.dateFormatOption(date,'day','2-digit',lang);
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
		return JBTools.dateFormatOption(date,'month','numeric',lang);
	});
	format = JBTools.replaceIfMatched(format, /\%m/g, function() {
		return JBTools.dateFormatOption(date,'month','2-digit',lang);
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
		return JBTools.dateFormatOption(date,'year','numeric',lang);
	});
	format = JBTools.replaceIfMatched(format, /\%y/g, function() {
		return JBTools.dateFormatOption(date,'year','2-digit',lang);
	});
	format = JBTools.replaceIfMatched(format, /\%h/g, function() {
		return JBTools.dateFormatOption(date,'hour','numeric',lang);
	});
	format = JBTools.replaceIfMatched(format, /\%H/g, function() {
		return JBTools.dateFormatOption(date,'hour','2-digit',lang);
	});
	format = JBTools.replaceIfMatched(format, /\%i/g, function() {
		return JBTools.dateFormatOption(date,'minute','2-digit',lang);
	});
	format = JBTools.replaceIfMatched(format, /\%s/g, function() {
		return JBTools.dateFormatOption(date,'second','2-digit', lang);
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
};
Date.prototype.JBFormat = function(format, lang) {
	return JBTools.dateFormat(this, format, lang);
};
var JBCalendar = function(container, options) {
	var self = JBTools.initialize(this, options);
	self.today = new Date();
	self.container = null;
	self.domElement = null;
	self.date = self.options.date && typeof self.options.date == "object" ? new Date(self.options.date):new Date();
	self.options.startsOnMonday = self.options.startsOnMonday===false ? 0:1;
	self.options.lang = self.options.lang || "es-ES";
	
	if(container) {
		if(typeof container == "string") {
			self.container = document.querySelector(container);
		} else {
			self.container = container;
		}
	} else {
		self.container = document.createElement('div');
		self.container.setAttribute('class', 'datepicker-calendar');
	}
	self.container.setAttribute('tabindex', '-1');
	
	self.setDate(self.date, self.options.selected || []);
	
	return self;
}
JBCalendar.prototype.setDate = function(date, selected) {
	var self = this;
	self.date = new Date(date);
	self.container.innerHTML = "";
	
	var tablebody = "";
	var monthNumber = date.getMonth();
	var dayInc = 1;
	
	tablebody += '<tr class="calendar-header">';
	tablebody += '<th class="control control-left"><span>'+self.JBEvent("controlLeft", [self, monthNumber, new Date(date)], function(cal, n, d) {
		n = n<1 ? 11:n-1;
		var d = new Date(d);
		d.setDate(1);
		d.setMonth(n);
		return '<button month="'+n+'" type="button">'+d.JBFormat("%M")+'</button>';
	})+'</span></th>';
	tablebody += '<th colspan="5"><span>'+self.JBEvent("monthLabel", [self, monthNumber, new Date(date)], function(cal, n, d) { return d.JBFormat("%F", cal.options.lang); })+'</span></th>';
	tablebody += '<th class="control control-right"><span>'+self.JBEvent("controlRight", [self, monthNumber, new Date(date)], function(cal, n, d) {
		n = n>10 ? 0:n+1;
		var d = new Date(d);
		d.setDate(1);
		d.setMonth(n);
		return '<button month="'+n+'" type="button">'+d.JBFormat("%M")+'</button>';
	})+'</span></th>';
	tablebody += '</tr>';
	
	var daysorder = [];
	
	tablebody += '<tr class="calendar-weekdays">';
	for(var i = 0; i < 7; i++) {
		var dn = i + self.options.startsOnMonday;
		if(dn>6) {
			dn-=7;
		}
		daysorder.push(dn);
		var dayLabel = self.JBEvent('dayLabel',[self,dn,new Date(date)],function(cal, n, d){ 
			var r = d.getDay(), d = new Date(d);
			d.setDate(d.getDate() + (n-r));
			return d.JBFormat("%l",cal.options.lang); 
		});
		tablebody += '<th title="'+dayLabel+'"><span>'+dayLabel+'</span></th>';
	}
	tablebody += '</tr>';
	
	date.setDate(dayInc);
	while(monthNumber == date.getMonth()) {
		tablebody += '<tr class="week">';
		for(var dn = 0; dn < 7; dn++) {
			if(daysorder[dn] == date.getDay() && monthNumber == date.getMonth()) {
				var tdDay = 'day="'+dayInc+'" month="'+date.getMonth()+'" year="'+date.getFullYear()+'"><span>'+self.JBEvent('dateLabel',[self,dayInc,new Date(date)],function(cal, n, d){ return n; })+'</span></td>';
				var dateClass = date.JBFormat('%Y-%m-%d')==self.today.JBFormat('%Y-%m-%d') ? 'day today':'day';
				JBTools.each(selected, function(selectedDate, sdi){
					if(date.JBFormat('%Y-%m-%d')==selectedDate.JBFormat('%Y-%m-%d')) {
						dateClass += " selected";
					}
				});
				tablebody += '<td class="'+dateClass+'" '+tdDay;
				dayInc++;
				date.setDate(dayInc);
			} else {
				var dw = daysorder.indexOf(date.getDay());
				var _date = new Date(date);
				var dayOth = 0;
				if(dayInc==1) {
					dayOth = (dn-dw+dayInc);
				} else {
					dayOth = (dn-dw+1);
				}
				_date.setDate(dayOth);
				tablebody += '<td class="empty"><span>'+self.JBEvent('emptyLabel',[self,_date.getDate(),new Date(_date)],function(cal, n, d){ return "&nbsp;"; })+'</span></td>';
			}
		}
		tablebody += '</tr>';
	}
	
	self.domElement = JBTools.insert(JBTools.create('<table class="jb-calendar">'+tablebody+'</table>'), self.container);
	
	if(self.container) {
		JBTools.each(self.domElement.querySelectorAll('td.day'), function(day, i){
			self.dayEvent(self, day, i);
		});
		JBTools.each(self.domElement.querySelectorAll('th.control'), function(button, i){
			self.controlEvent(self, button, i);
		});
	}
};
JBCalendar.prototype.dayEvent = function(_cal, day, i) {
	var cls = _cal.options.selectionClass || "selected";
	day.addEventListener('click', function() {
		if(!JBTools.hasClass(day, cls)) {
			JBTools.addClass(day, cls);
			_cal.JBEvent('daySelected',[_cal, day.getAttribute('day'), new Date(_cal.date)], function(cal, n, d){
				d.setDate(n);
			});
		} else {
			JBTools.removeClass(day, cls);
			_cal.JBEvent('dayDeselected',[_cal, day.getAttribute('day'), new Date(_cal.date)], function(cal, n, d){
				d.setDate(n);
			});
		}
	}, false);
}
JBCalendar.prototype.controlEvent = function(_cal, button, i) {
	button.addEventListener('click', function() {
		_cal.JBEvent('controlPressed',[_cal, button, new Date(_cal.date)], function(cal, b, d){
			var b = b.querySelector('[month]');
			if(b) {
				var month = parseInt(b.getAttribute('month'));
				var year  = cal.date.getFullYear();
				if(cal.date.getMonth()>10 && month==0) {
					year += 1;	
				} else if(cal.date.getMonth()<1 && month==11) {
					year -= 1;
				}
				cal.date.setFullYear(year, month, 1);
				cal.setDate(cal.date, _cal.options.selected || []);
			}
		});
	}, false);
}
var JBClock = function(container, options) {
	var self = JBTools.initialize(this, options);
	self.today = new Date();
	self.container = null;
	self.domElement = null;
	self.date = self.options.date && typeof self.options.date == "object" ? new Date(self.options.date):new Date();
	self.options.hour12 = self.options.hour12===true ? true:false;
	self.options.seconds = self.options.seconds===true ? true:false;
	self.options.lang = self.options.lang || "es-ES";

	if(container) {
		if(typeof container == "string") {
			self.container = document.querySelector(container);
		} else {
			self.container = container;
		}
	} else {
		self.container = document.createElement('div');
		self.container.setAttribute('class', 'datepicker-clock');
	}
	self.container.setAttribute('tabindex', '-1');
	
	self.setDate(self.date);
	
	return self;
}
JBClock.prototype.setDate = function(date) {
	var self = this;
	self.date = new Date(date);
	self.container.innerHTML = "";
	
	var tablebody = "";
		
	tablebody += '<tr class="clock-header">';
	tablebody += '<th colspan="7">'+self.JBEvent('dateLabel',[self,date],function(clk, d){
		return d.JBFormat("%d de %F, %Y", clk.options.lang);
	})+'</th>';
	tablebody += '</tr>';
	
	tablebody += '<tr class="clock-rows">';
	if(self.options.seconds) {
		tablebody += '<td></td>';
		tablebody += '<td class="hours"><input size="2" value="'+self.date.JBFormat('%H')+'"></td>';
		tablebody += '<td>:</td>';
		tablebody += '<td class="minutes"><input size="2" value="'+self.date.JBFormat('%i')+'"></td>';
		tablebody += '<td>:</td>';
		tablebody += '<td class="seconds"><input size="2" value="'+self.date.JBFormat('%s')+'"></td>';
		tablebody += '<td></td>';
	} else {
		tablebody += '<td colspan="2"></td>';
		tablebody += '<td class="hours"><input size="2" value="'+self.date.JBFormat('%H')+'"></td>';
		tablebody += '<td>:</td>';
		tablebody += '<td class="minutes"><input size="2" value="'+self.date.JBFormat('%i')+'"></td>';
		tablebody += '<td colspan="2"></td>';
	}
	tablebody += '</tr>';
	
	tablebody += '<tr class="clock-rows">';
	tablebody += '<td colspan="7"><button type="button">'+self.JBEvent('setButton',[self,date],function(){
		return 'OK';
	})+'</button></td>';
	tablebody += '</tr>';
	
	
	self.domElement = JBTools.insert(JBTools.create('<table class="jb-clock">'+tablebody+'</table>'), self.container);
	if(self.container) {
		JBTools.each(self.domElement.querySelectorAll('input'), function(input, i){
			self.doubleDigits(input, i==0 ? 23:59);
		});
		JBTools.each(self.domElement.querySelectorAll('button'), function(button, i){
			self.buttonPressed(self, button);
		});
	}
};
JBClock.prototype.doubleDigits = function(input, limit) {
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
	}, false);
};
JBClock.prototype.buttonPressed = function(clock, button) {
	button.addEventListener('click', function() {
		var hours = clock.domElement.querySelector('.hours input');
		var minutes = clock.domElement.querySelector('.minutes input');
		var seconds = clock.domElement.querySelector('.seconds input');
		if(hours && minutes) {
			var date = new Date(clock.date);
			date.setHours(hours.value);
			date.setMinutes(minutes.value);
			date.setSeconds(seconds ? seconds.value: 0);
			clock.JBEvent('timeChanged',[clock, date],function(clk, d){
				console.log(d.JBFormat("%H:%i:%s %a", clk.options.lang));
			});
		}
	}, false);
};
var JBDatePicker = function(input, options) {
	var self = JBTools.initialize(this, options);
	self.container = null;
	self.input = input;
	self.type = self.options.time === false ? 'date':'datetime';
	var mili = self.input && self.input.value != "" ? Date.parse(self.input.value):0;
	self.date = mili > 0 ? new Date(mili):new Date();
	self.date = self.options.date && typeof self.options.date == "object" ? new Date(self.options.date):self.date;
	
	if(self.options.container) {
		if(typeof self.options.container == "string") {
			self.container = document.querySelector(self.options.container);
		} else {
			self.container = self.options.container;
		}
	} else {
		self.container = document.createElement('div');
		self.container.setAttribute('class', 'datepicker-container');
	}
	self.container.setAttribute('tabindex', '-1');
	
	self.options.events = self.events;
	self.options.date = self.date;
	self.options.selected = [
		self.options.date
	];
	
	if(self.options.hidden !== false) {
		self.close = document.createElement('button');
		self.close.setAttribute('class', 'datepicker-close');
		self.close.setAttribute('type', 'button');
		self.close.innerHTML = self.JBEvent('closeLabel', [], function(){
			return "x";
		});
		self.close.addEventListener('click', function() {
			JBTools.remove(self.container);
		}, false);
		JBTools.insert(self.close, self.container);
	}
	
	self.options.events.daySelected = function(cal, n, d) {
		cal.date.setDate(n);
		JBTools.each(cal.container.querySelectorAll('.day.selected'), function(selectedDay, i) {
			if(selectedDay.getAttribute('day') != n) {
				JBTools.removeClass(selectedDay, 'selected');
			}
		});
		if(self.type == "datetime") {
			self.clock.setDate(cal.date);
		} else {
			self.setInputDate(cal.date.JBFormat(self.options.format, cal.options.lang));
			if(self.options.hidden !== false) {
				JBTools.remove(self.container);	
			}
		}
	}

	self.calendar = new JBCalendar(null, self.options);
	JBTools.insert(self.calendar.container, self.container);
	
	if(self.type == "datetime") {
		self.options.events.timeChanged = function(clk, d) {
			self.calendar.date = new Date(d);
			self.setInputDate(d.JBFormat(self.options.format, clk.options.lang));
			if(self.options.hidden !== false) {
				JBTools.remove(self.container);	
			}
		};
		
		self.clock = new JBClock(null, self.options);	
		JBTools.insert(self.clock.container, self.container);
	}
	if(self.options.hidden === false) {
		self.alwaysFocus();
	} else {
		self.stepsFocus();
	}
	return self;
};
JBDatePicker.prototype.setInputDate = function(formatted) {
	if(this.input) {
		this.input.value = formatted;
	}	
};
JBDatePicker.prototype.stepsFocus = function() {
	var self = this;
	
	var timeout = null;
	
	var focus = function(e) {
		if(e)e.stopPropagation();
		clearTimeout(timeout);	
	};
	var blur = function(e) {
		timeout = setTimeout(function() {
			JBTools.remove(self.container);
		}, 10);		
	};
	self.input.addEventListener('focus', function(e){
		focus(e);
		JBTools.insert(self.container, self.input.parentNode);
	}, true);
	self.input.addEventListener('blur', blur, true);
	self.container.addEventListener('focus', focus, false);
	self.container.addEventListener('click', focus, false);
	JBTools.each(self.container.querySelectorAll('button'), function(focusable, f){
		focusable.addEventListener('focus', focus, false);
	});
};
JBDatePicker.prototype.alwaysFocus = function() {
	var self = this;
	JBTools.insert(self.container, self.input.parentNode);
};