require("dotenv").config();

// Node module imports needed to run the functions
	var fs = require("fs"); //reads and writes files
	var request = require("request");
	var keys = require("./keys.js");
	var twitter = require("twitter");
	var spotify = require ("node-spotify-api");
	var liriArgument = process.argv[2];

//-------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//Commands for Liri App

function doCommand(command, arg) {
    switch(command){

	case "my-tweets":
	myTweets(arg);
	break;

	case "spotify-this-song":
	spotifyThisSong(arg);
	break;

	case "movie-this":
	movieThis(arg);
	break;

	case "do-what-it-says":
	doWhatItSays();
	break;

	default: console.log("\nType any one of these command lines after 'node liri.js': " + "\n" +
							  "1. my-tweets 'any twitter name' " + "\n" +
							  "2. spotify-this-song 'any song name' " + "\n" +
							  "3. movie-this 'any movie title' " + "\n" +
							  "4. do-what-it-says" + "\n" +
							  "Be sure to include all song names and movie titles in quotations if it is more than one word. ");
	}
}

//-----------------------------------------------------------------------------------------
//Do What It Says
function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
  if (!error) {
    var doWhatItSaysResults = data.split(",");
    console.log("Reading File..... ");
    console.log(doWhatItSaysResults);

   //command = doWhatItSaysResults[0];
   //arg = doWhatItSaysResults[1];

  	doCommand(doWhatItSaysResults[0], doWhatItSaysResults[1]);
  	///console.log(data);
  	
  } else{ 
  		console.log("An Error has Occured! " + error);
  		return;
  }
  //console.log(dataArr);

});
console.log("Do What It Says!!");
}

doCommand(process.argv[2], process.argv[3]);

//-----------------------------------------------------------------------------------------------------------------------------------
//Twitter
function myTweets(arg) {
	// Variable that holds Twitter access keys
	var client = new twitter(keys.twitter);
	//variable that holds argument
	var twitterUsername = arg;

	if(!twitterUsername){
		twitterUsername = "JescottJoey";
		console.log(twitterUsername + " has no Tweets at this time!");
	}
	//variable for holding the parameters
	var params = {screen_name: twitterUsername,
			      count: 20};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
  		console.log("Loading " + params.screen_name + "'s" + " Tweets...........");
  	for(var i = 0; i < tweets.length; i++){
  		var twitterResults = 
  		"\n@" + tweets[i].user.screen_name + "\n" +
  		"\nDate Tweeted: " + tweets[i]. created_at + "\n" +
  		"\nTweet: " + tweets[i].text + "\n" + "\n----------------------------------------------------\n"
  		
  		console.log(twitterResults);
  	}

  	} else {
  		console.log("An Error has occurred! " + error);		
  		return;
  	}  	
  });
console.log("My Tweets!!")
}

//-------------------------------------------------------------------------------------------------------------------------------
//Spotify
function spotifyThisSong(arg) {
	//variablbe that holds spotify access keys 
	var userKeys = new spotify(keys.spotify);
	//variable that holds argument
	var songName = arg;

	if(!songName){
		songName = "User should input a song!";
		console.log(songName);
	} 

	var params = songName;
userKeys.search({type: 'track', query: params}, function(error, data) { 
	//console.log(data);
  if (!error) {
    var songInfo = data.tracks.items[0];
    	//console.log(songInfo);
    		var spotifyResults = 
    		"\nUser Input: " + songName + "\n" +
    		"\nSong: " + songInfo.name + "\n" +
    		"\nArtist: " + songInfo.artists[0].name + "\n" +
    		"\nAlbum Song is from: " + songInfo.album.name + "\n" +
    		"\nPreview Url: " + songInfo.preview_url + "\n"
    		console.log(spotifyResults);
   	} else {
  		console.log("An Error has occurred: " + error);
  		return;
  }
 
});
console.log("Spotify This Song!!");
}
 

//--------------------------------------------------------------------------------------------------------------------
//Movie
function movieThis(arg) {
//variable that holds movie argument
var movieName = arg;
if(!movieName){
	movieName = "Mr. Nobody";
	console.log("Default Movie: " + movieName);
}

params = movieName
 
// We then run the request module on a URL with a JSON
request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If there were no errors and the response code was 200 (i.e. the request was successful)...
  if (!error && response.statusCode === 200) {
  	var movieObject = JSON.parse(body);
  	console.log("Loading Movie Details.......");
  	var movieResults = 
  	"\nTitle: " + movieObject.Title + "\n" +
  	"\nRelease Year: " + movieObject.Year + "\n" +
  	"\nIMDB Rating: " + movieObject.imdbRating + " out of 10" + "\n" + 
  	"\nRotten Tomatoes Rating: " + movieObject.tomatoRating + "\n" + 
  	"\nCountry Movie was produced in: " + movieObject.Country + "\n" +
  	"\nPlot: " + movieObject.Plot + "\n" +
  	"\nActors: " + movieObject.Actors + "\n"
  	console.log(movieResults);
  }
  else {
  	return console.log("Something really bad happened! " + error);
  }
});

console.log("Movie This!!");

}




