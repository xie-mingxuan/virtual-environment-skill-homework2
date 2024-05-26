<template>
  <div class="liveView">
    <div class="row mt-3">
      <div class="col-md-12">
        <div><H3>场景</H3></div>
        <el-row type="flex" justify="center" align="middle">
          <el-card class="box-card" shadow="always" :body-style="{ padding: '0px' }">
            <div slot="header" class="header">
              <span class="label">{{programName}}</span>
              <div class="card-header-tag-green"></div>
            </div>
            <div style="margin: 15px">
              <div>
                <div class="card-label">在线人数</div>
                <span>{{programOnlineCount }}</span></div>
              <div
                style="margin: 0 auto;width: 20%;font-size: 18px !important;display: flex;height: 50px;justify-content: space-evenly;">
                <div style="display: flex;align-items: center">
                  <div style="margin-bottom: 10px" v-if="isShowApply">
                    <el-button type="text"
                               :style="'color: rgb(34, 125, 251)'"
                               style="color: #18c8bd"
                               @click="applyControl(programGuid,1)">
                      申请控制
                    </el-button>
                  </div>
                  <div style="margin-bottom: 10px"  v-if="!isShowApply">
                    <el-button type="text"
                               :style="'color: rgb(34, 125, 251)'"
                               style="color: #18c8bd"
                               @click="applyControl(programGuid,0)">
                      释放控制
                    </el-button>
                  </div>
                </div>
              </div>
              <div>
                <video id='video' controls autoplay style="text-align:left;"
                       v-on:mousewheel="onMouseWheel($event)"
                       v-on:mousedown="onMouseDown($event)"
                       v-on:mouseup="onMouseUp($event)"
                       v-on:mousemove="onMouseMove($event)"
                       v-on:keydown="onKeyEvent($event)"
                       v-on:keypress="onKeyEvent($event)"
                >
                </video>
              </div>
            </div>
            <div class="footer">
              <div style="display: flex;align-items: center">
                <el-button type="text"
                           :style="'color: rgb(34, 125, 251)'"
                           style="color: #18c8bd"
                           @click="start()">
                  开始(start)
                </el-button>
              </div>
              <div style="display: flex;align-items: center">
                <el-button type="text"
                           :style="'color: rgb(34, 125, 251)'"
                           style="color: #18c8bd"
                           @click="stop()">
                  停止(stop)
                </el-button>
              </div>
            </div>
          </el-card>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import Switcher from '@/components/Switcher'
  import * as config from '../config'
  import * as websocket from '../util/websocket'
  import * as play from '../util/play'
  import * as  ZLMRTCClient from "../util/ZLMRTCClient"
  import {api_get} from "../ajax/api";

  export default {
    name: 'play',
    components: {
      Switcher
    },
    data() {
      return {
        modal: {
          video: false,
          mediaUrl:""
        },
        programName: null,
        programGuid: null,
        programOnlineCount: null,
        mediaUrl: null,

        isShowApply: true,
        rdpProgramList: [],
      }
    },
    mounted() {
      // video 地址
      this.mediaUrl = this.$route.query.mediaUrl
      // 场景名称
      this.programName = this.$route.query.programName
      // 场景编号
      this.programGuid = this.$route.query.programGuid
      // 场景在线人数
      this.programOnlineCount = this.$route.query.programOnlineCount
      // 连接websocket
      this.wsConnect(this.programGuid)
      //webRtc设置分辨率
      ZLMRTCClient.GetAllScanResolution().forEach((r, i) => {
        // console.log(r)
        const opt = document.createElement("option");
        opt.text = r.label + "(" + r.width + "x" + r.height + ")";
        opt.value = r;
      })
    },
    computed: {},
    methods: {
      //启动播放按钮
      start() {
        this.stop();
        this.start_play();
      },
      // 关闭播放
      stop() {
        if (this.player) {
          this.player.close();
          this.player = null;
          var remote = this.el;
          if (remote) {
            remote.srcObject = null;
            remote.load();
          }
        }
      },
      // 播放参数设置
      start_play() {
        let h = 600;
        let w = 800;
        this.player = new ZLMRTCClient.Endpoint({
          element: document.getElementById('video'),// video 标签
          debug: true,// 是否打印日志
          zlmsdpUrl: this.$route.query.mediaUrl, //流地址
          simulcast: false, // 联播
          useCamera: false,
          audioEnable: true,
          videoEnable: true,
          recvOnly: true,
          resolution: {w, h},
          usedatachannel: false,
        });
        // ICE 协商出错
        this.player.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR, (e) => {
          console.log("ICE 协商出错");
        });
        //获取到了远端流，可以播放
        this.player.on(ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS, (e) => {
          console.log("播放成功", e.streams);
        });
        // offer anwser 交换失败
        this.player.on(
          ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED,
          (e) => {
            console.log("offer anwser 交换失败", e);
            this.stop();
          }
        );
        // 获取到了本地流
        this.player.on(ZLMRTCClient.Events.WEBRTC_ON_LOCAL_STREAM, (s) => {
          console.log("获取到了本地流");
        });
        // 获取本地流失败
        this.player.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED, (s) => {
          console.log("获取本地流失败");
        });
        this.player.on(
          ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE,
          (state) => {
            console.log("当前状态==>", state, new Date().toLocaleTimeString());
          }
        );
        this.player.on(ZLMRTCClient.Events.WEBRTC_REQUEST_ERROR, (event) => {
          console.log("rtc WEBRTC_REQUEST_ERROR 错误 :", event);
        });

        this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_OPEN, (event) => {
          console.log("rtc datachannel 打开 :", event);
        });
        this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_MSG, (event) => {
          console.log("rtc datachannel 消息 :", event.data);
        });
        this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_ERR, (event) => {
          console.log("rtc datachannel 错误 :", event);
        });
        this.player.on(
          ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_CLOSE,
          (event) => {
            console.log("rtc datachannel 关闭 :", event);
          }
        );
      },
      // 关闭播放通道
      close() {
        if (this.player) {
          this.player.closeDataChannel();
        }
      },
      /**
       * ===================鼠标事件-开始 调用util/live.js +++作业++==================
       */
      onMouseUp(e) {
        play.onMouseUp(e)
      },
      onMouseDown(e) {
        play.onMouseDown(e)
      },
      onMouseWheel(e) {
        play.onMouseWheel(e)
      },
      onMouseMove(e) {
        play.onMouseMove(e)
      },
      //申请控制
      applyControl(programGuid, status) {
        let data = {
          programGuid: programGuid,
          status: status
        }
        this.$api_post({
          url: config.applyControlUrl,
          data: data,
          token: localStorage.getItem('token'),
          contentType: "application/x-www-form-urlencoded;charset=utf-8",
          callback: res => {
            if (res.code == 0 && res.message == 'success') {
              if (status == '1') {
                alert("控制成功")
                play.setApply(true)
                this.isShowApply = false
              } else {
                play.setApply(false)
                this.isShowApply = true
                alert("释放成功")
              }
            } else {
              alert(res.message)
            }
          },
          errorback: err => {
            play.setApply(false)
            alert("失败")
            console.log(err)
          }
        })

      },
      // websocket建立连接：调用 util/websocket.js
      wsConnect(programGuid) {
        websocket.createSocket(programGuid)
        // 注册监听事件
        window.addEventListener('onmessageWS', this.getSocketData)
      },
      // 接收websocket返回的数据
      getSocketData(e){
        let data = e && e.detail.data
        var jsonObj = JSON.parse(data)
        if (jsonObj != undefined && jsonObj != null) {
          this.handleRevMsg(jsonObj.requestParam, jsonObj.responseData)
        }
      },
      // 监听具体数据处理
      handleRevMsg(requestParam, responseData) {
        let resultInfo = null;
        if (responseData != undefined) {
          resultInfo = responseData.resultInfo
        }
        //1.接收连接成功的数据，成功后发送用户节目注册信息
        if (resultInfo == "连接成功") {
          console.log("连接成功后，用户节目注册")
          var msg = websocket.sendUserRegistration
          msg.arguments[0].userId = localStorage.getItem("userId")
          msg.arguments[0].token = localStorage.getItem("userToken")
          msg.arguments[0].userName = localStorage.getItem("userName")
          websocket.sendWSPush(msg)
        }

        let functionType = null
        if (requestParam != undefined) {
          functionType = requestParam.function
        }
        if (functionType == undefined || functionType == null) {
          return;
        }
        /**
         * TODO
         * 2.监听接收媒体数据，弹出视频窗口播放视频  +++作业弹出窗口居中显示++++
         */
        if(functionType == 'openMedia'){
          this.openVideoWindow(responseData)
        }
        /**
         * TODO
         * 3.接拾取数据的坐标的信息，依据坐标信息，来判断调用相关的接口(config.findLabelAction接口) 拾取的nodeType == 6   +++作业++++
         */
        if (functionType == 'pickByPos') {

        }
      },
      /**
       * TODO
       * 弹出播放视频窗口    +++作业++++   跳转到video.vue页面
       * @param optionParams
       */
      openVideoWindow(responseData){
      },
      /**
       * TODO
       * 弹出标签窗口    +++作业弹出窗口居中显示++++
       * @param optionParams
       */
      openLabelWindow(optionParams){
      },
      /**
       * TODO
       * 发送获取视频接口，用于获取视频的URL    +++作业++++
       * @param optionParams
       */
      sendVideo(optionParams){
      }
    }
  }
