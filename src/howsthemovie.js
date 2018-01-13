document.getElementById("Search").addEventListener("submit", function(){
	var search_text = document.getElementsByName("query")[0].value;
	var loadingDiv = document.getElementsByClassName("loading")[0];

	document.getElementById("loading-text").innerHTML= 'Looking for: <strong>'+ search_text +'<strong>';
	document.getElementById("loader_img").src = "../res/Loader1.gif";
	loadingDiv.style.display = 'block';

	var request = new XMLHttpRequest();
	request.open('GET', `http://127.0.0.1:5000/howsthemovie/getmoviedetails?movie_name=${search_text}`);
	request.onreadystatechange = function(){
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			generateMovieDetailsCard(JSON.parse(request.responseText));
		}else if (request.status === 500){
			document.getElementById("loading-text").innerHTML= "oh Snap! Something's wrong";
			document.getElementById("loader_img").src = "../res/straight-face.png";
		}
	}
    request.send();	
});

function generateMovieDetailsCard(movie_details){
	if (movie_details.movie_year != null) {
		document.getElementsByClassName("movie-title")[0].innerHTML = movie_details.movie_name +' ('+movie_details.movie_year+')';
	}else{
		document.getElementsByClassName("movie-title")[0].innerHTML = movie_details.movie_name;
	}
	var creditDetailItems= document.getElementsByClassName("credit-detail");

	if(movie_details.movie_directors){
		creditDetailItems[0].innerHTML = movie_details.movie_directors;
	}else{
		document.getElementById("director").style.display= 'none';
	}
	creditDetailItems[1].innerHTML = [].concat(movie_details.movie_actors).join(', ');

	var movieDetailContents= document.getElementsByClassName("movie-detail-content");
	movieDetailContents[0].innerHTML = movie_details.movie_rating + " / "+ movie_details.best_rating;
	movieDetailContents[1].innerHTML = movie_details.movie_rating_count;

	document.getElementById("movie_poster").getElementsByTagName("img")[0].src = movie_details.movie_poster_link;
	document.getElementById("positive-reviews").innerText = "Analysing..";
	document.getElementById("negative-reviews").innerText = "Analysing..";

	var loadingDiv = document.getElementsByClassName("loading")[0];
	var resultDiv = document.getElementsByClassName("result")[0];
	loadingDiv.style.display= 'none';
	resultDiv.style.display = 'block';

	var sentiment_request = new XMLHttpRequest();
	sentiment_request.open('GET', `http://127.0.0.1:5000/howsthemovie/gettwittersentiments?hashtag=${movie_details.movie_name}`);
	sentiment_request.onreadystatechange = function(){
		if(sentiment_request.readyState === XMLHttpRequest.DONE && sentiment_request.status === 200) {
			var sentiments = JSON.parse(sentiment_request.responseText);
			document.getElementById("positive-reviews").innerText = Math.round(sentiments.positive_reviews*100)/100 + ' %';
			document.getElementById("negative-reviews").innerText = Math.round(sentiments.negative_reviews*100)/100 + ' %';
		}
	};
	sentiment_request.send();

}