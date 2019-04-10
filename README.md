# heartbeat

* [Introduction](README.md) <br>
这个项目是我的毕业设计 <br>
记录下完成的过程吧 <br>

## 20190410 new version<br>

[小程序](relevant/websocket_ble) <br>
[网页](relevant/realtime.html) <br>
[node 写的简易服务器](relevant/nodejs/ws_nodejs_websocket/server.js) <br>

功能就是，可视化心率测量系统，单片机采集心率数据，蓝牙无线传输上位机和微信小程序， websocket 实现小程序和网页心率数据实时互传。 <br>

后期可能会把毕业论文放上来，现在先这样。 <br>

---

---

## old version
# 项目总体框架

## 数据可视化方案
	web
	weixin miniPorgram
	pc application
## 单片机心率数据采集与发送
...

current progress: <br>
心率采集和发送以及 pc 的上位机已经 OK <br>
问题: <br>
web 和 miniProgram 的实时数据渲染 <br>
miniProgram 接收单片机的数据，然后实时上传服务器 <br>
web 实时接收服务器的数据 <br>
这样就有一个实时性问题 <br>
自己目前能想到的方案，采用 ajax 定时地向服务器发送请求 <br>
有数据更新就获取 <br>
而这样显然大大地增加服务器的负担 <br>
搜索资料后，了解到这样的应用场景还是很多的 <br>
比如网页版的即时聊天室等等 <br>
ajax 或者 long poll 都不合适 <br>
使用 websocket 显然是最合适的 <br>

[websocket](https://segmentfault.com/a/1190000007614996)
[others_demo](https://blog.csdn.net/qq_25843323/article/details/81585806)
