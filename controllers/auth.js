app.get('/logout',function(req,res,params){
  req.logout();
  if(req.headers.referer){
    res.redirect(req.headers.referer);
  }
  else
    res.redirect('/');
});

// Auth Routes
app.get('/auth/facebook', function(req,res) {
  req.authenticate(['facebook'], function(error, authenticated) {
    if(error) throw error;
    else{
      loadAccount(req,function(account){
        //console.log(req.headers.referer);
        //if(req.header('Referrer').substring(0,23) == 'http://www.facebook.com'){
          if(account){           
            console.log(account);
            res.redirect('/');
        }
      });
    }
  });
});
