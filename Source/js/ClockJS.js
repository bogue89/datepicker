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