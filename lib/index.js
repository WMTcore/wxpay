'use strict';

let env = process.env.NODE_ENV || 'development';
let config = {
	appid: '',
	mch_id: '',
	Key: ''
}
let Wxpay = require('./wxpay').Wxpay;

let wxpay = new Wxpay(config);

wxpay.on('verify_fail', function() {
		console.log('index emit verify_fail')
	})
	.on('wxpay_trade_success', function(info) {
		console.log('test: wxpay_trade_success',info)
	})

module.exports = wxpay;