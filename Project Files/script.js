//API Key
const apiKey = "f736e76c91a07cf9676cbaeae91b63c4";

//Search Button and Text Field
var searchButton = document.getElementById("searchButton");
var searchText = document.getElementById("searchText");

//Calculate the current date (today) and use it to find the dates 
//of the next 4 days
var dateObj = new Date();
var month = dateObj.getMonth() + 1; //Months from 1-12
var day = dateObj.getDay(); //Day of the week
var date = dateObj.getDate(); //Day of the month

//Map the month and day values to their string representation 
//by calling the dayToString() and monthToString() functions defined below
var today = dayToString(day) + " , " + monthToString(month) + " " + parseInt(date);
var date1 = dayToString(day + 1) + " , " + monthToString(month) + " " + parseInt(date + 1);
var date2 = dayToString(day + 2) + " , " + monthToString(month) + " " + parseInt(date + 2);
var date3 = dayToString(day + 3) + " , " + monthToString(month) + " " + parseInt(date + 3);
var date4 = dayToString(day + 4) + " , " + monthToString(month) + " " + parseInt(date + 4);

//Add event listeners
searchButton.addEventListener("click", searchWeatherInfo);
searchButton.addEventListener("click", getForecast);
searchText.addEventListener("keyup", enterPressed);

$(".todaysInfo").hide(); //Hide the white background for today's weather

//Alternative way to enter the info in the search field is to hit the 'enter' key
function enterPressed(event) {
  if (event.key === "Enter") {
    searchWeatherInfo();
	getForecast();
  }
}

function searchWeatherInfo() {
	//If the value in the search field is null, do nothing
	//Else if it contains numbers, search today's weather by zip code
	//Else search today's weather by city name
	if (searchText.value === "") {
	
	}else if(searchText.value.match(/^\d+$/g)) {
		$(".todaysInfo").show(); //show the white background for today's weather
		var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + searchText.value + ",us&units=imperial&&appid=" + apiKey;
		generateHTTPRequest(url, parseWeatherResponse);
	}
	
	else {
		$(".todaysInfo").show(); //show the white background for today's weather
		var url = "http://api.openweathermap.org/data/2.5/weather?q=" + searchText.value + "&units=imperial&&appid=" + apiKey;
		generateHTTPRequest(url, parseWeatherResponse);
	}
}

function getForecast() {
	console.log("searching Forecast");
	//If the value in the search field is null, do nothing
	//Else if it contains numbers, search the forecast by zip code
	//Else search forecast by city name
	if (searchText.value === "") {
	
	}else if(searchText.value.match(/^\d+$/g)) {
		var url = "http://api.openweathermap.org/data/2.5/forecast?zip=" + searchText.value + ",us&units=imperial&&appid=" + apiKey;
		generateHTTPRequest(url, parseForecastResponse);
	
	}else {
		var url = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchText.value + "&units=imperial&&appid=" + apiKey;
		generateHTTPRequest(url, parseForecastResponse);
	}
}

