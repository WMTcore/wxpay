'use strict';

let iconv = require('iconv-lite');


exports.extendBodyParser = (req, res, next) => {
	if (Object.keys(req.body).length > 0) next();

	//使用下面的方式拼接buffer,可以支持更多的编码.也可直接req.setEncoding('utf8'),然后字符串拼接,但只限UTF-8、Base64和UCS-2/UTF-16LE
	let chunks = [],
		size = 0;
	req.on('data', chunk => {
		chunks.push(chunk);
		size += chunk.length;
	});
	req.on('end', () => {
		try {
			req.body = iconv.decode(Buffer.concat(chunks, size), 'utf8');
		} catch (e) {
			console.error(e)
		} finally {
			next();
		}
	})
}