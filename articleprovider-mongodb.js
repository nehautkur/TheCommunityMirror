var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ArticleProvider = function(host, port) {
  this.db= new Db('communityMirror', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

ArticleProvider.prototype.addQuestionToUser = function(facebookId, question, callback) {
  this.getCollection(function(error, article_collection) {
    if( error ) callback( error );
    else {
	console.log("inside update");
      article_collection.update(
        {fid: facebookId},
        {"$push": {qs: question}},
        function(error, article){
          if( error ) callback(error);
          else callback(null, article)
        });
    }
  });
};

//getCollection

ArticleProvider.prototype.getCollection= function(callback) {
  this.db.collection('articles', function(error, article_collection) {
    if( error ) callback(error);
    else callback(null, article_collection);
  });
};

//findAll
ArticleProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//findById

ArticleProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({fid: id}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
	
      }
    });
};
ArticleProvider.prototype.remove = function(callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
	console.log("inside remove");
        article_collection.remove({});
        }
	
     });
};
//save
ArticleProvider.prototype.save = function(articles, callback) {	
    console.log("Inside Save");
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        if( typeof(articles.length)=="undefined")
          articles = [articles];

        for( var i =0;i< articles.length;i++ ) {
          article = articles[i];
          article.created_at = new Date();
	
         }
	if( article.qs === undefined ) article.qs = [];
        article_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });

};

exports.ArticleProvider = ArticleProvider;
