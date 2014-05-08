// $(document).ready(function(){
// 	$(document).on("pageshow", "[data-role='page']", function() {
// 		// console.log($(this));
// 		if($(this).hasClass('active')){
// 			$(this).footer.addClass('ui-btn-active');
// 			
// 		}
// 	});

// });

function listPosts(data) {
	console.log(data);
	var output = "<form class='ui-filterable'><input id='searchposts' data-type='search'></form>";
		output += "<ul data-role='listview' data-filter='true' data-input='#searchposts'>";  
		$.each(data.posts, function(key, val) {

			output += '<li>';
			output += '<a href="#blogpost" onclick = "showPosts('+ val.id +')">';
			// output += '<img src="' + val.thumbnail + '" alt="' + val.title + '">';
			output += '<h3>' + val.title + '</h3>';
			output += '<h3>' + val.excerpt + '</h3>';
			output += '</a>';
			output += '</li>';
		});//go through each post	
		 
	// ============ Both ways work ============================================	 
		// for (var i = 0; i < data.posts.length; i++) {
		// 	var id = data.posts[i].id;
		// 	var title = data.posts[i].title;
		// 	var excerpt = data.posts[i].excerpt;
		// 	output += '<li>';
		// 	output += '<a href="#blogpost" onclick = "showPosts(' + id + ')">';
		// 	output += '<h3>' + title + '</h3>';
		// 	output += '<h3>' + excerpt + '</h3>';
		// 	output += '</a>';
		// 	output += '</li>';
		// }
// ==============================================================================

		output += '<ul>';
		$('#postlist').html(output);
}// listPosts

function showPosts(id) {
	$.getJSON("http://www.trulaunch.com/?json=get_post&post_id="+id+"&callback=?", function(data) {
		console.log(data);
		var output = "<h3>" + data.post.title + "</h3>";
		output +=  data.post.content ;
		$('#mypost').html(output);
	});	
}

function listVideos(data) {
	// console.log(data);
	//want to display all of the videos in rows of two
	// var output = '<ul>'; 
	//  $.each(data.feed.entry, function(key, val){
	//  	output += '<li>';
	//  	output += '<h3>' + val.content.$t + '</h3>';
	//  	output += '</li>';

	//  })
	//  console.log(output);
	//  $('#videolist').html(output);

	var output = ""; // doesnt work if this isnt here
	for (var i = 0; i < data.feed.entry.length; i++) {
		var title = data.feed.entry[i].title.$t;
		var thumbnail = data.feed.entry[i].media$group.media$thumbnail[0].url; 
		var description = data.feed.entry[i].media$group.media$description.$t;
		var id = data.feed.entry[i].id.$t.substring(38);
		// http://gdata.youtube.com/feeds/videos/MmPlWQo5L7c
		// example for [8]; 

		var blockletter = ((i % 2) ===1)? 'b':'a';
		output += '<div class="ui-block-' + blockletter+'">';
		output += '<h3 class="movietitle">' + title + '</h3>';
		output += '<a href="#videoplayer" data-transition="fade" onclick = "playVideo(\'' + id + '\',\'' + title + '\',\'' + escape(description) + '\')">';
		output += '<img src="' + thumbnail +'" alt="'+title+'">';
		output += '</a>';
		output += '</div>';
	}
	$('#videolist').html(output);
}

function playVideo(id, title, description) {
	// console.log(id, title, description);
	var output = '<iframe src="http://www.youtube.com/embed/' + id + '?wmode=transparent&amp;HD=0&amp;showinfo=0;controls=1&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>';
		output += '<h3>' + title + '</h3>';
		output += '<p>' + unescape(description) + '</p>';
		$('#player').html(output);
}

