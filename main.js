const { basename, join } = require('path');
const { existsSync, readdirSync, renameSync } = require('fs');
const { default: axios } = require("axios");
const admin = require("firebase-admin");
const fileName = process.argv[2];

existsSync(join(__dirname, '.env')) && require('dotenv').config();

const { FIREBASE_CREDENTIAL_URL } = process.env;

!async function () {
  await init();
  const videos = readdirSync(__dirname, { encoding: 'utf-8' }).filter(file => file.includes(fileName));
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
  const now = Date.now();
  const storage = admin.storage().bucket();
  const newFileName = now + '-' + fileName;
  const destFile = join(__dirname, newFileName);

  // rename with timestamp
  renameSync(filePath, destFile);

  console.log('uploading "%s"', newFileName);
  await storage.upload(destFile);
  await storage.file(newFileName).makePublic();
  console.log('uploaded to https://storage.googleapis.com/workflows-test-13c0a.appspot.com/%s', newFileName)
}

function init() {
  return axios(FIREBASE_CREDENTIAL_URL).then(({ data }) => admin.initializeApp({
    databaseURL: 'https://workflows-test-13c0a-default-rtdb.firebaseio.com',
    storageBucket: 'workflows-test-13c0a.appspot.com',
    credential: admin.credential.cert(data),
  }));
}
