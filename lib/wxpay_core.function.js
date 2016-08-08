'use strict';

let qs = require('querystring');
let fs = require('fs');
let https = require('https');
let http = require('http');
let _ = require('lodash');
//let Iconv  = require('iconv').Iconv;

/* *
 * 微信接口公用函数
 */

/**
 * 把对象所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
 * @param para 需要拼接的对象
 * return 拼接完成以后的字符串
 */
exports.createLinkstring = function(para) {
    //return qs.stringify(para);
    let ls = '';
    for (let k in para) {
        ls = ls + k + '=' + para[k] + '&';
    }
    ls = ls.substring(0, ls.length - 1);
    return ls;
}

/**
 * 把对象所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串，并对字符串做urlencode编码
 * @param para 需要拼接的对象
 * return 拼接完成以后的字符串
 */
exports.createLinkstringUrlencode = function(para) {
    return qs.stringify(para);
}

/**
 * 除去对象中的签名参数
 * @param para 签名参对象
 * return 去掉空值与签名参数后的新签名参对象
 */
exports.paraFilter = function(para) {
    let para_filter = new Object();
    for (let key in para) {
        if (para[key] == '' || key == 'sign') {
            continue;
        } else {
            para_filter[key] = para[key];
        }
    }
    return para_filter;
}

/**
 * 对对象排序
 * @param para 排序前的对象
 * return 排序后的对象
 */
exports.argSort = function(para) {
    let result = new Object();
    let keys = Object.keys(para).sort();
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        result[k] = para[k];
    }
    return result;
}

/**
 * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
 * 注意：服务器需要开通fopen配置
 * @param word 要写入日志里的文本内容 默认值：空值
 */
exports.logResult = function(word) {
    word = word || '';
    let str = "执行日期：" + Date().toString() + "\n" + word + "\n";
    fs.appendFile('log.txt', str);
}

/**
 * 实现多种字符编码方式
 * @param input 需要编码的字符串
 * @param _output_charset 输出的编码格式
 * @param _input_charset 输入的编码格式
 * return 编码后的字符串
 */
exports.charsetEncode = function(input, _output_charset, _input_charset) {
    let output = "";
    _output_charset = _output_charset || _input_charset;
    if (_input_charset == _output_charset || input == null) {
        output = input;
    } else {
        //let iconv = new Iconv(_input_charset,_output_charset);
        //output = iconv.convert(input);
    }

    return output;
}

/**
 * 实现多种字符解码方式
 * @param input 需要解码的字符串
 * @param _output_charset 输出的解码格式
 * @param _input_charset 输入的解码格式
 * return 解码后的字符串
 */
exports.charsetDecode = function(input, _input_charset, _output_charset) {
    let output = "";
    _input_charset = _input_charset || _output_charset;
    if (_input_charset == _output_charset || input == null) {
        output = input;
    } else {
        //let iconv = new Iconv(_input_charset,_output_charset);
        //output = iconv.convert(input);
    }

    return output;
}

/**
 * 4字节大小端数据转换
 * @param data 待转数据
 * return 转换好的数据
 */
exports.swapUInt32 = function(data) {
    let array = new Buffer(4);
    array[0] = (data >> 24 & 0xff);
    array[1] = (data >> 16 & 0xff);
    array[2] = (data >> 8 & 0xff);
    array[3] = (data & 0xff);
    return array
}

/**
 * 随机字符串生成
 * @param len 字符串长度
 * return 生成的字符串
 */
exports.getRndStr = function(len) {
    let s = '';
    for (let i = 0; i < len; i++) {
        s += Math.random() > 0.5 ? parseInt(Math.random() * 9) : String.fromCharCode(parseInt(Math.random() * 25) + (Math.random() > 0.5 ? 65 : 97));
    }
    return s
}