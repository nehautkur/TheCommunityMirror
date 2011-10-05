var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var qid; //save replies collection
var q_article=[]; //search questions
var q_id=[]; //search replies
var qmod;

ArticleProvider = function(host, port) {
  this.db= new Db('communityMirrorFinal', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

ArticleProvider.prototype.modifyRating = function(question,fid,reply, callback) {
	this.getCollection('questions',function(error, article_collection) {
	if( error ) callback( error );
    	else {
		article_collection.findOne({uid:fid},{n:question},function(error, result) {
		if( error ) callback( error );
	    	else {
			console.log('result: ',result);
			qmod=result._id;
			console.log('qmod: ', qmod);
			}
		});
		
		}
	});
	this.getCollection('replies',function(error, article_collection_r) {
		if( error ) callback( error );
	    	else {
			console.log('qmod In: ',qmod);
			article_collection_r.findOne({qid:qmod},function(error, result) {
			if( error ) callback( error );
		    	else {
				console.log('reply: ',result);
				if(reply === 'yes'){
					var incrRate = result.ry
					incrRate++;
					result.ry = incrRate;
				}
				else{
					var incrRate = result.rn
					incrRate++;
					result.rn = incrRate;
				}
				article_collection_r.save(result);
			}
			});
		}
	});	
	
}

ArticleProvider.prototype.addQuestionToUser = function(questions,replies, callback) {
	this.getCollection('questions',function(error, article_collection) {
//first check whether questions article is created
	if( error ) callback( error );
    	else {
	if(typeof (questions.length === 'undefined')){
		questions = [questions];
	}
	for(var i = 0; i<questions.length; i++){
		questions[i].created_at = new Date();
		//questions[i].uid = facebookId;
	} 
	article_collection.insert(questions, function() {
          callback(null, questions)
	 	qid = questions[0]._id;
	console.log('Questions: ',questions);
	});
}
});

	this.getCollection('replies',function(error, article_collection_q) {
	if( error ) callback( error );
    	else {
	//article_collection.findOne({uid: questions.uid}, function(error, result) {
          //if( error ) callback(error)
          //else { callback(null, result)
        
	console.log('id: ',qid);
	if(typeof (replies.length === 'undefined')){
		replies = [replies];
	}
	for(var i = 0; i<replies.length;i++){
		
		replies[i].qid = qid;	
	}
	article_collection_q.insert(replies,function() {
          callback(null, replies)	
		console.log('Replies: ',replies);	
	        });
	
	}
	});



	};

//getCollection

ArticleProvider.prototype.getCollection= function(article_name, callback) {
  this.db.collection(article_name, function(error, article_collection) {
    if( error ) callback(error);
    else callback(null, article_collection);
  });
};
//find questions per user **** Doubtful.. may not be working well
ArticleProvider.prototype.findQuestions = function(fid,callback) {
	this.getCollection('questions',function(error, article_collection) {
		if( error ) callback(error)
      		else {
			article_collection.find({uid:fid}).toArray(function(error, question_article){
				if( error ) callback(error)
				else{
					for(var i =0; i<question_article.length;i++){
						q_article[i]={text: question_article[i].n,
								ry:0,rn:0}
						q_id[i]=question_article[i]._id

						}
					}
					console.log('Q_art: ',question_article);
				});
			}
		
	});
	this.getCollection('replies',function(error, article_collection) {
		if( error ) callback(error)
      		else {
			for(var i = 0; i<q_id.length; i++){
				article_collection.findOne({qid:q_id[i]},function(error, reply_article){
				if( error ) callback(error)
      				else {console.log('R_art: ',reply_article);
						if(!typeof (reply_article == "undefined")){
						q_article[i].ry=reply_article[0].ry
						q_article[i].rn=reply_article[0].rn
						}
					}
				
				});		
			}
		}
		
	});
		
		callback(null,q_article)
	
}

//findAll
/*
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
};*/

//findById

ArticleProvider.prototype.findById = function(article_name, id, callback) {
	this.getCollection(article_name,function(error, article_collection) {
      if( error ) callback(error)
      else {//check out later to incorporate the other collections
        article_collection.findOne({fid: id}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
	
      }
    });
};
ArticleProvider.prototype.remove = function(callback) {
    this.getCollection('articles',function(error, article_collection) {
      if( error ) callback(error)
      else {
	console.log("inside remove");
        article_collection.remove({});
        }
	
     });
this.getCollection('questions',function(error, article_collection) {
      if( error ) callback(error)
      else {
	console.log("inside remove");
        article_collection.remove({});
        }
	
     });
this.getCollection('replies',function(error, article_collection) {
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
    this.getCollection('articles',function(error, article_collection) {
      if( error ) callback(error)
      else {
        if( typeof(articles.length)=="undefined")
          articles = [articles];

        for( var i =0;i< articles.length;i++ ) {
          article = articles[i];
          article.created_at = new Date();
	
         }	
	  article_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });

};

exports.ArticleProvider = ArticleProvider;
