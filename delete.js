const { existsSync } = require('fs');
const { default: axios } = require("axios");
const admin = require("firebase-admin");

existsSync(join(__dirname, '.env')) && require('dotenv').config();

const { FIREBASE_CREDENTIAL_URL } = process.env;
const fileName = process.argv[2];

!async function () {
    await init();
    const storage = admin.storage().bucket();
    const ref = storage.file(fileName);
    if (!await ref.exists()) {
        throw "File does not exist"
    }
    await ref.delete();
    console.log('[info] Deleted');
}().catch(e => {
    console.error("[ERROR]", e, e.message);
    process.exit(1);
}).finally(() => {
    console.log('[EXIT]');
});

function init() {
    return axios(FIREBASE_CREDENTIAL_URL).then(({ data }) => admin.initializeApp({
        databaseURL: 'https://workflows-test-13c0a-default-rtdb.firebaseio.com',
        storageBucket: 'workflows-test-13c0a.appspot.com',
        credential: admin.credential.cert(data),
    }));
}