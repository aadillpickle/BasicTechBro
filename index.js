
const { readFile } = require('fs');
const express = require('express');
const request = require('request');
const got = require('got');
var Twit = require('twit');
var CronJob = require('cron').CronJob;


//30 2 * * *
const app = express();

var T = new Twit({
	consumer_key: process.env.API_KEY,
	consumer_secret: process.env.API_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

T.get('account/verify_credentials', {
    include_entities: false,
    skip_status: true,
    include_email: false
}, onAuthenticated)

function onAuthenticated(err){
    if (err) {
        console.log(err)
    } else {
    console.log('Authentication successful.')
	}
}

function sendTweet(tweet){
    T.post('statuses/update', {status:tweet})
}

var output = ""

const prompt = "The following is a list of tweets from prominent thought leaders and tech-bros.\n\n- If you are successful, it’s almost always because some people went out of their way to help you. You have a moral obligation to pay it forward.\n- When you're dealing with exponential growth, the time to act is when it feels too early.\n- Learn to sell. Learn to build. If you can do both, you will be unstoppable.\n-";

(async () => {
	const url = 'https://api.openai.com/v1/engines/davinci/completions';
	const params = {
		"prompt": prompt,
		"max_tokens": 281,
		"temperature": 0.8,
	"stop": ["\n- "]
	};
	const headers = {
		'Authorization': `Bearer ${process.env.GPT_TOKEN}`,
	};

	try {
		const response = await got.post(url, { json: params, headers: headers }).json();
		output = `${prompt}${response.choices[0].text}`;
	var tweets = output.split("-")
		var tweet = tweets[tweets.length - 1]
	sendTweet(tweet);
	} catch (err) {
		console.log(err);
	}
})()

app.listen(8080);