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