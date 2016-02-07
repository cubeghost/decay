# decay

it's for jpeg degradation  
`JPEG.crust()` really should be named decay but it's funnier as crust tbh

basic example:

`var jpeg = new JPEG('image.jpg').crust().save('temp.jpg');`

for AWS mode:

```
var jpeg = new JPEG('image.jpg').config({local: false});
jpeg.load().crust(200).save('temp.jpg');
```
---
## methods

### new JPEG(filename)
- `filename`: local path or S3 key to open

### JPEG.config(config)
- `config`: object
	- `local`: toggle local filesystem mode. default: `true`
	- `quality`: set default JPEG quality for processing. default: `40`

### JPEG.load()
loads the image (set on `this.filename`) into the stream

### JPEG.crust([quantity],[quality])
- `quantity`: number of iterations. default: `1`
- `quality`: JPEG quality level to start from (0-100). default: `this.quality` || `40`  

lowers the JPEG quality of the stream

### JPEG.save(filename)
- `filename`: local path or S3 key to write the stream to

---
TODO: actual error handling, better documentation
