<template>
  <div>
    <video id='video' controls autoplay style="text-align:left;" controlsList="nodownload"></video>
  </div>
</template>

<script>
  import Switcher from '@/components/Switcher'
  import * as  ZLMRTCClient from "../util/ZLMRTCClient"

  export default {
    name: 'videoModal',
    components: {
      Switcher
    },
    data() {
      return {
        show: false,
        mediaUrl:""
      }
    },
    mounted() {
      this.mediaUrl = this.$route.query.mediaUrl
      //webRtc设置分辨率
      ZLMRTCClient.GetAllScanResolution().forEach((r, i) => {
        // console.log(r)
        const opt = document.createElement("option");
        opt.text = r.label + "(" + r.width + "x" + r.height + ")";
        opt.value = r;
      })
      this.start()
    },
    computed: {},
    methods: {
      start() {
        this.stop();
        this.start_play();
      },
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
      start_play() {
        let h = 1080;
        let w = 1920;
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
