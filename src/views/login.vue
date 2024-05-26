<template>
  <div id="login" style="margin-top: 10px">
    <div id="login-form">
      <h1 style="color: #f3f0f0">登陆界面</h1>
      <label for="name"><i class="el-icon-user-solid" style="color: #f3f0f0"></i></label>
      <input type="text" placeholder="用户名" id="name" autocapitalize="off" v-model.trim=name aria-autocomplete="off">
      <p style="visibility: hidden">用户名为必填选项</p>
      <label for="password"><i class="el-icon-right" style="color: #c1c1c1"></i></label>
      <input type="password" placeholder="密码" id="password" autocapitalize="off" v-model.trim="password">
      <p style="visibility: hidden">密码为必填选项</p>
      <div>
        <el-button type="primary" v-on:click="login" style="color: #f3f0f0;width: 130px;height: 30px;font-size: 0.8rem">登  录</el-button>
        <el-button type="info" v-on:click="resetInfo"  style="color: #f3f0f0;width: 130px;height: 30px;font-size: 0.8rem;">重  置</el-button>
      </div>
    </div>
  </div>
</template>


<script>
  import * as config from '../config'
  import * as aes from '../util/aes'

  export default {
    name: "login",
    data() {
      return {
        name: 'user01',
        password: 'user123456',
        isTokenValidity: false,
        isDisabled: false,
      }
    },
    mounted() {
      // css transition 样式
      let input = document.querySelectorAll("input");
      let label = document.querySelectorAll("label")
      let is = document.querySelectorAll("i");
      for (let i = 0; i < input.length; i++) {
        input[i].addEventListener("click", function () {
          input[i].style.width = '70%';
          input[i].style.transition = '1s';
          label[i].style.width = '70%';
          label[i].style.transition = '1s';
          is[i].style.color = '#037db3';
        })
        input[i].addEventListener("blur", function () {
          input[i].style.width = '60%';
          input[i].style.transition = '1s';
          label[i].style.width = '60%';
          label[i].style.transition = '1s';
          is[i].style.color = '#c1c1c1';
        })
      }
    },
    watch: {
      // 动态监测,验证 input 中 值的输入
      name: function f() {
        let p = document.querySelectorAll("p");
        if (this.name.length < 1) {
          p[0].innerHTML = "用户名称应大于 1 ";
        }
        if (this.name.length >= 1) {
          p[0].style.visibility = "hidden";
        }
        if (this.name.length === 0) {
          p[0].style.visibility = "visible";
        }
      },
      password: function f() {
        let p = document.querySelectorAll("p");
        if (this.password.length === 0) {
          p[1].innerHTML = "请重新输入密码";
          p[1].style.visibility = "visible";
        }
      }
    },
    methods: {
      // 清空当前填写信息
      resetInfo: function () {
        this.name = "";
        this.password = "";
      },
      checkTokenValidity() {
        let token = localStorage.getItem('token')
        let data = {
          token: token,
          appId: config.appId,
          appSecret: config.appSecret
        }
        if (token == null || token == undefined || token == '') {
          this.isTokenValidity = false
        } else {
          this.$api_post({
            url: config.findTokenValidityUrl,
            data: data,
            callback: res => {
              if (data.code == 0 && data.message == 'success') {
                if (data.info == true) {
                  this.isTokenValidity = true
                } else {
                  this.isTokenValidity = false
                }
              } else {
                this.isTokenValidity = false
              }
            },
            errorback: err => {
              console.log(err)
            }
          })
        }
      },
      login() {
        var password = aes.encrypt(this.password, config.appSecret.substr(0, 16))
        let data = {
          userName: this.name,
          passWord: password,
          appId: config.appId,
          appSecret: config.appSecret
        }
        this.$api_post({
          url: config.userLoginUrl,
          data: data,
          contentType: "application/x-www-form-urlencoded;charset=utf-8",
          callback: res => {
            if (res.code === 0 && res.message === "success") {
              if (res.info != "") {
                localStorage.setItem('token', res.info.token)
                localStorage.setItem('userId', res.info.userId)
                localStorage.setItem('nickName', res.info.nickName)
                localStorage.setItem('userName', res.info.userName)
                this.findUserToken()
                // 跳转到场景页面
                this.$router.push('/room');
              }
              {
                alert(res.message)
              }
            } else {
              alert("登录失败")
            }
          },
          errorback: err => {
            console.log(err)
          }
        })
      },
      findUserToken() {
        this.$api_post({
          url: config.findUserInfoByToken,
          data: {
            token: localStorage.getItem('token')
          },
          callback: res => {
            if (res.code === 0 && res.message === "success") {
              if (res.info != "") {
                localStorage.setItem('userToken', res.info.token)
              }
            } else {
              alert("客户接口异常")
            }
          },
          errorback: err => {
            console.log(err)
          }
        })
      },
      confirm() {
        this.isDisabled = true
        this.checkTokenValidity()
        if (this.isTokenValidity == true) {
          alert("登录成功")
          this.$router.replace('/live');
        } else {
          this.login()
        }
        this.isDisabled = true
      }
    }
  }
</script>

<style scoped>
  #login {
  }

  #login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50vw;
    min-width: 300px;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 15px;
    box-shadow: 0 15px 25px rgba(0, 0, 0, .5);
  }

  h1 {
    width: 60%;
    margin: 50px auto 0;
    color: #c1c1c1;
    text-align: center;
  }

  input {
    width: 60%;
    margin: 0 auto;
    outline: none;
    border: none;
    padding: 10px;
    border-bottom: 1px solid #fff;
    background: transparent;
    color: white;
  }

  label {
    width: 60%;
    margin: 0 auto;
    position: relative;
    top: 30px;
    left: -15px;
  }

  div {
    width: 60%;
    margin: 10px auto;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  button {
    background-color: rgba(9, 108, 144, 0.5);
    margin: 10px 25px 40px 25px;
  }

  p {
    width: 60%;
    margin: 8px auto;
    position: relative;
    left: -15px;
    color: #ff0000;
    font-size: 8px;
  }

  input {
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 5000s ease-in-out, width 1s ease-out !important;
  }
</style>
