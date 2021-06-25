!async function() {
  const input = process.argv[2];
  const { sync } = require('glob');
  const { default: axios } = require('axios');
  const firebaseConfig = (await axios('https://workflows-test-13c0a.web.app/__/firebase/init.json')).data;
  const videos = sync(__dirname + '/*.mp4');
  console.log(firebaseConfig, videos);
}().catch(e => {
  console.error("[ERROR]", e, e.message);
});
