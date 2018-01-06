import  WechatApi from './WechatApi';


export  default new class  {
    appid:string="wx06085bff311745d8";
    appiSecret:string ="36cc8b633770026d27440d163e2f8492";
    wechatApi = new WechatApi(this.appid,this.appiSecret);

    constructor() {}

}