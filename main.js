const { basename, join } = require('path');
const { existsSync, readdirSync, renameSync } = require('fs');
const { default: axios } = require("axios");
const admin = require("firebase-admin");

existsSync(join(__dirname, '.env')) && require('dotenv').config();

const { FIREBASE_CREDENTIAL_URL } = process.env;

!async function () {
  await init();
  const videos = readdirSync(__dirname, { encoding: 'utf-8' }).filter(file => file.includes('.mp4'));
  console.log('[info] uploading %d file(s)...', videos.length);
  for (let video of videos) {
    await uploadFile(video)
  }
}().catch(e => {
  console.error("[ERROR]", e, e.message);
  process.exit(1);
}).finally(() => {
  console.log('[EXIT]');
});

async function uploadFile(filePath) {
  const storage = admin.storage().bucket();
  const fileName = `${Date.now()}-${basename(filePath)}`;
  const destFile = join(__dirname, fileName);

  // rename with timestamp
  renameSync(filePath, destFile);

  console.log('uploading "%s"', fileName);
  await storage.upload(destFile);
  await storage.file(fileName).makePublic();
  console.log('uploaded to https://storage.googleapis.com/workflows-test-13c0a.appspot.com/%s', fileName)
}

function init() {
  return axios(FIREBASE_CREDENTIAL_URL).then(({ data }) => admin.initializeApp({
    databaseURL: 'https://workflows-test-13c0a-default-rtdb.firebaseio.com',
    storageBucket: 'workflows-test-13c0a.appspot.com',
    credential: admin.credential.cert(data),
  }));
}
