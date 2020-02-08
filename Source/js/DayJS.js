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