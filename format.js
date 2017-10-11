function format (time) {
	var nowTime = new Date();
	var o = {
		"M+" : nowTime.getMonth()+1,
		"d+" : nowTime.getDate(),
		"h+" : nowTime.getHours(),
		"m+" : nowTime.getMinutes(),
		"s+" : nowTime.getSeconds(),
		"q+" : Math.floor((nowTime.getMonth()+3)/3),
		"S" : nowTime.getMilliseconds()
	}
	if(/(y+)/.test(time)) {
		time = time.replace(RegExp.$1,(nowTime.getFullYear()+"").substr(4- RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(time)) {
			time = time.replace(RegExp.$1, RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	return time;
}

module.exports = format;