require('dotenv').config()
const { TwitterClient } = require('twitter-api-client')
const axios = require('axios')
const cron = require('node-cron');

const twitterClient = new TwitterClient({
  apiKey: process.env.TWITTER_API_KEY,
  apiSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

function tweetQuote() {
  axios.get('https://api.quotable.io/random')
    .then(response => {
      const data = response.data ?? {}
      if (data.length < 150) {
        const tweet = `
        "${data.content}"
                                                                                          ~ ${data.author}

(${daysIntoYear()})
      `

        twitterClient.tweets.statusesUpdate({
          status: tweet
        }).then(response => {
          console.log("Tweeted!", response)
        }).catch(err => {
          console.error(err)
        })
      }


    }).catch(err => {
      console.error(err)
    })
}

function tweetQuran() {
  const randomAyah = Math.floor(Math.random() * 6236) + 1;
  axios.get(`http://api.alquran.cloud/v1/ayah/${randomAyah}/en.asad`)
    .then(response => {
      const data = response.data.data ?? {}
      const tweet = `
        "${data.text}"

(${data.surah.englishName}: ${data.surah.numberOfAyahs})
      `

      twitterClient.tweets.statusesUpdate({
        status: tweet
      }).then(response => {
        console.log("Tweeted!", response)
      }).catch(err => {
        console.error(err)
      })




    }).catch(err => {
      console.error(err)
    })
}

function daysIntoYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;

  const year = now.getFullYear();
  const totalDaysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

  const dayOfYear = Math.floor(diff / oneDay);
  return `${dayOfYear}/${totalDaysInYear}`;
}

cron.schedule('07 02 * * *', () => {
  tweetQuote();
  tweetQuran();
});