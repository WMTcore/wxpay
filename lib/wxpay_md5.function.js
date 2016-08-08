'use strict';

/* *
 * MD5
 * 详细：MD5加密
 */
let crypto = require('crypto');

/**
 * 签名字符串
 * @param prestr 需要签名的字符串
 * @param key 私钥
 * return 大写签名结果
 */

exports.md5Sign = function(prestr, key) {
    prestr = prestr + '&key=' + key;
    return crypto.createHash('md5').update(prestr, 'utf8').digest("hex").toUpperCase();
}

/**
 * 验证签名
 * @param prestr 需要签名的字符串
 * @param sign 签名结果
 * @param key 私钥
 * return 签名结果
 */

exports.md5Verify = function(prestr, sign, key) {
    prestr = prestr + '&key=' + key;
    let mysgin = crypto.createHash('md5').update(prestr, 'utf8').digest("hex").toUpperCase();

    if (mysgin == sign) {
        return true;
    } else {
        return false;
    }
}