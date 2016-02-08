var JPEG = require('./jpeg.js');

/* Basic test */
//var test = new JPEG('test.jpg').load().crust(20).save('output.jpg');

/*var test = [];
for (var i=1;i<15;i++) {
	var num = String(i).length == 1 ? '0' + i : i;
	test[i] = new JPEG('images/vaporwave.png').load().crust(i).save('output/vaporwave'+num+'.jpg');
}*/

/*var test = [];
for (var i=1;i<15;i++) {
	var num = String(i).length == 1 ? '0' + i : i;
	test[i] = new JPEG('images/dream.png').load().fry().crust(i).save('output/test2/output_'+num+'.jpg');
}*/


var jpeg = new JPEG('images/dream.png').load().crust(20,100).fry(2).save('output.jpg');


/* More examples:

Load from and save to AWS:
var test = new JPEG('test.jpg').config({local: false}).load().crust().save('output.jpg')

Set a default JPEG quality starting point:
var test = new JPEG('test.jpg').config({quality: 80}).load().crust(200).save('output.jpg')

*/
