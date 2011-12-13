app.all('/home', function(req, res){
  loadAccount(req,function(account){
    var nods_per_page = 5;
    var leader_limit = 3;
    var total = [];
    var userfName = [];
    var userlName = [];
    //Questions.find({},{},{sort: [['yes','descending'],['no','descending']]}, function(err,questionMax){
      
    if(account){
      console.log("Inside Home");
      /*Questions.find({},{},{sort: [['total','descending']], limit: leader_limit}, function(err,questionMax){
        console.log('Max yes responses', questionMax);
        /*for(i =0; i<questionMax.length; i++){
             (function(i) {
                setTimeout(function(){
                 questionMax[i].total = questionMax[i].yes+questionMax[i].no;
                 questionMax[i].save(function(err){
                  if (err) throw err;
                  });  
                }, 1000 * (i) );
             })(i);
          }*
          
          getQuestionUserInfo(questionMax, function(total1, userfName1, userlName1){
                  console.log('****Leaders found', total1, userfName1, userlName1)
                    total = total1;
                    userfName = userfName1;
                    userlName=userlName1;
                  console.log('****Leaders found', total1, userfName1, userlName1)*/
         
      Users.find({},{},{sort: [['totalResponses','descending']], limit: leader_limit}, function(err,userMax){
      Questions.find({user:account._id},{},{sort: [['last_update','descending']], limit: nods_per_page},function(err,questions){
        if(err) throw err;
        else{
          if(questions==='undefined'){}
          else{
            /*res.local('total', total);
            res.local('userfName', userfName);
            res.local('userlName', userlName);*/
            console.log('Users with max responses: ', userMax);
            res.local('leaders', userMax);
            res.local('nods', questions);
            res.local('account', account);
            res.local('title', 'Community Mirror');
            try{
              //console.log('**Showing profile page', res);
              res.render('profile', {layout: false});
            }
            catch(err){
              res.render('404',{layout: false});
            }
          }
        }
        });
      });
       // });
       //res.render('index', { layout: false});
      }
      else{
      //console.log('Nod: ', nods);
      res.local('nods', null);
      res.local('account', account);
      res.local('title', 'Community Mirror');
      try{
        res.render('index', { layout: false });
        //res.render('contest', { layout: false });
      }
      catch(err){
      }
    }
    
  });
  getQuestionUserInfo= function(questionMax, callback){
    var userfName=[];
    var userlName=[];
    var total=[];
    var userFacebookId = [];
    for(i =0; i<questionMax.length; i++){
           (function(i) {
              setTimeout(function(){
               Users.findOne({_id:questionMax[i].user},function(err,user){
                if (err) throw err;
                else
                {
                         console.log("***USER found",user);
                         console.log('======='+i+': ',questionMax[i]);
                         total[i] = questionMax[i].total;
                         userfName[i] = user.fname;
                         userlName[i] = user.lname;
                         userFacebookId[i] = user.facebook_id;
                } 
                 if(i== questionMax.length-1){                  
                  callback(total, userfName, userlName);
                }
                });  
              }, 1000 * (i) );
           })(i);
        }

  }
});

