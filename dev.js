require('babel-core/register')
var memwatch = require('memwatch-next');
let count = 1;
//每次进行全堆垃圾回收时，将会触发一次stats时间
memwatch.on('stats', (stats) => {
  console.log(count++, stats);
});
//如果经过连续5次垃圾回收后，内存仍然没有被释放，意味着有内存泄漏的产生，会触发一个leak事件
memwatch.on('leak', function(info) {
  console.log('---');
  console.log(info);
  console.log('---');
});
require('./server')

