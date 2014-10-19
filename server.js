var express = require('express'),
    app = express(),
    util = require('util'),
    twitter = require('twitter'),
    TwitterMiner = require('./twitterMiner'),
    nconf = require('nconf');
require('sugar');

nconf.argv()
    .env()
    .file({
        file: 'config.json'
    });

app.use(express.static(__dirname));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var twit = new twitter({
    consumer_key: nconf.get('twitter:consumerKey'),
    consumer_secret: nconf.get('twitter:consumerSecret'),
    access_token_key: nconf.get('twitter:tokenKey'),
    access_token_secret: nconf.get('twitter:tokenSecret')
});

var twitterMiner = new TwitterMiner(twit);
twitterMiner.getFriends(26554627, true, function(network) {
    console.log("Done", network.length);
});

app.get('/login', function(req, res) {
    var authUrl = graph.getOauthUrl({
        "client_id": nconf.get('appId'),
        "redirect_uri": "http://localhost:3000/authorized",
        "scope": "user_friends,user_interests,user_likes"
    });
    res.redirect(authUrl);
});

app.get('/getNetwork', function(req, res) {
    var twitterMiner = new TwitterMiner(twit);
    twitterMiner.getFriends(req.query.id, true, function(network) {
        res.send(network);
    });
});

app.get('/authorized', function(req, res) {
    console.log(req.query.code);
    graph.authorize({
        "client_id": nconf.get('appId'),
        "client_secret": nconf.get('appSecret'),
        "redirect_uri": "http://localhost:3000/authorized",
        "code": req.query.code
    }, function(err, facebookRes) {
        res.redirect('/goodGodItWorks');

        var accessToken = facebookRes.access_token;
        graph.setAccessToken(accessToken);
        graph.get('me/friends', {
            offset: 5,
            limit: 5000
        }, function(err, res) {
            console.log(res);
        });
    });
});

var server = app.listen(3000, function() {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
});
