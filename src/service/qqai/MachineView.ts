import assert = require('assert');
import fs = require('fs');
import { SignatureLogic } from './SignatureLogic';
import request = require('request');


assert('E8F6F347D549FE514F0C9C452C95DA9D' == SignatureLogic.paramsToSign(
  {
    text: '腾讯开放平台',
    app_id: 10000,
    time_stamp: '1493449657',
    nonce_str: '20e3408a79'
  },
  'a95eceb1ac8c24ee28b70f7dbba912bf'));



export class MachineView {
  /**人脸美妆 */
  public static FACE_COSMETIC = "https://api.ai.qq.com/fcgi-bin/ptu/ptu_facecosmetic";

  /**人脸融合 */
  public static FACE_MERGE = "https://api.ai.qq.com/fcgi-bin/ptu/ptu_facemerge";
  public static FACE_DETECT = "https://api.ai.qq.com/fcgi-bin/face/face_detectface";

  async faceMerge(base64: string, model: number): Promise<{ ret: number, msg: string, data: any }> {


    var options = {
      app_id: this.appId,
      nonce_str: (Math.random() * 1000000 + '').replace('.', ''),
      time_stamp: Math.round(parseInt((new Date().getTime() / 1000).toFixed(1))),
      model: model,
      image: base64
    };
    var sign = SignatureLogic.paramsToSign(options, this.appKey);
    options['sign'] = sign;
    var body = <any>await this.requestApi(MachineView.FACE_MERGE, options, "POST");
    return body;
  }

  /**
   * app_id	是	int	正整数	1000001	应用标识（AppId）
  time_stamp	是	int	正整数	1493468759	请求时间戳（秒级）
  nonce_str	是	string	非空且长度上限32字节	fa577ce340859f9fe	随机字符串
  sign	是	string	非空且长度固定32字节	B250148B284956EC5218D4B0503E7F8A	签名信息，详见接口鉴权
  cosmetic	是	int	正整数	1	美妆编码，定义见下文描述
  image	是	string	原始图片的base64编码数据（大小上限500KB）	...	待处理图
   */
  async faceCosmetic(cosmetic: number, image: string) {
    var options = {
      app_id: this.appId,
      cosmetic,
      image,
      nonce_str: (Math.random() * 1000000 + '').replace('.', ''),
      time_stamp: Math.round(parseInt((new Date().getTime() / 1000).toFixed(1))),
    }

    var sign = options['sign'] = SignatureLogic.paramsToSign(options, this.appKey)
    var body = await this.requestApi(MachineView.FACE_COSMETIC, options);
    return body;
  }

  async detectFace(image: string, mode = 1) {
    image=image.indexOf('data:image/png;base64,')!==-1?image.replace('data:image/png;base64,',''):image;
    var options = {
      app_id: this.appId,
      mode,
      image,
      nonce_str: (Math.random() * 1000000 + '').replace('.', ''),
      time_stamp: Math.round(parseInt((new Date().getTime() / 1000).toFixed(1))),
    };
    console.log(image);
    var sign = options['sign'] = SignatureLogic.paramsToSign(options, this.appKey)
    var body = await this.requestApi(MachineView.FACE_DETECT, options);
    return body;


  }

  private requestApi(url: string, options, method = "Get"): Promise<Object> {
    var defaultOptions = {
      app_id: this.appId,
      nonce_str: (Math.random() * 1000000 + '').replace('.', ''),
      time_stamp: Math.round(parseInt((new Date().getTime() / 1000).toFixed(1))),
    };
    //Object.assign()
    return new Promise(resolve => {
      var res = request.post(
        {
          url,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, formData: options
        }, (err, res, body) => {
          if (err) console.error('err:', err);
          else {
            delete options.image;
            console.log(`request url:${url}   `, options);
            resolve(JSON.parse(body));

          }
        });
    });


  }



  constructor(private appId: string, private appKey: string) { }
}