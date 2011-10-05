var connect = require('connect')
   ,auth= require('/lib/index')
   ,url = require('url')
   ,fs = require('fs')
   ,mongoStore = require('connect-mongodb')
   ,ArticleProvider = require('./articleprovider-mongodb').ArticleProvider
   ,articleProvider = new ArticleProvider('localhost', 27017);

var OAuth= require('oauth').OAuth;
var user;

//Setup connection to the mongodb


var getSharedSecretForUserFunction = function(user,  callback) {
	var result;
	if(user == 'foo') 
		result= 'bar';
	callback(null, result);
};

var validatePasswordFunction = function(username, password, successCallback, failureCallback){
	if (username === 'foo' && password === "bar"){
		successCallback();
	} else {
		failureCallback();
	}
};

// N.B. TO USE Any of the OAuth or RPX strategies you will need to provide
// a copy of the example_keys_file (named keys_file) 
try {
  var example_keys= require('./keys_file');
  for(var key in example_keys) {
    global[key]= example_keys[key];
  }
}
catch(e) {
  console.log('Unable to locate the keys_file.js file.  Please copy and ammend the example_keys_file.js as appropriate');
  return;
}

// Setup the 'template' pages (don't use sync calls generally, but meh.)
var authenticatedContent= fs.readFileSync( __dirname+"/public/profile.html", "utf8" );
var unAuthenticatedContent= fs.readFileSync( __dirname+"/public/profile.html", "utf8" );
var profileContent= fs.readFileSync( __dirname+"/public/profile.html", "utf8" );


// There appear to be Scurrilous ;) rumours abounding that connect-auth
// doesn't 'work with connect' as it does not act like an 'onion skin'
// to address this I'm showing how one might extend the *PRIMITIVES* 
// provided by connect-auth to simplify a middleware layer. 

// This middleware detects login requests (in this case requests with a query param of ?login_with=xxx where xxx is a known strategy)
var example_auth_middleware= function() {
  return function(req, res, next) {
    var urlp= url.parse(req.url, true)
    if( urlp.query.login_with ) {
      req.authenticate([urlp.query.login_with], function(error, authenticated) {
        if( error ) {
          // Something has gone awry, behave as you wish.
          console.log( error );
          res.end();
      }
      else {
          if( authenticated === undefined ) {
            // The authentication strategy requires some more browser interaction, suggest you do nothing here!
          }
          else {
            // We've either failed to authenticate, or succeeded (req.isAuthenticated() will confirm, as will the value of the received argument)
            next();
          }
      }});
    }
    else {
      next();
    }
  }
};

  
function routes(app) {
  app.get ('/logout', function(req, res, params) {
    req.logout(); // Using the 'event' model to do a redirect on logout.
  })

app.post('/newq', function(req, res){
	if(req.isAuthenticated()){
	
//	console.log(req.getAuthDetails().user);
	console.log('Question is:' ,req.body.question);
	articleProvider.findById('articles',user.id, function(err,p){
	if(!p){
		articleProvider.save(
		//add new user
			{fid: req.getAuthDetails().user.id //facebook id
			,fun: req.getAuthDetails().user.username // facebook username
			,ffn: req.getAuthDetails().user.first_name //facebook first name
			,fln: req.getAuthDetails().user.last_name //facebook last name
			,flk: req.getAuthDetails().user.link //facebook url
			,floc: req.getAuthDetails().user.location //facebook location
			,fgen: req.getAuthDetails().user.gender //facebook gender
			,created_at: new Date()
			}, function( error, docs) {
		       		
	    	});
	}
	//else{ add question to existing user
	console.log('p is not null',p);
	articleProvider.addQuestionToUser(({n:req.body.question //question text
		,t:1 //custom question //type of question 1: custom, 2:category
		,created_at : new Date()
		,uid:user.id})
		,({ry:0,rn:0,qid:0,updated_at:new Date})
		, function (error,docs){
			//res.end( authenticatedContent.replace('<div class="Txt_dynamic_save"></div>', '<div class="Txt_dynamic_save">Saved Question</div>' ) );
	    });
	//}
	});
	articleProvider.findQuestions(user.id, function(error,docs){
        console.log('Docs',docs);
	var replaceContent = '<div name="uq"></div>';
	if(typeof (docs!== undefined) && docs!=null){
	for(var i = 0; i<docs.length;i++){
		//var q = docs.qs[i].q;
		//console.log('This:',q);
		var question = docs[i].text;
		console.log('Question: '+question);
		var yes = docs[i].ry;
		var no = docs[i].rn;
		replaceContent = replaceContent + '<form action="http://localhost:8000/getRate" method="post"><tr><td><input type="hidden" name="question1" value='+question+'/>'+question+'</td><td><input type="submit" value="Yes" class="button" name="yes"/><td><input type="hidden" name="ry" value='+yes+'/>'+yes+'</td></td><td><input type="submit" value="No" class="button" name="no"/></td><td><input type="hidden" name="rn" value='+no+'/>'+no+'</td></tr></form>';
		
	}
	}
})

	res.end(profileContent.replace('<div name="uq"></div>',replaceContent));
        
	}
	else{
		res.end( authenticatedContent.replace('<div class="Txt_dynamic_save"></div>', '<div class="Txt_dynamic_save">You need to login to post questions!</div>' ) );
	}
})
  app.get(/.*/, function(req, res, params) {
   if( req.isAuthenticated() ) {
	 /*articleProvider.remove(function(err,p){
	if(!p)
		console.log('error in removing data');
	});*/
	user = req.getAuthDetails().user;
      /*res.end( authenticatedContent.replace('<div class="Txt_dynamic"></div>','<div class="Txt_dynamic">'+ JSON.stringify( req.getAuthDetails().user.first_name )+' </div>' ) );*/
	articleProvider.findQuestions(user.id, function(error,docs){
        console.log('Docs',docs);
	var replaceContent = '<div name="uq"></div>';
	if(typeof (docs!== undefined) && docs!=null){
	for(var i = 0; i<docs.length;i++){
		//var q = docs.qs[i].q;
		//console.log('This:',q);
		var question = docs[i].text;
		console.log('Question: '+question);
		var yes = docs[i].ry;
		var no = docs[i].rn;
		replaceContent = replaceContent + '<form action="http://localhost:8000/getRate" method="post"><tr><td><input type="hidden" name="question1" value='+question+'/>'+question+'</td><td><input type="submit" value="Yes" class="button" name="yes"/><td><input type="hidden" name="ry" value='+yes+'/>'+yes+'</td></td><td><input type="submit" value="No" class="button" name="no"/></td><td><input type="hidden" name="rn" value='+no+'/>'+no+'</td></tr></form>';
		
	}
	}
 res.end(profileContent.replace('<div name="uq"></div>',replaceContent));
 })

          	 
            
          
          
	
	
    }
    else {
      res.end( unAuthenticatedContent.replace('<div class="Txt_dynamic_save"></div>', '<div class="Txt_dynamic_save">'+req.url+'</div>' ));
    }
  })
app.post('/getRate', function(req, res){
console.log('Question is:' ,req.body.question1);
var reply;
if(req.body.yes === undefined){
	reply = 'no';
	value = req.body.rn++;
	console.log('Response is: ',req.body.no);
}
else{
	console.log('Response is: ',req.body.yes);
	reply= 'yes';
	value = req.body.ry++;
}
/*********NOT WORKING*******
        console.log(docs);
	res.end(profileContent);
	});
*******************/
	articleProvider.modifyRating(req.body.question1,user.id,reply, function(error,docs){
		         	 
             res.end("");
         });
})
}

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.stack);
});

