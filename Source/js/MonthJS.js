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