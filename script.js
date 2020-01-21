$(document).ready(function () {
    $(".bg").css({ "background-image": "url('clearcloudysky.png')" });
    var APIKey = "80153e75178279ff6dfdc2b1bc72f6a2";
    var city_name;
    var current_date = moment(new Date());

    //funtion createCityNameButton() creates a button with every city name searched 
    function createCityNameButton(city_name) {

        var savedCityNames = localStorage.getItem("cityNames");
        if (savedCityNames !== null) {
           
            //grab the local storage items into an array and check the city_name entered is present.
            // if its already there , dont add the city name into the button's div, to avoid repetition.
            var cities_array = savedCityNames.split(",");
            if (cities_array.indexOf(city_name) === -1) {
                //meaning the city name is not there in the array. so store the city name to the local storage.
               // saveTheCityNametoLocalStorage(cityName);
               localStorage.setItem("cityNames", (savedCityNames + "," + city_name));
                city_name = createACityNameButton(city_name);

            }
        }
        else{

            //means , there are not saved city name in local storage . 

            //store the cityname directly into the localStorage 
            localStorage.setItem("cityNames",city_name);
        }
       





    }

    //this function stores the searched city names to Local storage
    function saveTheCityNametoLocalStorage(cityName) {

        var cityNames_array = [];

        var saved = localStorage.getItem("cityNames");

        console.log("saved -- " + typeof saved);

        if (saved === null) {
            localStorage.setItem("cityNames", cityName);
        }
        else {
            localStorage.setItem("cityNames", (saved + "," + cityName));
        }

    }

    function showWeatherReport(event) {
        event.preventDefault();
        city_name = $("#search-city").val().trim();
        var isItAsavedButton = false;
        getWeatherDataFromAPI(city_name, isItAsavedButton);


    }

    function getWeatherDataFromAPI(city_name, isButton) {
        console.log("city name in new function " + city_name + " and is button ?" + isButton);

        $("#search-city").val("");
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city_name + "&units=imperial&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET",
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText;
                err = xhr.status;
                alert('Enter valid City Name');
            },
            success: function (response) {
                console.log(response);
                console.log(response);
                if (!isButton) {

                    createCityNameButton(city_name);
                }

                
                today = moment(new Date());
                //getting city name from response 
                var cityName = response.name;
                $("#city-name").text(cityName + " \(" + current_date.format("MM/D/YYYY" + "\)") + " ");

                //getting weather icon
                var weather_icon = $("<img>");
                var iconID = response.weather[0].icon;
                var iconURL = "https://openweathermap.org/img/wn/" + iconID + "@2x.png";
                weather_icon.attr("src", iconURL)
                    .width("10%")
                    .height("10%");
                $("#city-name").append(weather_icon);

                //setting border for weather div
                $("#currentWeatherDiv").css("border", "1px solid lightgreen");

                //getting coordinates from response from API
                var latitude = response.coord.lat;
                var longitude = response.coord.lon;
                /*********getting UV Index ************************* */
                var uvindexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
                var type = "current";
                getUVindex(uvindexURL, type);

                //temperature
                var k_temp = response.main.temp; //in kelvin
                $("#temperature").text("Temperature: " + Number.parseFloat(k_temp).toFixed(2) + "°F");

                //humidity
                $("#humidity").text("Humidity: " + response.main.humidity + "\%");
                
                //wind speed
                $("#wind-speed").text("Wind Speed: " + response.wind.speed + "MPH");
                
            }
        });

        show5dayForecast(city_name);
    }

    //getUVindex() gets the UV index from the openWeather API call.
    function getUVindex(queryURL, typeOfReport) {
        var uvIndex = 0;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);
            uvIndex = response.value;
            $("#uv-index").html("UV Index: <div class='rectangle p-2'>" + uvIndex + "</div>");

        });

    }


    function show5dayForecast(city_name) {

        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city_name + "&units=imperial&appid=" + APIKey;

        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);
            var forecastArray = response.list;

            var today = moment(new Date());
            var day1 = [];
            var day2 = [];
            var day3 = [];
            var day4 = [];
            var day5 = [];

            var d1 = today.add(1, 'days').format("L");
            var d2 = today.add(1, 'days').format("L");
            var d3 = today.add(1, 'days').format("L");
            var d4 = today.add(1, 'days').format("L");
            var d5 = today.add(1, 'days').format("L");

            for (elem in forecastArray) {

                var date1 = moment(forecastArray[elem].dt_txt).format("L");

                switch (date1) {
                    case today.format("L"):
                        break;
                    case d1:
                        day1.push(forecastArray[elem]);
                        break;
                    case d2:
                        day2.push(forecastArray[elem]);
                        break;
                    case d3:
                        day3.push(forecastArray[elem]);
                        break;
                    case d4:
                        day4.push(forecastArray[elem]);
                        break;
                    case d5:
                        day5.push(forecastArray[elem]);
                        break;
                    default:
                        break;
                }
                today = current_date; // resets the date value after all additions of days to form d1 to d5 variable values
            }


            // below block of code removes the existing nodes of parent div and 
            //then creates a forecast widget for exch day by taking each day array as a parameter

            $("#5dayForecastDiv").empty();
            //var averages_day1 = calculateAverageValues(day1);
            createForecastWidget(day1);
            //var averages_day2 = calculateAverageValues(day2);
            createForecastWidget(day2);
            // var averages_day3 = calculateAverageValues(day3);
            createForecastWidget(day3);
            // var averages_day4 = calculateAverageValues(day4);
            createForecastWidget(day4);
            // var averages_day5 = calculateAverageValues(day5);
            createForecastWidget(day5);


        });

    }


    function createForecastWidget(day) {

        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        console.log(day);

        var cardDiv = $("<div>");
        cardDiv.attr("class", "card text-white bg-primary mb-3 mr-1 border-warning border-left-0 border-bottom-0");
        var cardBodyDiv = $("<div>");
        cardBodyDiv.attr("class", "card-body p-0");
        var dateEl = $("<h5>");
        dateEl.attr("class", "card-title");
        dateEl.text(moment(day[1].dt_txt).format("L"));
        var weather_icon = $("<img>");
        var iconID = day[1].weather[0].icon;
        console.log("iconID " + iconID);
        var iconURL = "https://openweathermap.org/img/wn/" + iconID + "@2x.png";
        weather_icon.attr("src", iconURL)
            .width("40%")
            .height("40%");

        var temperature = $("<p>");
        temperature.attr("class", "card-text");
        temperature.text("Temp: " + Number.parseFloat(day[1].main.temp).toFixed(2) + "°F");
        var humidity = $("<p>");
        humidity.attr("class", "card-text");
        humidity.text("Humidity: " + day[1].main.humidity + "\%");
        cardBodyDiv.append(dateEl, weather_icon, temperature, humidity);
        cardDiv.append(cardBodyDiv);
        $("#5dayForecastDiv").append(cardDiv);
    }


    function getWeatherData_on_buttonClick(event) {
        event.preventDefault();

        if (event.target.matches("button")) {
            btn_name = event.target.textContent;
            var isButtonFlag = true;
            getWeatherDataFromAPI(btn_name, isButtonFlag);
            // showWeatherReport(event);
        }


    }

    //finds the location details of a user

    function findMyCityCoordinates() {
        var user_city;
        //check if the geolocation is enabled or not 
        if (navigator.geolocation) {
            //get the current geographical position of the user , from which we can find coordintes
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }

    //gives the cordinates of the position passed .
    function showPosition(position)
    {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        $("#latitude").text(lat);
        $("#longitude").text(long);
        findMyCity(lat,long);
    }

    //findMyCity function finds the city name from OpenWeathermap API by passing latitude and longitude as arguments.
    function findMyCity(lat, long) {
        var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIKey}&units=imperial`;
        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.name);
            getWeatherDataFromAPI(response.name, false);
            $("#city").text("City: " + response.name);
        });
    }


    function createOnloadCityNameButtons(){
        //grab the localStorage value for key="cityNames"

        var cityNames_saved = localStorage.getItem("cityNames");

        if(cityNames_saved !== null)
        {
            var citynames_array = cityNames_saved.split(',');

            for(let i=0;i<citynames_array.length;i++)
            {
                createACityNameButton(citynames_array[i]);
            }
        }

        //split the string with ',' as delimiter and extract the values into an array using String split().

        //loop the array of citynames and create button for each name in the buttons-div
    }



    findMyCityCoordinates();
    createOnloadCityNameButtons();
    $("#search-btn").on("click", showWeatherReport);  //Event listener for search button  beside City Name input field
    $("#city-buttons").on("click", getWeatherData_on_buttonClick);


});

function createACityNameButton(city_name) {
    var cityButton = $("<button>");
    var lower = city_name;
    city_name = lower.charAt(0).toUpperCase() + lower.substring(1); //makes the first character as a Uppercase letter
    cityButton.text(city_name);
    cityButton.attr("class", "saved-button btn btn-light text-dark border border-success");
    $("#city-buttons").append(cityButton);
    return city_name;
}