</script>

<style scoped>
  .liveView {
    position: relative;
  }

  .el-row {
    /*display:flex;*/
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .el-row .el-card {
    min-width: 100%;
    height: 100%;
    margin-right: 20px;
    transition: all .5s;
  }

  .el-form-item {
    margin-bottom: 0 !important;
  }

  .pagination-container {
    margin-top: -3px;
    margin-bottom: 30px;
  }

  .box-card {
    /*border: 0.5px solid #8d7f7f;*/
    margin-top: 10px;
  }

  .label {
    padding: 0 3px;
    background-color: #fdf0da;
    color: #f19901;
  }

  .header-label {
    padding-left: 10px;
  }

  .card-header-tag-blue {
    position: absolute;
    width: 68px;
    height: 30px;
    top: -14px;
    right: -15px;
    display: inline-block;
  }

  .card-header-tag-green {
    position: absolute;
    width: 68px;
    height: 30px;
    top: -14px;
    right: -15px;
    display: inline-block;
  }


  .footer {
    margin: 0 auto;
    width: 20%;
    font-size: 18px !important;
    /*background-color: rgb(245, 247, 251);*/
    display: flex;
    height: 50px;
    justify-content: space-evenly;
  }

  .card-label {
    color: rgb(197, 197, 197);
    margin-right: 8px;
    width: 70px;
    display: inline-block;
    margin-bottom: 5px;
  }

  .selectWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    line-height: 30px;
    margin: 20px;
    vertical-align: baseline;
  }

  .inputWrapper {
    width: 500px;
    margin: 0 auto;
  }

  .buttonWrapper {
    text-align: center;
  }
</style>
