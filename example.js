var JPEG = require('./jpeg.js');

/* Basic test */
var test = new JPEG('test.jpg').load().crust(20).save('output.jpg');

/* More examples:

Load from and save to AWS:
var test = new JPEG('test.jpg').config({local: false}).load().crust().save('output.jpg')

Set a default JPEG quality starting point:
var test = new JPEG('test.jpg').config({quality: 80}).load().crust(200).save('output.jpg')

*/
