//my cur IP 27.34.104.43

var getPositionPromise = new Promise(function(resolve, reject){
	//getting position values
	navigator.geolocation.getCurrentPosition(setPosition,errPostion);
	function setPosition(pos){
		resolve(pos.coords)
		//console.log(pos.coords);
	}
	function errPostion(err){
		reject(err.message);
		console.warn("ERROR " + err.code + " : " + err.message);
	}
});

getPositionPromise.then(function(position){
	//getting City Key from latitude, longitude value
	//console.log(position.latitude,position.longitude);
	var getCityDetailsPromise = new Promise(function(resolve, reject){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				var cityDetailsJSON = this.responseText;
				var cityDetails = JSON.parse(cityDetailsJSON);
				resolve(cityDetails);
				//console.log(cityDetails.Key);
			}
		}
		xhttp.open("GET","http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=U6eR9gQ2jvPvedqMX0BHzCj2zl0iP0Y1&q=" + position.latitude + "," + position.longitude);
		xhttp.send();
	});
	getCityDetailsPromise.then(function(cityDetails){
		//getting Weather info from City Key
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var currentWeatherJSON = this.responseText;
				var currentWeather = JSON.parse(currentWeatherJSON);
				//console.log(currentWeather[0]);
				document.getElementById("weatherinfo").innerHTML = "<img src='https://www.accuweather.com/images/weathericons/" + currentWeather[0].WeatherIcon + ".svg' alt='" + currentWeather[0].WeatherText + "'>";
				var weatherNode = document.createElement("P");
				weatherNode.id = "weather";
				document.getElementById("weatherinfo").appendChild(weatherNode);
				weatherNode.innerHTML = "<span id='temp'>" + Math.round(currentWeather[0].Temperature.Metric.Value) + "</span> " + " &deg;" + currentWeather[0].Temperature.Metric.Unit + " &nbsp;&nbsp;" + currentWeather[0].WeatherText + " " + cityDetails.EnglishName + " " + cityDetails.Country.EnglishName;
    		}
  		};
  		//search city details
  		//xhttp.open("GET", "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=U6eR9gQ2jvPvedqMX0BHzCj2zl0iP0Y1&q=kathmandu", true);
  		xhttp.open("GET", "http://dataservice.accuweather.com/currentconditions/v1/" + cityDetails.Key + "?apikey=U6eR9gQ2jvPvedqMX0BHzCj2zl0iP0Y1", true);
  		xhttp.send();
		//console.log("this is working");
	});
});

