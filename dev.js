var memwatch = require('memwatch-next');
let count = 1;
memwatch.on('stats', (stats) => {
  console.log(count++, stats);
});
memwatch.on('leak', function(info) {
  console.log('---');
  console.log(info);
  console.log('---');
});
require('.')

