'use strict';

let env = process.env.NODE_ENV || 'development';
let _ = require('lodash');
let express = require('express');
let router = express.Router();
let wxpay = require('../../lib');

let PARAM_CONFIG = {
	'pay_check': ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip'],
	'refund_check': ['out_refund_no', 'out_trade_no', 'refund_fee', 'total_fee']
};

//支付接口
/*data{
    body:''//商品描述,
    out_trade_no:''//商户订单号,
    total_fee:''//金额,
    spbill_create_ip:''//终端IP,
    product_id：''//商品id 选,
    detail:''//商品详情 选
    attach：''//附加数据 选
    time_start:''//订单生成时间 yyyyMMddHHmmss  选
    time_expire:''//订单失效时间，格式为yyyyMMddHHmmss  选
    fee_type:''//货币类型 选
 }*/
router.get('/wxpay', function(req, res, next) {
	let e = req.query;
	console.info('wxpay params:', e);
	let args = _.pick(e, PARAM_CONFIG.pay_check);
	if (_.keys(args).length === PARAM_CONFIG.pay_check.length) {
		try {
			return wxpay.jdpay_import_pay(e, res);
		} catch (error) {
			console.error('wxpay_pay error:', error);
			return res.status(500).json({
				'message': '服务端错误'
			});
		}
	} else {
		return res.status(400).json({
			'message': '参数错误'
		})
	}

});

/**
 * 退款
 * query{
 *  out_refund_no:'',//商户退款流水号
 *  out_trade_no: '', //原商户订单流水号
 *  total_fee:'', //总金额 分
 *  refund_fee：'',//退款金额 分
 *  refund_fee_type :'',// 货币种类 选填
 * }
 */
router.get('/wxpay_refund', function(req, res, next) {
	let e = req.query;
	console.info('wxpay_refund params:', e);
	let args = _.pick(e, PARAM_CONFIG.refund_check);
	if (_.keys(args).length === PARAM_CONFIG.refund_check.length) {
		try {
			return wxpay.wxpay_refund(e, res).then(function(info) {
				return res.status(200).json(info);
			}, function(error) {
				console.error('wxpay_refund error:', error);
				return res.status(500).json({
					'message': '服务端错误',
					'error': error
				});
			});
		} catch (error) {
			console.error('wxpay_refund error:', error);
			return res.status(500).json({
				'message': '服务端错误'
			});
		}
	} else {
		return res.status(400).json({
			'message': '参数错误'
		})
	}
});

module.exports = router;