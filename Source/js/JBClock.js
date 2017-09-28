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
};
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