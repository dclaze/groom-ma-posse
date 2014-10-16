var express = require('express'),
	app = express(),
	fbgraph = require('fbgraph'),
	nconf = require('nconf');

nconf.argv()
       .env()
       .file({ file: 'config.json' });

app.use(express.static(__dirname));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

app.get('/login', function(req, res){
  //   var authUrl = graph.getOauthUrl({
  //       "client_id":     conf.client_id
  //     , "redirect_uri":  conf.redirect_uri
  //     , "scope":         conf.scope
  //   });

  //   if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
  //     res.redirect(authUrl);
  //   } else {  //req.query.error == 'access_denied'
  //     res.send('access denied');
  //   }
  //   return;
  // }

  // // code is set
  // // we'll send that and get the access token
  // graph.authorize({
  //     "client_id":      conf.client_id
  //   , "redirect_uri":   conf.redirect_uri
  //   , "client_secret":  conf.client_secret
  //   , "code":           req.query.code
  // }, function (err, facebookRes) {
  //   res.redirect('/UserHasLoggedIn');
  // });
	var authUrl = fbgraph.getOauthUrl({
    "client_id":     nconf.get('appId'),
     "redirect_uri":  "http://localhost:3000/index.html",
     "scope":"user_birthday"
	});
	res.redirect(authUrl);
});



// after user click, auth `code` will be set
// we'll send that and get the access token
// graph.authorize({
//     "client_id":      conf.client_id
//   , "redirect_uri":   conf.redirect_uri
//   , "client_secret":  conf.client_secret
//   , "code":           req.query.code
// }, function (err, facebookRes) {
//   res.redirect('/loggedIn');
// });

// });

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});