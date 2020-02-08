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