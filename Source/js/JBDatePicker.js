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