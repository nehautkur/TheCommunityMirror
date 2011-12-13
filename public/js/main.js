script
	var fPic = 'http://www.communitymirrortest.com/images/green_grey/evenDarkerLogo.jpg';
	var fDesc = 'Find out what your friends really think of you!';	 
	var fCap = 'Click on the question to answer your friends question!';
	var flink;
	var fQid;
	function initialize(){
		fPic = 'http://www.communitymirrortest.com/images/green_grey/evenDarkerLogo.jpg';
		fDesc = 'Find out what your friends really think of you!';	 
		fCap = 'Click on the question to answer your friends question!';
	}
	
	function postToFeed(qid, qText){
        var fQid = qid;
        //alert(fQid+" ,"+qText);
        FB.init({appId: '201147376628942', xfbml: true, cookie: true});
        FB.ui({
          method: "stream.publish",
          display: "iframe",
          user_message_prompt: "Publish This!",
          message: qText,
          attachment: {
             name: qText,
             caption: "Help your friend by answering this question",
             description: "Here are your choices: ",
             href: 'http://apps.facebook.com/communitymirrortest/'+fQid+'/?ref=bookmarks&count=1&fb_source=bookmarks_apps&fb_bmpos=2_1',
             media:[{"type":"image",
             		 "src":'http://www.communitymirrortest.com/images/post/Logo.png',
             		 "href":'http://apps.facebook.com/communitymirrortest/?ref=bookmarks&count=1&fb_source=bookmarks_apps&fb_bmpos=2_1'},
             		 {"type":"image",
             		 "src":'http://www.communitymirrortest.com/images/post/yes.png',
             		 "href":'http://apps.facebook.com/communitymirrortest/'+fQid+'/yes/'+'?ref=bookmarks&count=1&fb_source=bookmarks_apps&fb_bmpos=2_1'},
             		 {"type":"image",
             		 "src":'http://www.communitymirrortest.com/images/post/no.png',
             		 "href":'http://apps.facebook.com/communitymirrortest/'+fQid+'/no/'+'?ref=bookmarks&count=1&fb_source=bookmarks_apps&fb_bmpos=2_1'}],
             properties:{
               "1->":{"text":"Absolutely","href":'http://apps.facebook.com/communitymirrortest/'+fQid+'/yes'},
               "2->":{"text":"Not so much!","href":'http://apps.facebook.com/communitymirrortest/'+fQid+'/no'}
             }
            },
          action_links: [{ text: 'Test yourself', href: 'http://www.communitymirrortest.com/'}]
          },function(response) {
             if (response && response.post_id) {
               window.location.replace("/");
             } else {
               window.location.replace("/");
             }
         });
       }