import * as EVTEvent from "./BVTEvent_types";
import * as websocket from "./websocket";
// 申请控制
let isApply = false
// 是否按下 默认否
let isDown = false
// 设置申请控制
export const setApply = (e) => {
  isApply = e
}


// =====================鼠标事件======================
// 按下
export const onMouseDown = (e) => {
  isDown = true
  if(websocket.socket && isApply == true){
    onBaseMouse(e)
  }else{
    alert("请申请控制权限")
  }
}
//滚动滑轮
export const onMouseWheel = (e) => {
  if(websocket.socket && isApply == true){
    onBaseMouse(e)
  }else{
    alert("请申请控制权限")
  }
}
// 移动
export const onMouseMove = (e) => {
  if (isDown == true) {
    onBaseMouse(e)
  }
}
// 移开事件
export const onMouseUp = (e) => {
  isDown = false
  let requestParam = null
  if(websocket.socket && isApply == true){
    requestParam = onBaseMouse(e)
  }else{
    alert("请申请控制权限")
  }
  if (requestParam == undefined || requestParam == null){
    return
  }
  var argument = requestParam.arguments
  var type = null
  if (argument != undefined) {
    type = argument[0].type
  }
  var position = null
  if (type != undefined && type == 2) {
    position = argument[0].position
  }
  //发送坐标拾取
  if (position != undefined) {
    console.log(position.x, position.y)
    invokePickResult(1, position.x, position.y)
  }
}

/**
 * TODO
 * 鼠标事件  +++作业，参考开发文档++++
 * @param e
 * @returns {{module: string, function: string, arguments: []}}
 */
function onBaseMouse(e) {
  if (websocket.socket && isApply == true) {

  }
}

/**
 * TODO
 * 鼠标参数  +++作业，参考开发文档++++
 * @param e
 * @param evt
 */
function mouseEventToThriftMouseEvent(e, evt) {

}

function getCoordInDocument(e) {
  e = e || window.event;
  var x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
  var y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
  return {'x': x, 'y': y};
}

//==============拾取标签.视频的坐标，发送pickByPos消息。监听器监听function：pickByPos 消息。=================
export const invokePickResult = (pickType, x, y) => {
  var jsObject = new Object();
  jsObject['module'] = 'MainView';
  var itemObject = new Object();
  if (pickType == 1) {
    jsObject['function'] = 'pickByPos';
    itemObject = {
      'winPosition': x + " " + y,//窗口坐标，参考原点为左上方
      'pickHints': 3,//拾取类型，表示拾取类型为地形节点&三维节点
      'pickNodeTypes': "[5][6][7]",//拾取节点类型，表示拾取相机、标签、表格的节点，为空表示所有类型的节点
    }
  } else if (pickType == 2) {
    jsObject['function'] = 'pickByLine';
    itemObject = {
      'startPosition': "x y z",//vect3d，空间起始位置
      'endPosition': "x y z",//vect3d，空间结束位置
      'pickHints': 3,//拾取类型，表示拾取类型为地形节点&三维节点
      'pickNodeTypes': "[5][6][7]",//拾取节点类型，表示拾取相机、标签、表格的节点，为空表示所有类型的节点
    }
  } else if (pickType == 3) {
    jsObject['function'] = 'pickByRect';
    itemObject = {
      'winStartPosition': "500 123",//窗口坐标，参考原点为左上方
      'winEndPosition': "600 803",//窗口坐标，参考原点为左上方
      'pickHints': 3,//拾取类型，表示拾取类型为地形节点&三维节点
      'pickNodeTypes': "[5][6][7]",//拾取节点类型，表示拾取相机、标签、表格的节点，为空表示所有类型的节点
    }
  }
  var jsArgs = new Array();
  jsArgs[0] = itemObject;
  jsObject['arguments'] = jsArgs;
  websocket.socket.send(JSON.stringify(jsObject));
  console.log(jsObject)
}
