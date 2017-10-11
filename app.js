var app = require('express')();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var format = require('./format');
mongoose.connect('mongodb://192.168.60.22/log');
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

app.listen(3000);