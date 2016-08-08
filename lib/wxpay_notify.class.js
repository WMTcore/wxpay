'use strict';
/* *
 * 类名：WxpayNotify
 * 功能：微信通知处理类
 * 详细：处理微信各接口通知返回
 */

let core_funcs = require('./wxpay_core.function');
let md5_f = require('./wxpay_md5.function');
let request = require('request');
let _ = require('lodash');
let xmlbuilder = require('xmlbuilder');
let xml2js = require('xml2js');
let Promise = require('bluebird');
let fs = require('fs');

function WxpayNotify(wxpay_config) {
    this.wxpay_config = wxpay_config;
}

/**
 * 针对notify_url验证消息是否是微信发出的合法消息
 * @return 验证结果
 */
WxpayNotify.prototype.verifyNotify = function(_POST, callback) {
    if (Object.keys(_POST).length == 0) { //判断POST来的数组是否为空
        callback(false);
    } else {
        //生成签名结果
        callback(this.getSignVerify(_POST, _POST.sign));
    }
}

/**
 * 针对return_url验证消息是否是微信发出的合法消息
 * @return 验证结果
 */
WxpayNotify.prototype.verifyReturn = function(_GET, callback) {
    if (Object.keys(_GET).length == 0) { //判断POST来的数组是否为空
        callback(false);
    } else {
        //生成签名结果
        callback(this.getSignVerifyRSA(_GET, _GET["sign"]));
    }
}

/**
 * 获取返回时的签名验证结果
 * @param para_temp 通知返回来的参数对象
 * @param sign 返回的签名结果
 * @return 签名验证结果
 */
WxpayNotify.prototype.getSignVerify = function(para_temp, sign) {
    //除去待签名参数数组中的签名参数
    let para_filter = core_funcs.paraFilter(para_temp);

    //对待签名参数数组排序
    let para_sort = core_funcs.argSort(para_filter);

    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    let prestr = core_funcs.createLinkstring(para_sort);
console.error(prestr);
    return md5_f.md5Verify(prestr, sign, this.wxpay_config['Key']);
}

/**
 * 远程获取数据，POST模式
 * @param parsed_url 指定URL完整路径地址
 * @param postData 需要post的数据
 * @param infoList 需要获取的参数
 * return 远程输出的数据
 */
WxpayNotify.prototype.getHttpResponsePOST = function(parsed_url, postData, infoList) {
    let self = this;
    return new Promise(function(resolve, reject) {
        request.post({
            url: parsed_url,
            form: xmlbuilder.create('xml', {
                headless: true
            }).ele(postData).end({
                pretty: true
            })
        }, function(error, res, body) {
            Promise.promisify(new xml2js.Parser({
                explicitArray: false,
                explicitRoot: false
            }).parseString)(body).then(function(body) {
                if (body.return_code != 'SUCCESS' || body.result_code != 'SUCCESS')
                    reject(_.pick(body, ['return_msg', 'err_code', 'err_code_des']));
                self.verifyNotify(body, function(verify_result) {
                    if (verify_result) { //验证成功
                        resolve(_.pick(body, infoList));
                    } else {
                        reject("verify_fail");
                    }
                })
            })
        })
    });
};

/**
 * https 远程获取数据，POST模式
 * @param parsed_url 指定URL完整路径地址
 * @param postData 需要post的数据
 * @param infoList 需要获取的参数
 * return 远程输出的数据
 */
WxpayNotify.prototype.getHttpsResponsePOST = function(parsed_url, postData, infoList) {
    let self = this;
    return new Promise(function(resolve, reject) {
        request.post({
            url: parsed_url,
            cert: fs.readFileSync(self.wxpay_config.certFile),
            key: fs.readFileSync(self.wxpay_config.keyFile),
            ca: fs.readFileSync(self.wxpay_config.caFile),
            form: xmlbuilder.create('xml', {
                headless: true
            }).ele(postData).end({
                pretty: true
            })
        }, function(error, res, body) {
            console.error(body)
            Promise.promisify(new xml2js.Parser({
                explicitArray: false,
                explicitRoot: false
            }).parseString)(body).then(function(body) {
                if (body.return_code != 'SUCCESS' || body.result_code != 'SUCCESS')
                    reject(_.pick(body, ['return_msg', 'err_code', 'err_code_des']));
                self.verifyNotify(body, function(verify_result) {
                    console.error(verify_result,body)
                    if (verify_result) { //验证成功
                        resolve(_.pick(body, infoList));
                    } else {
                        reject("verify_fail");
                    }
                })
            })
        })
    })
};

exports.WxpayNotify = WxpayNotify;