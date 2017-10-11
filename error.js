;(function () {
	if(window.errorLog) {
		return window.errorLog;
	}
	var defaults = {
		message: '',
		url: '',
		line: '',
		col: ''
	}
	function _ajax(options) {
		options = options || {};
		options.type = (options.type || 'GET').toUpperCase();
		options.dataType = options.dataType || 'json';
		var params = _formatParams(options.data);
		var xmlHttpRequest;
		if(window.XMLHttpRequest) {
			xmlHttpRequest = new XMLHttpRequest();
			if(xmlHttpRequest.overrideMimeType) {
				xmlHttpRequest.overrideMimeType('text/xml');
			}
		} else if(window.ActiveXObject) {
			var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
			for(var i = 0; i < activexName.length; i++) {
				try{
					xmlHttpRequest = new ActiveXObject(activexName[i]);
					if(xmlHttpRequest){
						break;
					}
				}catch(err) {
					console.log(err)
				}
			}
		} else {
			console.error('unknown browser')
		}
		if(xmlHttpRequest) {
			if(options.type == 'GET') {
				xmlHttpRequest.open('GET', options.url + '?' + params, true);
				xmlHttpRequest.send(null);
			} else {
				xmlHttpRequest.open('POST', options.url, true);
				xmlHttpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
				xmlHttpRequest.send(params);
			}
			xmlHttpRequest.onreadystatechange = function () {
				if(xmlHttpRequest.readyState == 4) {
					var status = xmlHttpRequest.status;
					if(status == 200 || status == 304) {
						options.success && options.success(xmlHttpRequest.responseText, xmlHttpRequest.responseXML);
					} else {
						options.fail && options.fail(status);
					}
				}
			}
		}
	}
	// 格式化参数
	function _formatParams(data) {
		var arr = [];
		for (var name in data) {
			arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
		}
		arr.push(("v=" + Math.random()).replace(".",""));
		return arr.join("&");
	}
	// 合并对象
	function _extendObj() {
		var args = arguments;
		if(args.length < 2) {
			return false;
		} else {
			var temp = _cloneObj(args[0]);
			for(var n = 0;args.length > n;n++) {
				for(var index in args[n]) {
					temp[index] = args[n][index];
				}
			}
			return temp;
		}
	}
	// 复制对象
	function _cloneObj(oldObj) {
		if(typeof oldObj != 'object' || oldObj == null) {
			return oldObj;
		} else {
			var newObj = {};
			for(var prop in oldObj) {
				newObj[prop] = oldObj[prop];
				return newObj;
			}
		}
	}
	// 浏览器版本
	function _userAgent() {
		var u = navigator.userAgent;
		var platform = navigator.platform;
		var returnObj = {};
		var isWin = (platform == "Win32") || (platform == "Windows");
		var isMac = (platform == "Mac68K") || (platform == "MacPPC") || (platform == "Macintosh") || (platform == "MacIntel");
		if (isMac) returnObj['system'] = "Mac";
		var isUnix = (platform == "X11") && !isWin && !isMac;
		if (isUnix) returnObj['system'] = "Unix";
		var isLinux = (String(platform).indexOf("Linux") > -1);
		if (isLinux) returnObj['system'] = "Linux";
		if (isWin) {
			var isWin2K = u.indexOf("Windows NT 5.0") > -1 || u.indexOf("Windows 2000") > -1;
			if (isWin2K) returnObj['system'] = "Win2000";
			var isWinXP = u.indexOf("Windows NT 5.1") > -1 || u.indexOf("Windows XP") > -1;
			if (isWinXP) returnObj['system'] = "WinXP";
			var isWin2003 = u.indexOf("Windows NT 5.2") > -1 || u.indexOf("Windows 2003") > -1;
			if (isWin2003) returnObj['system'] = "Win2003";
			var isWinVista= u.indexOf("Windows NT 6.0") > -1 || u.indexOf("Windows Vista") > -1;
			if (isWinVista) returnObj['system'] = "WinVista";
			var isWin7 = u.indexOf("Windows NT 6.1") > -1 || u.indexOf("Windows 7") > -1;
			if (isWin7) returnObj['system'] = "Win7";
			var isWin7 = u.indexOf("Windows NT 6.2") > -1 || u.indexOf("Windows 8") > -1;
			if (isWin7) returnObj['system'] = "Win8";
			var isWin7 = u.indexOf("Windows NT 6.4") > -1 || u.indexOf("Windows NT 10.0") > -1 || u.indexOf("Windows 10") > -1;
			if (isWin7) returnObj['system'] = "Win10";
		}
		if(!returnObj.system) returnObj['system'] = "Other";
		var isIE = window.ActiveXObject != undefined && ua.indexOf("MSIE") > -1;
		if(isIE) returnObj['browser'] = 'Internet Explorer';
		var isOpera = window.opr != undefined;
		if(isOpera) returnObj['browser'] = 'Opera';
		var isChrome = u.indexOf('Chrome') > -1 && !!window.chrome;
		if(isChrome) returnObj['browser'] = 'Chrome';
		var isFirefox = u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1;
		if(isFirefox) returnObj['browser'] = 'Firefox';
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isIOS) returnObj['browser'] = 'ios';
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
		if(isAndroid) returnObj['browser'] = 'Android';
		var isIPhone = u.indexOf('iPhone') > -1;
		if(isIPhone) returnObj['browser'] = 'iPhone';
		var isIPad = u.indexOf('iPad') > -1;
		if(isIPad) returnObj['browser'] = 'iPad';
		var isMobile = !!u.match(/AppleWebKit.*Mobile.*/);
		if(isMobile) returnObj['browser'] = 'Mobile';
		var isSafari = !isChrome && u.indexOf("Safari") > -1 && u.indexOf("Version") > -1;
		if(isSafari) returnObj['browser'] = 'Safari';
		var isWeixin = u.indexOf('MicroMessenger') > -1;
		if(isWeixin) returnObj['browser'] = 'WeiXin';
		var isQQ = u.match(/\sQQ/i) == " qq";
		if(isQQ) returnObj['browser'] = 'qq';
		if(!returnObj.browser) returnObj['browser'] = "Other";
		returnObj['language'] = (navigator.browserLanguage || navigator.language).toLowerCase();
		return returnObj;
	}
	function errorLog(params) {
		if(!params.url) {
			console.error('not afferent url');
			return false;
		}
		window.onerror = function(message, url, line, col, errorObj) {
			var time = setTimeout(function () {
				// 部分浏览器不返还col
				if(!col) {
					col = (window.event && window.event.errorCharacter) || 0;
				}
				defaults['url'] = url;
				defaults['line'] = line;
				defaults['col'] = col;
				if(errorObj && errorObj.stack) {
					defaults['message'] = errorObj.stack.substring(0, errorObj.stack.indexOf('  ')).toString();
				} else {
					defaults['message'] = message;
				}
				// 自定义参数
				var reportData = _extendObj(_userAgent() || {}, params.data || {}, defaults);
				_ajax({
					url: params.url,
					type: 'POST',
					data: reportData,
					dataType: 'json',
					success: function (result, xmlHttpRequest) {
						params.successCallBack && params.successCallBack(result, xmlHttpRequest);
					},
					fail: function (status) {
						params.failCallBack && params.failCallBack(status);
					}
				});
				clearTimeout(time);
			},0);
			return true;
		}
	}
	window.errorLog = errorLog;
})();
if(typeof module !== 'undefined') {
	module.exports = window.errorLog;
} else if (typeof define === 'function' && define.amd) {
	define([], function () {
		'use strict';
		return window.errorLog;
	})
}