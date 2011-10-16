express = require('express');
force_domain = require('connect-force-domain');
app = module.exports = express.createServer(force_domain('www.thecommunitymirror.com'));
sys = require('sys');
fs = require('fs');
queryString = require('querystring')
https = require('https');
http = require('http');

mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/communityMirror');
var dbref = require("mongoose-dbref");
var loaded = dbref.install(mongoose);

// Create the schemas

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var DBRef = mongoose.SchemaTypes.DBRef;


require('./models/users.js');
require('./models/questions.js');
require('./models/replies.js');

Users = mongoose.model('Users');
Questions = mongoose.model('Questions');
//Replies = mongoose.model('Replies');


connect = require('connect');
auth = require('connect-auth');

require('./fb_creds.js');

//mongoStore = require('connect-mongodb');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
//  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    //store: mongoStore({
    //  dbname: 'sessions',
    //  username: '',
   //   password: ''
   // }),
    secret: 'commsecret'
  }));
  app.use(express.logger({ format: ':date :remote-addr :method :status :url' }));
  app.use(auth([
    auth.Facebook({appId : fbId, appSecret: fbSecret, scope : ["publish_stream","email"], callback: fbCallbackAddress})
  ]));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var loadFacebookAccount = function(facebook_details,loadCallback){
  Users.findOne({ facebook_id: facebook_details.user.id }, function(err,account){
    if(account){
      //console.log('A: ',account)
      loadCallback(account);
    }
    else{
      var n = new Users();
      n.email = facebook_details.user.email;
      n.username = facebook_details.user.username;
      n.type = 1;
      n.fname = facebook_details.user.first_name;
      n.lname = facebook_details.user.last_name;
      n.facebook_id = facebook_details.user.id;
      n.date = new Date();
      n.save(function(err){
        //console.log('User: ',n)
        loadCallback(n);
      });
    }
  });
}

loadAccount = function(req,loadCallback){
  if(req.isAuthenticated()){
    //load account out of database
    if(req.getAuthDetails().user.id){
      console.log('Authenticated: ',req.getAuthDetails())
      var fbook_details = req.getAuthDetails();

      loadFacebookAccount(fbook_details,loadCallback);
    }
  }
  else{
    console.log('Not authenticated!');
    loadCallback(null);
  }
}

require('./global_funcs.js');

// Routes ( Controllers )
require('./controllers/home.js');
require('./controllers/auth.js');
require('./controllers/edit.js');
require('./controllers/nod.js');
require('./controllers/user.js');
require('./controllers/getRated.js');
require('./controllers/updateRate.js');
require('./controllers/showAll.js');
require('./controllers/homePost.js');
require('./controllers/getRatedPost.js');
require('./controllers/nodPost.js');

//Only listen on $ node app.js   
if (!module.parent) {              
  app.listen(80);
  console.log("Express server listening on port %d", app.address().port)
}

  
