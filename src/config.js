// const debug = process.env.NODE_ENV !== 'production'
//let userUrl="http://219.224.168.109:5101/"
let userUrl="http://10.132.24.169:5101/"

//像素流服
//let rdpProgramUrl=" http://219.224.168.109:5301/"
// export const  webSocketUrl="219.224.168.109:5301"
// export const appId=  "38f9a0bde1da4729"
// export const appSecret= "dbe81cebaccb8cf463e51d3ac1563d7388c2e429"
let rdpProgramUrl=" http://10.132.24.169:5301/"
export const  webSocketUrl="10.132.24.169:5301"
export const appId=  "IUWSFFnQvx9VIjKL"
export const appSecret= "a8849b61227849868f7049a319a81413"


//登录接口
export const userLoginUrl= userUrl + "/openApi/user/login"
//查询token有效性
export const findTokenValidityUrl=  userUrl + "/sso/findTokenValidity"
//根据token获取用户信息
export const findUserInfoByToken=  userUrl + "/sso/findUserInfoByToken"
//退出登录
export const logout= userUrl + "/openApi/internal/logout"



//获取节目列表
export const queryRdpProgramListUrl= rdpProgramUrl + "/bv/rdp/queryRdpProgramList"
export const applyControlUrl= rdpProgramUrl + "/bv/rdp/applyControl"

//获取标签弹出资源
export const findLabelAction= rdpProgramUrl +  "/resource/findLabelAction"

