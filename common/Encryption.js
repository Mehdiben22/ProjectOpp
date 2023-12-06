import CryptoJS from "crypto-js";
import {ENCRYTION_KEY} from './Constant'
export function aesEncrypt(word){
    if(false) return word;
      var key = CryptoJS.enc.Utf8.parse(ENCRYTION_KEY);
      var srcs = CryptoJS.enc.Utf8.parse(word);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
      return encrypted.toString();
  }
   
  export function aesDecrypt(word){
    if(false) return word;
      var key = CryptoJS.enc.Utf8.parse(ENCRYTION_KEY);
      var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
      return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }

  console.log("ENCRY ",aesEncrypt("123456"))