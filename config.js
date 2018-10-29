var dingdingHost = "https://oapi.dingtalk.com";
var getAccessTokenApi = "/gettoken";
var pushContentApi = "/message/send";
var mongodbApi = "192.168.60.22/log";
module.exports = {
	corpid: "corpid",
	corpsecret: "corpsecret",
	pushConfig: {
		touser: "",
		toparty: "",
		agentid: "",
		msgtype: "",
		text: {
			content: ""
		}
	},
	dingdingHost: dingdingHost,
	getAccessTokenApi: getAccessTokenApi,
	pushContentApi: pushContentApi
};