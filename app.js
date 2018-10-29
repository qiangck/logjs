var app = require('express')();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var format = require('./format');
var request = require('request');
var config = require('./config');
mongoose.connect('mongodb://' + config.mongodbApi);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var schema = new mongoose.Schema({
    message:String,
    url:String,
    browser:String,
    line:Number,
    col:Number,
    system:String,
    language:String,
    time:String
},{collection: 'item'});

// 获取token
function getAccessToken (content) {
	var urlHost = config.dingdingHost + config.getAccessTokenApi;
	var param = "?corpid="+config.corpid+"&corpsecret="+config.corpsecret;
	request(urlHost + param, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			bodyCallback(body, pushDingDingNews.bind(json.access_token, content));
		} else {
			getAccessToken();
		}
	})
}

function pushDingDingNews (token, content) {
	var param = Object.assign({}, config.pushConfig);
	param.text.content = content || "";
	console.log(param);
	request.post({
		url:config.dingdingHost + config.pushContentApi + "?access_token" + token,
		form:param
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			bodyCallback(body, console.log.bind(this,"钉钉推送成功"));
		}
	});
}

function bodyCallback (body, cb) {
	try{
		var json = JSON.parse(body);
		if (json.errcode == 0) {
			cb();
		} else {
			console.log("信息错误" + json.errmsg);
		}
	}catch(err) {
		console.log("json错误" + err);
	}
}

var LogModal = mongoose.model('item',schema);

app.all('*', function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

app.post('/save', function (req, res) {
	var json = {
		browser: req.body.browser || '',
		system: req.body.system || '',
		line: req.body.line || 0,
		col: req.body.col || 0,
		language: req.body.language || '',
		message: req.body.message || '',
		url: req.body.url || '',
		time: format('yyyy-MM-dd hh:mm:ss')
	}
	// 钉钉消息推送
	getAccessToken(JSON.stringify(json));
	var LogClass = new LogModal(json);
	LogClass.save(function(err){
	    if(err){
	        console.log(err);
	        res.send('error');
	        return false;
	    }else{
	    	console.log('保存成功');
	    }
	});
	res.send('success');
});

app.get('/search', function (req, res) {
	LogModal.find(function (err, result) {
		var arrJSON = [];
		for(var i = 0; i < result.length;i ++) {
			arrJSON.push({
				browser: result[i].browser,
				system: result[i].system,
				language: result[i].language,
				message: result[i].message,
				line: result[i].line,
				col: result[i].col,
				url: result[i].url,
				time: result[i].time
			});
		}
		if(err) {
			console.log('查询失败')
		} else {
			res.send(arrJSON);
		}
	});
});

app.listen(3001);