const express = require('express');
const dotenv = require('dotenv');
const request = require('request');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a document
const doc = new PDFDocument();

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/', async (req, res) => {
	try {
		const body = await fetchImage()

		// const buff = new Uint8Array(body);
		// console.log("Src : ", body)
		const buff = Buffer.from(body)
		// const imgbuff = buff.toString('base64');
		// console.log(imgbuff)
		const tmpName = await writeFileSync(buff)
		// const img = Buffer.from(imgBuff, "base64");

		// return res.json({
		// 	error: 'data:image/png;base64,' + img.toString('base64')
		// })
		// console.log('data:image/png;charset=utf-8;base64,' + buff.toString('base64'))
		// const buff = new Buffer.from(body, 'base64')
		// console.log(buff.toString('base64'))
		// const logo = await fetchImageLogo("https://i.imgur.com/2ff9bM7.png");

		doc.image(tmpName, {
			fit: [250, 300],
			align: 'center',
			valign: 'center',
		});

		doc.text("Hello World");

		// let writeStream = new stream.WritableBufferStream();

		// // pip the document to write stream
		// doc.pipe(writeStream);
		doc.pipe(fs.createWriteStream('fonts.pdf'));

		// add some content
		doc.text('Some text!', 100, 100);

		// end document
		doc.end()

		if (!unlinkSync(tmpName)) {
			return res.json({
				error: 'Clear Tmp Error.'
			})
		}
		// wait for the writing to finish
		return res.json({
			error: null
		})
	} catch (error) {
		return res.json({
			error: error.message
		})
	}

});

app.listen(port, () => {
	console.log(`[server]: Server is running at https://localhost:${port}`);
});
async function writeStreamFS(writeStream) {
	return new Promise(function (resolve, reject) {

		writeStream.on('finish', () => {
			// console log pdf as bas64 string
			resolve(writeStream.toBuffer().toString('base64'));
		});
		writeStream.on('error', function (err) {
			reject(err)
		})
	})
}
async function fetchImage() {
	// const options = {
	// 	'method': 'GET',
	// 	'hostname': 'files-accounting.urbanice.app',
	// 	'path': '/file-upload-system/user/202212/1670901818001655864-original.png',
	// };
	return new Promise(function (resolve, reject) {
		const options = {
			'method': 'GET',
			'url': 'https://accounting-s3-file-storage.s3.ap-southeast-1.amazonaws.com/file-upload-system/user/202212/1670918047003149933-original.png',
			'headers': {
			},
			'responseType': 'arraybuffer',
			'encoding': null
		};
		request(options, function (error, response) {
			if (error) reject(error);
			resolve(response.body);
		});
	})
}

function writeFileSync(content) {
	return new Promise((resolve, reject) => {
		fs.writeFile(process.cwd() + '/cccc.png', content, function (err) {
			if (!err) {
				console.log(process.cwd() + '/cccc.png')
				return resolve(process.cwd() + '/cccc.png')
			} else {
				return reject(err)
			}
		})
	})
}

function unlinkSync(filename) {
	return new Promise((resolve, reject) => {
		fs.unlink(filename, function (err) {
			if (!err) {
				return true
			} else {
				return false
			}
		})
	})
}