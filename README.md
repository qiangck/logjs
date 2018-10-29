# logjs
js错误日志

## 什么是前端代码异常
前端代码异常分两种，1、代码语法错误 2、代码运行时产生错误。

日常前端工程发布时可能测试不出代码运行时产生的错误，在上线后很难发现错误，只有用户使用在特殊情况使用时才可以测试出错误。

## 捕获前端错误代码方法
捕获错误方法分两种：

* try..catch
* window.onerror

第一种只能捕获单独的语法块，第二种是一种暴利的捕获方法，他们底层的实现就是利用 C/C++ 中的 goto 语句实现，一旦发现错误，不管目前的堆栈有多深，不管代码运行到了何处，直接跑到顶层或者 try..catch 捕获的那一层。

## 捕获前端错误代码注意事项

* 跨域的资源文件无法使用window.onerror方法进行捕获。
* 对压缩文件兼容性不好，无法定位到具体字段。

## 使用方法

* 在head顶部引入error.js文件
* 在head顶部调用errorLog方法，传入url(接口服务器/save)地址，有success和fail回调方法
* 可以使用接口服务器/search地址查询日志记录
* config里面配置钉钉推送参数
* 安装mongodb => 启动服务 => config配置服务地址
* 启动node服务
* 测试钉钉和接口是否有返回


```javascript
yarn || npm install
node app.js
```