var fs = require('fs');
var gm = require('gm');
var s3 = require('s3');
var async = require('async');

// INITIALIZE

require('dotenv').config();
if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY) {
	throw "[Error: missing access keys in .env]"
} else if (!process.env.AWS_BUCKET) {
	throw "[Error: missing bucket in .env]"
}

var bucket = process.env.AWS_BUCKET;

var client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  }
});

// JPEG DEFINITION

var JPEG = function(filename){
	var self = this;
	this.q = async.queue(function(task, callback) {
    callback();
	}, 1);
	this.q.drain = function() {
		process.stdout.write('▓ ' + self.stream.length + ' \n')
	}

	this.q.parent = this;
	this.stream = null;
	// TODO: default will later be false
	this.local = true;

	this.filename = filename;

	if (!filename) {
		throw '[Error: new JPEG(filename) missing required param: filename]'
	}
}

// crust a jpeg
JPEG.prototype.crust = function(quantity,quality) {
	var quantity = quantity ? quantity : 1;
	var quality = quality ? quality : 20;
	for (var i=0;i<quantity;i++) {
		var self = this;
		var n = i;
		this.q.push({name: 'crust'},function(err) {
			self.q.pause();
			// Process image
			gm(self.stream, self.filename)
			// we don't really get any solid data loss unless we slowly decrease the quality
			.quality((quality - (quality / quantity * n)))
			.toBuffer('JPEG',function(err,output) {
			  if (err) throw err;
				// Save stream output
				if (output) {
					self.stream = output;
					self.q.resume();
					process.stdout.write('▒');
				} else {
					throw '[Error: no output from gm.toBuffer]'
				}
			});
		});
	}
	return this
}

JPEG.prototype.load = function() {
	if (this.filename) {
		var self = this;
		this.q.push({name: 'load'},function(err) {
			if (self.local) {
				self.stream = fs.createReadStream(self.filename);
			} else {
				self.stream = client.downloadStream({Bucket: bucket, Key: self.filename});
			}
		});
		return this
	} else {
		throw '[Error: JPEG.load: this.filename is undefined]'
	}
}

JPEG.prototype.save = function(filename) {
	if (filename) {
		var self = this;
		this.q.push({name: 'save'},function(err) {
			if (self.stream) {
				self.q.pause()
				// TODO: implement back-to-s3 mode
				//var obj = new AWS.S3({params: {Bucket: 'myBucket', Key: 'myKey'}});
				//obj.upload({Body: body}).
				  //on('httpUploadProgress', function(evt) { console.log(evt); }).
				  //send(function(err, data) { console.log(err, data) });
				if (self.local) {
					var output = './' + filename;
					var filestream = fs.createWriteStream(output);
					filestream.write(self.stream);
					filestream.end();
					filestream.on('finish',function(){
						self.q.resume()
					});
				} else {
					throw '[Error: JPEG.save not yet implemented in AWS mode]'
				}

			} else {
				throw '[Error: JPEG.stream is null]'
				}
		});
		return this
	} else {
		throw '[Error: JPEG.save(file) missing required param: file]'
	}
}

// START


var jpeg = new JPEG('cockatoo.jpg');
jpeg.local = false;
jpeg.load().crust(1,40).save('cockatoo.jpg');
/*
jpeg = new JPEG('cockatoo.jpg').load().crust(2,40).save('output/cockatoo/2.jpg');
jpeg = new JPEG('cockatoo.jpg').load().crust(3,40).save('output/cockatoo/3.jpg');
jpeg = new JPEG('cockatoo.jpg').load().crust(4,40).save('output/cockatoo/4.jpg');
jpeg = new JPEG('cockatoo.jpg').load().crust(20,40).save('output/cockatoo/20.jpg');
jpeg = new JPEG('cockatoo.jpg').load().crust(40,40).save('output/cockatoo/40.jpg');
jpeg = new JPEG('cockatoo.jpg').load().crust(80,40).save('output/cockatoo/80.jpg');
jpeg = new JPEG('cockatoo.jpg').load().crust(200,40).save('output/cockatoo/200.jpg');
jpeg = new JPEG('cockatoo.jpg').load().crust(400,40).save('output/cockatoo/400.jpg');
*/
