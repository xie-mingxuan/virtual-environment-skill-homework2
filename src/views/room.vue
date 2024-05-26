<template>
  <div class="container-fluid" id="app">
    <div class="row mt-3">
      <div class="col-md-12">
        <div><H3>场景</H3></div>
        <el-row type="flex" justify="center" align="middle">
          <el-col v-for="(item, index) in rdpProgramList" :key="index" :span="6">
            <el-card class="box-card" shadow="always" :body-style="{ padding: '0px' }">
              <div slot="header" class="header">
                <span class="label">{{item.programName}}</span>
                <div class="card-header-tag-green"></div>
              </div>
              <div style="margin: 15px">
                <div>
                  <div class="card-label">在线人数</div>
                  <span>{{ item.programOnlineCount }}</span></div>
                <div>
                  <div class="card-label">房间id</div>
                  <span>{{ item.programGuid }}</span></div>
                <div>
                  <div class="card-label">场景描述</div>
                  <span>{{ item.programAbstract }}</span></div>
                <div v-if="false">{{ item.rtmpUrl }}</div>
                <div v-if="false">{{ item.rtspUrl }}</div>
                <div v-if="false">{{ item.webRtcUrl }}</div>
                <div v-if="false">{{ item.hlsUrl }}</div>
              </div>
              <div class="footer">
                <div style="display: flex;align-items: center">
                  <el-button type="text"
                             :style="item.programName === '2' ? 'color: #18c8bd' : 'color: rgb(34, 125, 251)'"
                             style="color: #18c8bd"
                             @click="enterPlay(item.webRtcUrl,item.programName,item.programOnlineCount,item.programGuid )">
                    进入{{ item.programName }}房间
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import * as config from '../config'
  export default {
    name: 'room',
    components: {},
    data() {
      return {
        isShow: false,
        initialized: false,
        rdpProgramList: []
      }
    },
    mounted() {
      this.queryRdpProgramList()
    },
    computed: {},
    methods: {
      /**
       * 查询场景列表
       */
      queryRdpProgramList() {
        this.$api_post({
          token: localStorage.getItem("token"),
          url: config.queryRdpProgramListUrl,
          data: {},
          callback: res => {
            if (res.code === 0 && res.message === "success") {
              if (res.info != "") {
                this.rdpProgramList = res.info
              } else {
                alert("房间不存在")
              }
            } else {
              alert("queryRdpProgramList 调用失败")
            }
          },
          errorback: err => {
            console.log(err)
          }
        })
      },
      /**
       * 调整具体场景页面，播放视频并操作视频
       * @param mediaUrl      webRtcUrl
       * @param programName  场景名称
       * @param programOnlineCount 在线人数
       * @param programGuid        场景的Guid
       */
      enterPlay(mediaUrl, programName, programOnlineCount, programGuid) {
        this.$router.push({
          path: '/play', query: {
            mediaUrl: mediaUrl,
            programName: programName,
            programOnlineCount: programOnlineCount,
            programGuid: programGuid
          }
        });
      },
    }
  }
</script>

<style scoped>
  .el-row {
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
    font-size: 18px !important;
    background-color: rgb(245, 247, 251);
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

  .liveView {
    position: relative;
  }
</style>
