# heartbeat

* [Introduction](README.md) <br>
这个项目是我的毕业设计 <br>
记录下完成的过程吧 <br>

---

# 项目总体框架

## 数据可视化方案
	web
	weixin miniPorgram
	pc application
## 单片机心率数据采集与发送
...

current progress:
心率采集和发送以及 pc 的上位机已经 OK
问题:
web 和 miniProgram 的实时数据渲染
miniProgram 接收单片机的数据，然后实时上传服务器
web 实时接收服务器的数据
这样就有一个实时性问题
自己目前能想到的方案，采用 ajax 定时地向服务器发送请求
有数据更新就获取
而这样显然大大地增加服务器的负担
搜索资料后，了解到这样的应用场景还是很多的
比如网页版的即时聊天室等等
ajax 或者 long poll 都不合适
使用 websocket 显然是最合适的

[websocket](https://segmentfault.com/a/1190000007614996)
[others_demo](https://blog.csdn.net/qq_25843323/article/details/81585806)