var server= connect.createServer( 
                      connect.static(__dirname + '/public'),
                      connect.cookieParser(), 
                      connect.session({secret: 'FlurbleGurgleBurgle', 
                                       store: new connect.session.MemoryStore({ reapInterval: -1 }) }),
                      connect.bodyParser() /* Only required for the janrain strategy*/,
                      connect.compiler({enable: ["sass"]}),
                      auth( {strategies:[ auth.Anonymous()
                                        , auth.Basic({validatePassword: validatePasswordFunction})
                                        , auth.Bitbucket({consumerKey: bitbucketConsumerKey, consumerSecret: bitbucketConsumerSecret, callback: bitbucketCallbackAddress})
                                        , auth.Digest({getSharedSecretForUser: getSharedSecretForUserFunction})
                                        , auth.Http({validatePassword: validatePasswordFunction, getSharedSecretForUser: getSharedSecretForUserFunction})
                                        , auth.Never()
                                        , auth.Twitter({consumerKey: twitterConsumerKey, consumerSecret: twitterConsumerSecret})
                                        , auth.Facebook({appId : fbId, appSecret: fbSecret, scope: "email", callback: fbCallbackAddress})
                                        , auth.Github({appId : ghId, appSecret: ghSecret, callback: ghCallbackAddress})
                                        , auth.Yahoo({consumerKey: yahooConsumerKey, consumerSecret: yahooConsumerSecret, callback: yahooCallbackAddress})
                                        , auth.Google({consumerKey: googleConsumerKey, consumerSecret: googleConsumerSecret, scope: "", callback: googleCallbackAddress})
                                        , auth.Google2({appId : google2Id, appSecret: google2Secret, callback: google2CallbackAddress})
                                        , auth.Foursquare({appId: foursquareId, appSecret: foursquareSecret, callback: foursquareCallbackAddress})
                                        , auth.Janrain({apiKey: janrainApiKey, appDomain: janrainAppDomain, callback: janrainCallbackUrl})
                                        , auth.Getglue({appId : getGlueId, appSecret: getGlueSecret, callback: getGlueCallbackAddress})
                                        , auth.Openid({callback: openIdCallback})
                                        ],
                             trace: true,
                             logoutHandler: require('/lib/events').redirectOnLogout("/")
			     
                             }),
                      example_auth_middleware(),
                      connect.router(routes));

server.listen(8000);
console.log('Server listening on port 8000');
