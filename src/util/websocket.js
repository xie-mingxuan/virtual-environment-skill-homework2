import {webSocketUrl} from "../config";

export let socket = null
let setIntervalWesocketPush = null
let setIntervalWesocketPush2 = null
const socketUrl = 'ws://' + webSocketUrl + '/websocket'  // socket连接地址

// userRegistration 用户场景注册
export let sendUserRegistration = {
  "module": "UPMS",
  "function": "userRegistration",
  "arguments": [
    {
      "userId": "",
      "token": "",
      "userName": "",
      "avatar": "http://192.168.100.38:28080/profile/avatar/2021/09/14/629700f909fe9f93a7b7918e9e90d09c.jpeg",
      "permissions": [
        "/digitaltwin/login",
        "/dtc/findAllLayout",
        "bvweb:functionAuth:systemStatus",
        "bvweb:functionAuth:lastingControl",
        "/digitaltwin/viewAllResourcesAndInfo",
        "/dtc/login"
      ],
      "terminalFlag": "pc",
      "suuid": "17B7D948-80DB-6B99-7786-1F14AE0FA9C7",
      "dataChannelName": ""
    }
  ]
}

// onMouseEvent 鼠标事件
export let sendOnMouseEvent = {
  "module": "RdpEvent",
  "function": "onMouseEvent",
  "arguments": [
  ]
}
//获取节目系统状态
var heartStatus = {
  "module": "SystemStatus",
  "function": "retriveStatus"
}

//验证用户有效期
var heartTokenValidity = {
  "module": "UPMS",
  "function": "findTokenValidity",
  "token": ""
}


/**
 * 建立websocket连接
 * @param {string} url ws地址
 */
export const createSocket = (programGuid) => {
  socket && socket.close()
  if (!socket) {
    console.log('建立websocket连接')
    if (programGuid != null || programGuid != undefined) {
      socket = new WebSocket(socketUrl + "/" + programGuid + "/" + localStorage.getItem("userToken"))
      socket.onopen = onopenWS
      socket.onmessage = onmessageWS
      socket.onerror = onerrorWS
      socket.onclose = oncloseWS
    } else {
      console.error("websocket连接失败，未获取到账户信息")
    }
  } else {
    console.log('websocket已连接')
  }
}


/**打开WS之后发送心跳 */
const onopenWS = () => {
  sendPing2()
}

/**连接失败重连 */
const onerrorWS = () => {
  socket.close()
  clearInterval(setIntervalWesocketPush)
  console.log('连接失败重连中')
  if (socket.readyState !== 3) {
    socket = null
    createSocket(socketUrl)
  }
}

/**WS数据接收统一处理 */
const onmessageWS = e => {
  // console.log(e.data)
  window.dispatchEvent(new CustomEvent('onmessageWS', {
    detail: {
      data: e.data
    }
  }))
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = message => {
  setTimeout(() => {
    if (socket.readyState === 0) {
      connecting(message)
    } else {
      socket.send(JSON.stringify(message))
    }
  }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = message => {
  if (socket !== null && socket.readyState === 3) {
    socket.close()
    createSocket(socketUrl)
  } else if (socket.readyState === 1) {
    socket.send(JSON.stringify(message));
  } else if (socket.readyState === 0) {
    connecting(message)
  }
}


/**断开重连 */
const oncloseWS = () => {
  console.log('websocket已断开')
  socket = null
  clearInterval(setIntervalWesocketPush)
  console.log('websocket已断开....正在尝试重连')
  if (socket.readyState !== 2) {
    socket = null
    createSocket()
  }
}

export const closeWs = () => {
  socket.close()
}


/**发送心跳
 * @param {number} time 心跳间隔毫秒 默认10000
 * @param {string} ping 心跳名称 默认字符串ping
 */
export const sendPing2 = (time = 5000, ping = 'ping2') => {
  clearInterval(setIntervalWesocketPush2)
  heartTokenValidity.token = localStorage.getItem("token")
  socket.send(JSON.stringify(heartTokenValidity))
  setIntervalWesocketPush2 = setInterval(() => {
    socket.send(JSON.stringify(heartTokenValidity))
  }, time)
}