function jsonFlickrFeed (data){
	// console.log(data);
	var output = "";
	for (var i = 0; i < data.items.length; i++) {
		// var picture = data.items[i].media.m.substring(0,57);
		var picture = data.items[i].media.m;
		var picture = picture.substring(0, picture.length - 6); //rips off the last 6 letters
		var title = "Flickr_Photos";
		var blocktype = ((i % 4) === 0) ? 'a':
						((i % 4) === 1) ? 'b':
						((i % 4) === 2) ? 'c':
						'd';
		output += '<div class="ui-block-' + blocktype + '">';
		output += '<a href="#photo_main" data-transition="fade" onclick = "showPicture(\'' + picture + '\')">';
		output += '<img src="' + picture + '_q.jpg" alt="' + title + '">';
		output += '</a>';
		output += '</div>';

	}
	$('#photolist').html(output);
}

function showPicture(picture) {
	var title = "Flickr_Photos";
	var output = '<a href="#photos" data-transition="fade">';
		output += '<img src="' + picture +'_b.jpg" alt="' + title +'">';
		output += '</a>'; 
		$('#single_photo').html(output);
}

function listAllTweets(data) {
	// console.log(data);
	var output = '<ul data-role="listview">';
	for (i = 0; i < data.length; i++) {
		var text = data[i].text;
		var thumbnail = data[i].user.profile_image_url;
		var thumbnail = thumbnail.substring(0, thumbnail.length - 12);
		var name = data[i].user.name;
		var time = data[i].created_at;
		var day = time.split(" ")[0];
		var month = time.split(" ")[1];
		var numday = time.split(" ")[2];
		var year = time.split(" ")[5];
		// console.log(numday);
		//==============================RegExp=====================================
		 //parse URLS in twitter text
		 text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(i){

		 	var url = i.link(i); //link is a js function
		 	return url;
		 });
		  //Parse @mentions in twitter text 
		 text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(i){
		 	var item = i.replace("@",'') //replace @ with nothing
		 	var url = i.link("http://twitter.com/" + item); //link is a js function
		 	return url;
		 });
		  text = text.replace(/[#]+[A-Za-z0-9-_]+/g, function(i){
		 	var item = i.replace("#",'') //replace # with nothing
		 	var url = i.link("http://twitter.com/" + item); //link is a js function
		 	return url;
		 });
		//=-========================regexp=======================================

		output += '<li>';
		output += '<img src="' + thumbnail +'_bigger.jpeg" alt="'+ name +'" >';
		// output += '<div>' + text + '</div>';
		output += '<p>' + text + '</p>';
		output += '<p>' + numday + " " + month + " " +  year + '</p>';
		output += '</div>';
		output += '</li>';
	}
	$('#listtweets').html(output);
}

function blogger(data) {
    	// body...
        // console.log(data);
    	var output = "<form class='ui-filterable'><input id='searchposts' data-type='search'></form>";
		output += "<ul data-role='listview' data-filter='true' data-input='#searchposts'>";
		for(var i = 0; i < data.items.length; i++) {
			var title = data.items[i].title
			var excerpt = data.items[i].content.substring(0,60);
			var content = data.items[i].content;
			var blog_id = data.items[i].id;
			output += '<li>';
			// output += '<a href="#blogspot_post" onclick = "showBloggerPosts('+ blog_id +')">';

			output += '<a href="#blogspot_post" onclick = "showBloggerPosts('+ blog_id +')">';
			output += '<h3>' + title + '</h3>';
			output += '<p>' + excerpt + '<p>';
			output += '</a>';
			output += '<li>';
		}
			output += '</ul>';
			// console.log(output);
			$("#bloggerList").html(output);
    }

function showBloggerPosts(blog_id) {
	$.getJSON("https://www.googleapis.com/blogger/v3/blogs/6843001766402912247/posts/"+blog_id+"?key=AIzaSyAjLc_XcGyeFptoRyXNHlUzDGBA79B1alE", function(data) {
	 	var content = data.content;
	 	var date = data.updated; 
	 	var output = '<p>' + content + '</p>';
	 	    output += '<p>' + date + '</p>';
	 	$('#single_blogger').html(output);
	 });
	// GET https://www.googleapis.com/blogger/v3/blogs/6843001766402912247/posts/5179499414968605556?key=AIzaSyAjLc_XcGyeFptoRyXNHlUzDGBA79B1alE
}
