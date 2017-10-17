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