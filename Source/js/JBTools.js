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