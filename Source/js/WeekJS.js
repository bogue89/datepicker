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