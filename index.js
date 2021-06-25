const input = process.argv[2];
const { sync } = require('glob');

sync(__dirname + '/*.mp4').forEach(file => {
  console.log(file);
})
