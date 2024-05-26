const CryptoJS = require('crypto-js');
/**
 * 加密（需要先加载lib/aes/aes.min.js文件）
 */

var IV = CryptoJS.enc.Utf8.parse("0000000000000000");//  密钥偏移量    16位长度字符
export const encrypt = (params,keyParams) => {
  var key = CryptoJS.enc.Utf8.parse(keyParams);
  //明文参数
  var str = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(params))
  //加密
  var encryptedData = CryptoJS.AES.encrypt(str, key, {
    iv: IV,
    mode: CryptoJS.mode.ECB, //AES加密模式
    padding: CryptoJS.pad.Pkcs7 //填充方式
  });
  console.log("加密前："+params);//加密前：QWEASDZXC
  console.log("加密后："+encryptedData.toString());//加密后：smAeyA8mIIh/O9qcbmUmsg==
  return CryptoJS.enc.Base64.stringify(encryptedData.ciphertext); //返回base64格式密文
}
/**
 * 解密
 */
export const decrypt = (word,keyParams) => {
  var key = CryptoJS.enc.Utf8.parse(keyParams);
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    iv: IV,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
