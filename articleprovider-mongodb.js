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
/*
* Updates rating on the question according to reply (yes/no)
*/

/*
ArticleProvider.prototype.modifyRating = function(facebookId, reply, question,newValue,callback) {
  this.getCollection(function(error, article_collection) {
    if( error ) callback( error );
    else {
	console.log("inside update rating");
	//article_collection.findById(facebookId, function(err, result){
	article_collection.findOne({fid: facebookId}, function(error, result) {
		if( error ) callback( error );
		else{
			if(reply==='yes'){	      	
				if(result!=null){
					result.update({qs :{q:{q:{n:question}}}},
		       			{"$set": {qs :{q:{q:{ry:{v: newValue}}}}}},
					{"$set": {qs :{q:{q:{rn:{updated_at: new Date()}}}}}},
					function(error, article){
			  			if( error ) callback(error);
			  			else callback(null, article)
					});
				}
			}
			else{
				if(result!=null){
					result.update({qs :{q:{q:{n:question}}}},
					{"$set": {qs :{q:{q:{rn:{v:newValue}}}}}}, 
					{"$set": {qs :{q:{q:{rn:{updated_at: new Date()}}}}}},
					function(error, article){
				  		if( error ) callback(error);
				  		else callback(null, article)
					});
				}
			} 
		}
	});
	}
    });
};

ArticleProvider.prototype.modifyRating = function(facebookId, reply, question,newValue,callback) {
  this.getCollection(function(error, article_collection) {
    if( error ) callback( error );
    else {
	console.log("inside update rating");
	if(reply==='yes'){	
	//article_collection.findById(facebookId, function(err, result){
	article_collection.findOne({fid: facebookId}, {qs :{q:{q:{n:question}}}},		
		      {"$set": {qs :{q:{q:{ry:{v: newValue}}}}}},
					{"$set": {qs :{q:{q:{rn:{updated_at: new Date()}}}}}},
					function(error, article){
			  			if( error ) callback(error);
			  			else callback(null, article)
					});
		}
	else{
								
	article_collection.findOne({fid: facebookId}, {qs :{q:{q:{n:question}}}},
			{"$set": {qs :{q:{q:{rn:{v:newValue}}}}}}, 
					{"$set": {qs :{q:{q:{rn:{updated_at: new Date()}}}}}},
					function(error, article){
				  		if( error ) callback(error);
				  		else callback(null, article)
					});
				}
			} 
		
	});
};
*/
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
	 for(var j =0;j< article.qs.length; j++) {
            article.qs[j].created_at = new Date();
	    if(article.qs[j].q === undefined ){
		article.qs[j].q ={};
		}
		if(article.qs[j].q.n === undefined ){
			article.qs[j].q.n = {};
		}
		if(article.qs[j].q.t === undefined ){
			article.qs[j].q.t = {};
		}
		if(article.qs[j].q.created_at === undefined ){
			article.qs[j].q.created_at = new Date();
		}
		if(article.qs[j].q.ry === undefined ){
			article.qs[j].q.ry = {};
		}
		if(article.qs[j].q.ry.v === undefined ){
			article.qs[j].q.ry.v = {};
		}
		if(article.qs[j].q.ry.updated_at === undefined ){
			article.qs[j].q.ry.updated_at = {};
		}
		if(article.qs[j].q.rn === undefined ){
			article.qs[j].q.rn = {};
		}
		if(article.qs[j].q.rn.v === undefined ){
			article.qs[j].q.rn.v = {};
		}
		if(article.qs[j].q.rn.updated_at === undefined ){
			article.qs[j].q.rn.updated_at = {};
		}
          }
        article_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });

};

exports.ArticleProvider = ArticleProvider;
