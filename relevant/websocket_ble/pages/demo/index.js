// pages/demo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /* ============= websocket ============= */
    socketStatus: 'closed',
    isOpen: false,
    sendText: 'hello miniProgram'
    /* ============= websocket ============= */
  },

  /* ============= websocket ============= */
  socketMsgQueue: [],

  registerOpen: function () {
    wx.onSocketOpen((res) => {
      console.log('当前 webSocket 通道已经打开并开始发送数据');
      this.sendAllMessage();
      this.setData({
        socketStatus: 'connected',
        isOpen: true
      });
    });
  },

  registerReceive: function () {
    wx.onSocketMessage(function (res) {
      console.log('receive data from server: ' + res.data);
    });
  },

  registerError: function () {
    wx.onSocketError((res) => {
      this.setData({
        isOpen: false,
        socketStatus: 'closed'
      });
      console.log('error reason: ' + res);
    });
  },

  toggleSocket: function (event) {
    if (event.detail.value) {
      wx.connectSocket({
        url: 'ws://192.168.43.15:33333',
        // protocols: ['echo-protocol'],
        success: (res) => {
          console.log('open a socket connection', res);
          this.registerOpen();
          this.registerReceive();
          this.registerError();
        },
      })
    } else {
      wx.closeSocket({
        success: (res) => {
          console.log('closing', res);
          wx.onSocketClose((res) => {
            console.log('socket closed', res);
            this.setData({
              socketStatus: 'closed',
              isOpen: false
            });
          });
        },
        fail: (res) => {
          console.log('close failed, the reason is: ', res);
        },
        complete: (res) => {
          console.log('conpleted!', res);
        }
      });
    }
  },

  sendMessage: function () {
    let text = this.data.sendText;
    this.sendSingleMessage(text);
  },

  sendSingleMessage: function (text) {
    let isOpen = this.data.isOpen;
    if (isOpen) {
      wx.sendSocketMessage({
        data: text,
      })
    } else {
      this.socketMsgQueue.push(text);
    }
  },

  sendAllMessage: function () {
    for (var i = 0; i < this.socketMsgQueue.length; i++) {
      this.sendSingleMessage(this.socketMsgQueue[i]);
    }
    this.socketMsgQueue = [];
  },
  /* ============= websocket ============= */

  /* ============= ble ============= */
  // 初始化本机蓝牙适配器
  bleInit: function () {
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('初始化蓝牙适配器返回' + JSON.stringify(res))
      },
      fail: function (res) {
        console.log('初始化蓝牙适配器失败' + JSON.stringify(res))
      }
    })
  },

  // 获取本机蓝牙适配器的状态
  bleAdapterState: function () {
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        //页面日志显示
        that.setData({
          msg: "本机蓝牙适配器状态" + "/" + JSON.stringify(res.errMsg) + "==是否可用：" + res.available
        });
      }
    });
  },

  // 搜索周边蓝牙设备
  bleSearch: function () {
    var that = this;
    wx.startBluetoothDevicesDiscovery({
      services: ['FFF0'],// 指定 搜索 uuid
      success: function (res) {
        that.setData({
          msg: "搜索设备" + JSON.stringify(res),
        })
        console.log('搜索设备返回' + JSON.stringify(res))
      }
    })
  },

  // 获取所有周边蓝牙信息
  bleGetDevices: function () {
    var that = this;
    wx.getBluetoothDevices({
      success: function (res) {
        that.setData({
          msg: "搜索设备" + JSON.stringify(res.devices),
          devices: res.devices
        })
        console.log('搜到的蓝牙设备数目：' + res.devices.length)
        console.log('获取到周边搜到的设备信息：' + JSON.stringify(res.devices))
      }
    })
  },

  // 连接蓝牙设备
  bleConnect: function (e) {
    var that = this;
    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      success: function (res) {
        console.log('连接设备返回：' + res.errMsg);
        that.setData({
          connectedDeviceId: e.currentTarget.id,
          msg: "已连接" + e.currentTarget.id + '===' + '连接设备返回：' + res.errMsg,
          msg1: "",
        })
      },
      fail: function () {
        console.log("调用失败");
      },
      complete: function () {
        console.log("调用结束");
      }
    })
    console.log(that.data.connectedDeviceId);
  },

  //停止搜索周边设备
  bleStopSearch: function () {
    var that = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          msg: "停止搜索周边设备" + "/" + JSON.stringify(res.errMsg),
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
      }
    })
  },

  // 获取连接设备的 service 服务
  bleDeviceServices: function () {
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log('device services:', JSON.stringify(res.services));
        for (var i = 0; i < res.services.length; i++) {
          console.log(i + "--UUID:------" + res.services[i].uuid)
          //var servicesUuid = res.services[i].uuid
        }
        that.setData({
          services: res.services,
          msg: JSON.stringify(res.services),
        })
      }
    })
  },

  // 获取连接设备的(指定的具有读写通知属性的 service )的特征值  
  bleDeviceCharacteristics: function () {
    var that = this;
    var myuuid = that.data.services[2].uuid; // 具有读写通知属性的服务 uuid --> FFE0
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: myuuid,
      success: function (res) {
        for (var i = 0; i < res.characteristics.length; i++) {
          console.log('特征值：' + res.characteristics[i].uuid)
        }
        console.log('device getBLEDeviceCharacteristics: ', res.characteristics);

        that.setData({
          msg: JSON.stringify(res.characteristics),
          characteristicsUuid: res.characteristics[0].uuid
        });
      },
      fail: function () {
        console.log("fail");
      },
      complete: function () {
        console.log("complete");
      }
    });
  },

  // 开启特征值改变通知
  bleNotifyCharacteristicValueChange: function () {
    var that = this;
    var myuuid = that.data.services[2].uuid; // 具有读写通知属性的服务 uuid
    wx.notifyBLECharacteristicValueChange({
      deviceId: that.data.connectedDeviceId,
      serviceId: myuuid,
      characteristicId: that.data.characteristicsUuid,// 读写通知属性属性的特征值 uuid
      state: true,
      success: function (res) {
        console.log('开启 notify: ', res.errMsg);
        // 监听低功耗蓝牙设备的特征值变化
        wx.onBLECharacteristicValueChange(function (res) {
          // that.bleRead();
          var receivedData = that.arrayBufferToHexString(res.value);
          console.log(res.value);
          that.setData({
            receivedData: receivedData,
            sendText: 'data-' + receivedData// 更新 websocket 数据
          })
          that.sendMessage();// 通过 websocket 发送数据
          console.log('特征值变化: ', receivedData);
        })
      },
      fail: function () { }
    })
  },

  // 读取数据
  bleRead: function () {
    var that = this;
    var myuuid = that.data.services[2].uuid; // 具有读写通知属性的服务 uuid
    wx.readBLECharacteristicValue({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: myuuid,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: that.data.characteristicsUuid,
      success: function (res) {
        console.log('success: readBLECharacteristicValue:', res.errCode)
      },
      fail: function (res) {
        console.log('fail: readBLECharacteristicValue:', res.errCode)
      }
    })
  },

  // 断开设备连接 V型知识库原创 www.vxzsk.com
  bleClose: function () {
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        that.setData({
          connectedDeviceId: "",
        });
        console.log('断开蓝牙设备连接返回：' + res.errMsg);
      }
    })
  },

  arrayBufferToHexString: function (buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },
  /* ============= ble ============= */


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})