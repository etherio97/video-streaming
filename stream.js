const CONFIG_FILE = [__DIR__, 'config'].join('/');
const BASE_URL = 'https://graph.facebook.com';
const [title] = process.args.slice(2);
const { FACEBOOK_PAGE_TOKEN } = process.env;
const { default: axios } = require('axios');
const { writeFileSync } = require('fs');

axios([BASE_URL, 'me', 'live_videos'].join('/'), {
    access_token: FACEBOOK_PAGE_TOKEN,
    status: 'LIVE_NOW',
    title
  })
  .then(({ data }) => {
    const { stream_url } = data;
    writeFileSync(CONFIG_FILE, stream_url, 'utf8');
  
    setTimeout(() => process.exit(0), 1200);
  });
