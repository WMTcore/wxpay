'use strict';
/* *
 * 类名：WxpaySubmit
 * 功能：微信各接口请求提交类
 * 详细：构造微信各接口表单HTML文本，获取远程HTTP数据
 */

let core_funcs = require('./wxpay_core.function');
let md5_f = require('./wxpay_md5.function');
let _ = require('lodash');
// let DOMParser = require('xmldom').DOMParser;

function WxpaySubmit(wxpay_config) {
    this.wxpay_config = wxpay_config;
}

/**
 * 生成签名结果
 * @param para_sort 已排序要签名的数组
 * return 签名结果字符串
 */
WxpaySubmit.prototype.buildRequestMysign = function(para_sort) {
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    let prestr = core_funcs.createLinkstring(para_sort);

    let mysign = md5_f.md5Sign(prestr, this.wxpay_config['Key']);

    return mysign;
}

/**
 * 生成要请求给微信的参数数组
 * @param para_temp 请求前的参数数组
 * @return 要请求的参数数组
 */
WxpaySubmit.prototype.buildRequestPara = function(para_temp) {
    //除去待签名参数数组中的签名参数
    let para_filter = core_funcs.paraFilter(para_temp);

    //对待签名参数数组排序
    let para_sort = core_funcs.argSort(para_filter);

    //生成签名结果
    let sign_data = this.buildRequestMysign(para_sort);

    //签名结果加入请求提交参数组中
    para_sort['sign'] = sign_data;

    return para_sort;
}

/**
 * 生成要请求给微信的参数数组
 * @param para_temp 请求前的参数数组
 * @return 要请求的参数数组字符串
 */
WxpaySubmit.prototype.buildRequestParaToString = function(para_temp) {
    //待请求参数数组
    let para = this.buildRequestPara(para_temp);

    //把参数组中所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串，并对字符串做urlencode编码
    let request_data = core_funcs.createLinkstringUrlencode(para);

    return request_data;
}

/**
 * 建立请求，以表单HTML形式构造（默认）
 * @param para_temp 请求参数数组
 * @param method 提交方式。两个值可选：post、get
 * @param button_name 确认按钮显示文字
 * @return 提交表单HTML文本
 */
WxpaySubmit.prototype.buildRequestForm = function(para_temp, url) {
    let para = this.buildRequestPara(para_temp);

    let sHtml = "<form id='jdpaysubmit' method='post' name='jdpaysubmit' target= '_blank' action='" + url + "'>";

    // let sHtml = "<form id='jdpaysubmit' name='jdpaysubmit' action='" +url + "?_input_charset=utf8' method='post'>";

    for (let key in para) {
        let val = para[key];

        sHtml += "<input type='hidden' name='" + key + "' value='" + val + "'/>";
    }

    // sHtml += "<input type='hidden' name='input_charset' value='utf8'/>";
    //submit按钮控件请不要含有name属性
    sHtml = sHtml + "<input type='submit' value='确认'></form>";

    sHtml = sHtml + "<script>document.forms['jdpaysubmit'].submit();</script>";

    return sHtml;
}

exports.WxpaySubmit = WxpaySubmit;