//AJAX 
function generateHTTPRequest(url, callback) {
	console.log("hi");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() { 
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			callback(xhttp.responseText);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

//Parses forecast response
function parseForecastResponse(response) {
	var jsonObj = JSON.parse(response);
	
	//Position of weather info for each day at 12 PM in JSON response 
	var arrayPos = [10, 18, 26, 34];
	
	var iconNames = new Array;
	
	//The following code replaces OpenWeatherAPI icons with
	//icons created by Erik Flowers: https://erikflowers.github.io/weather-icons/
	var prefix = 'wi wi-';
	var openWeatherID; //Weather Id
	for(var i = 0; i < 4; i++) {
		
		//weatherIcons is a JSON object declared at the very bottom of this file 
		//mapping each openWeatherID to an icon class name linked in the weather-icons.css file 
		//Reference: https://gist.github.com/tbranyen/62d974681dea8ee0caa1#file-icons-json
		
		//Get the ID for each day 
		openWeatherID = jsonObj.list[arrayPos[i]].weather[0].id;
		
		//Map the ID to a class name and push the icon class name into the iconNames array
		iconNames.push(weatherIcons[openWeatherID].icon);
		
		//If the icon mappings do not exist for a particular id, add the 'day-' prefix.
		if (!( openWeatherID > 699 && openWeatherID < 800) && !(openWeatherID > 899 && openWeatherID < 1000)) {
			iconNames[i] = 'day-' + iconNames[i];
		}
		
		//Add the prefix 'wi wi-' to each icon class name 
		iconNames[i] = prefix + iconNames[i];
	}
	
	//Store the icon names for each day in the respective variables
	prettyIcon1 = iconNames[0];
	prettyIcon2 = iconNames[1];
	prettyIcon3 = iconNames[2];
	prettyIcon4 = iconNames[3];
	prettyIcon5 = iconNames[4];
	
	//Retrieve weather info from JSON response for each day at 12 PM
	$("#date1").text("" + date1);
	$("#description1").text("" + jsonObj.list[10].weather[0].description);
	$("#temp1").text("" + jsonObj.list[10].main.temp_max + " °F");
	$("#icon1").html("<i class = '" + prettyIcon1 + "'></i>");
	
	$("#date2").text("" + date2);
	$("#description2").text("" + jsonObj.list[18].weather[0].description);
	$("#temp2").text("" + jsonObj.list[18].main.temp_max + " °F");
	$("#icon2").html("<i class = '" + prettyIcon2 + "'></i>");
	
	$("#date3").text("" + date3);
	$("#description3").text("" + jsonObj.list[26].weather[0].description);
	$("#temp3").text("" + jsonObj.list[26].main.temp_max + " °F");
	$("#icon3").html("<i class = '" + prettyIcon3 + "'></i>");
	
	$("#date4").text("" + date4);
	$("#description4").text("" + jsonObj.list[34].weather[0].description);
	$("#temp4").text("" + jsonObj.list[34].main.temp_max + " °F");
	$("#icon4").html("<i class = '" + prettyIcon4 + "'></i>");
	
}

//Parses current weather response 
function parseWeatherResponse(response) {
	var jsonObj = JSON.parse(response);
	$("#todayDate").text("" + today);
	$("#cityName").text("" + jsonObj.name);
	$("#description").text("" + jsonObj.weather[0].description);
	$("#temperature").text("" + jsonObj.main.temp + " °F");
	if(parseInt(jsonObj.main.temp) > 60) {
		$("body").addClass("warmbg");
	}else {
		document.getElementsByTagName("body")[0].setAttribute("class", "coolbg");
	}
	
	
	//The following code replaces OpenWeatherAPI icons with
	//icons created by Erik Flowers: https://erikflowers.github.io/weather-icons/
	var openWeatherID = jsonObj.weather[0].id;
	var prefix = 'wi wi-';
	var prettyIcon = weatherIcons[openWeatherID].icon;
	
	//weatherIcons is a JSON object declared at the very bottom of this file 
	//mapping each openWeatherID to an icon class name. 
	//Reference: https://gist.github.com/tbranyen/62d974681dea8ee0caa1#file-icons-json
	
	if (!( openWeatherID > 699 && openWeatherID < 800) && !(openWeatherID > 899 && openWeatherID < 1000)) {
		prettyIcon = 'day-' + prettyIcon;
	}
	
	prettyIcon = prefix + prettyIcon;

	$("#icon").html("<i class = '" + prettyIcon + "'></i>"); //Set the icon for today's weather
}

function monthToString(monthNum) {
	switch(monthNum) {
		case 1: 
			return "January";
			break;
		case 2: 
			return "February";
			break;
		case 3: 
			return "March";
			break;
		case 4: 
			return "April";
			break;	
		case 5: 
			return "May";
			break;	
		case 6: 
			return "June";
			break;	
		case 7: 
			return "July";
			break;	
		case 8: 
			return "August";
			break;	
		case 9: 
			return "September";
			break;	
		case 10: 
			return "October";
			break;	
		case 11: 
			return "November";
			break;	
		case 12: 
			return "December";
			break;	
	}
}

function dayToString(dayNum) {
	
	if (dayNum >= 8) {
		dayNum = dayNum - 7;
	} 
	
	switch(dayNum) {
		case 1: 
			return "Monday";
			break;
		case 2: 
			return "Tuesday";
			break;
		case 3: 
			return "Wednesday";
			break;
		case 4: 
			return "Thursday";
			break;	
		case 5: 
			return "Friday";
			break;	
		case 6: 
			return "Saturday";
			break;	
		case 7: 
			return "Sunday";
			break;	
		default: 
			return "Monday";
			
	}
}

//Maps each openWeatherID to an icon class name in the weather-icons.css file
var weatherIcons = {
  "200": {
    "label": "thunderstorm with light rain",
    "icon": "storm-showers"
  },

  "201": {
    "label": "thunderstorm with rain",
    "icon": "storm-showers"
  },

  "202": {
    "label": "thunderstorm with heavy rain",
    "icon": "storm-showers"
  },

  "210": {
    "label": "light thunderstorm",
    "icon": "storm-showers"
  },

  "211": {
    "label": "thunderstorm",
    "icon": "thunderstorm"
  },

  "212": {
    "label": "heavy thunderstorm",
    "icon": "thunderstorm"
  },

  "221": {
    "label": "ragged thunderstorm",
    "icon": "thunderstorm"
  },

  "230": {
    "label": "thunderstorm with light drizzle",
    "icon": "storm-showers"
  },

  "231": {
    "label": "thunderstorm with drizzle",
    "icon": "storm-showers"
  },

  "232": {
    "label": "thunderstorm with heavy drizzle",
    "icon": "storm-showers"
  },

  "300": {
    "label": "light intensity drizzle",
    "icon": "sprinkle"
  },

  "301": {
    "label": "drizzle",
    "icon": "sprinkle"
  },

  "302": {
    "label": "heavy intensity drizzle",
    "icon": "sprinkle"
  },

  "310": {
    "label": "light intensity drizzle rain",
    "icon": "sprinkle"
  },

  "311": {
    "label": "drizzle rain",
    "icon": "sprinkle"
  },

  "312": {
    "label": "heavy intensity drizzle rain",
    "icon": "sprinkle"
  },

  "313": {
    "label": "shower rain and drizzle",
    "icon": "sprinkle"
  },

  "314": {
    "label": "heavy shower rain and drizzle",
    "icon": "sprinkle"
  },

  "321": {
    "label": "shower drizzle",
    "icon": "sprinkle"
  },

  "500": {
    "label": "light rain",
    "icon": "rain"
  },

  "501": {
    "label": "moderate rain",
    "icon": "rain"
  },

  "502": {
    "label": "heavy intensity rain",
    "icon": "rain"
  },

  "503": {
    "label": "very heavy rain",
    "icon": "rain"
  },

  "504": {
    "label": "extreme rain",
    "icon": "rain"
  },

  "511": {
    "label": "freezing rain",
    "icon": "rain-mix"
  },

  "520": {
    "label": "light intensity shower rain",
    "icon": "showers"
  },

  "521": {
    "label": "shower rain",
    "icon": "showers"
  },

  "522": {
    "label": "heavy intensity shower rain",
    "icon": "showers"
  },

  "531": {
    "label": "ragged shower rain",
    "icon": "showers"
  },

  "600": {
    "label": "light snow",
    "icon": "snow"
  },

  "601": {
    "label": "snow",
    "icon": "snow"
  },

  "602": {
    "label": "heavy snow",
    "icon": "snow"
  },

  "611": {
    "label": "sleet",
    "icon": "sleet"
  },

  "612": {
    "label": "shower sleet",
    "icon": "sleet"
  },

  "615": {
    "label": "light rain and snow",
    "icon": "rain-mix"
  },

  "616": {
    "label": "rain and snow",
    "icon": "rain-mix"
  },

  "620": {
    "label": "light shower snow",
    "icon": "rain-mix"
  },

  "621": {
    "label": "shower snow",
    "icon": "rain-mix"
  },

  "622": {
    "label": "heavy shower snow",
    "icon": "rain-mix"
  },

  "701": {
    "label": "mist",
    "icon": "sprinkle"
  },

  "711": {
    "label": "smoke",
    "icon": "smoke"
  },

  "721": {
    "label": "haze",
    "icon": "day-haze"
  },

  "731": {
    "label": "sand, dust whirls",
    "icon": "cloudy-gusts"
  },

  "741": {
    "label": "fog",
    "icon": "fog"
  },

  "751": {
    "label": "sand",
    "icon": "cloudy-gusts"
  },

  "761": {
    "label": "dust",
    "icon": "dust"
  },

  "762": {
    "label": "volcanic ash",
    "icon": "smog"
  },

  "771": {
    "label": "squalls",
    "icon": "day-windy"
  },

  "781": {
    "label": "tornado",
    "icon": "tornado"
  },

  "800": {
    "label": "clear sky",
    "icon": "sunny"
  },

  "801": {
    "label": "few clouds",
    "icon": "cloudy"
  },

  "802": {
    "label": "scattered clouds",
    "icon": "cloudy"
  },

  "803": {
    "label": "broken clouds",
    "icon": "cloudy"
  },

  "804": {
    "label": "overcast clouds",
    "icon": "cloudy"
  },


  "900": {
    "label": "tornado",
    "icon": "tornado"
  },

  "901": {
    "label": "tropical storm",
    "icon": "hurricane"
  },

  "902": {
    "label": "hurricane",
    "icon": "hurricane"
  },

  "903": {
    "label": "cold",
    "icon": "snowflake-cold"
  },

  "904": {
    "label": "hot",
    "icon": "hot"
  },

  "905": {
    "label": "windy",
    "icon": "windy"
  },

  "906": {
    "label": "hail",
    "icon": "hail"
  },

  "951": {
    "label": "calm",
    "icon": "sunny"
  },

  "952": {
    "label": "light breeze",
    "icon": "cloudy-gusts"
  },

  "953": {
    "label": "gentle breeze",
    "icon": "cloudy-gusts"
  },

  "954": {
    "label": "moderate breeze",
    "icon": "cloudy-gusts"
  },

  "955": {
    "label": "fresh breeze",
    "icon": "cloudy-gusts"
  },

  "956": {
    "label": "strong breeze",
    "icon": "cloudy-gusts"
  },

  "957": {
    "label": "high wind, near gale",
    "icon": "cloudy-gusts"
  },

  "958": {
    "label": "gale",
    "icon": "cloudy-gusts"
  },

  "959": {
    "label": "severe gale",
    "icon": "cloudy-gusts"
  },

  "960": {
    "label": "storm",
    "icon": "thunderstorm"
  },

  "961": {
    "label": "violent storm",
    "icon": "thunderstorm"
  },

  "962": {
    "label": "hurricane",
    "icon": "cloudy-gusts"
  }
}