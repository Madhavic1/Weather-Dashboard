$(document).ready(function(){
   // $(".bg").css("background-image", "url('09weather_ss-slide-LLBC-jumbo.JPG')");

var APIKey = "80153e75178279ff6dfdc2b1bc72f6a2";
var city_name;
var current_date = moment(new Date());
var err = 0;
//funtion createCityNameButton() creates a button with every city name searched 
function createCityNameButton()
{
    var cityButton = $("<button>");
    cityButton.text(city_name);
    cityButton.attr("class","btn btn-light text-dark border border-success");
    $("#city-buttons").append(cityButton);

}

function showWeatherReport(event){
    event.preventDefault(); 
    city_name = $("#search-city").val().trim();
    // alert("city name "+city_name);
    createCityNameButton();
    $("#search-city").val("");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city_name+"&appid=" + APIKey;
// alert(queryURL);
    $.ajax({
        url: queryURL,
        method:"GET",
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
   
            err = xhr.status;
            //alert('Error - ' + errorMessage);
        }

    }).then(function(response){
        console.log(response);

      console.log("error status ------------ "+err);
      
       // $("#dataDiv").empty(); //empty the existing child elements
        
       var dt_field = response.dt;
       console.log("dt field "+dt_field);
       
        var cityName = response.name;
        today = moment(new Date());
        $("#city-name").text(cityName+" \("+current_date.format("MM/D/YYYY"+"\)")+" ");
        // $("#city-name").append(cloud);
        var weather_icon = $("<img>");
        var iconID = response.weather[0].icon;
        console.log("iconID "+iconID);
        var iconURL = "http://openweathermap.org/img/wn/"+iconID+"@2x.png";
        weather_icon.attr("src",iconURL)
                    .width("10%")
                    .height("10%");
         $("#city-name").append(weather_icon);
         //box-shadow: rgba(168, 228, 99, 0.3) 0 1px 2px 0,
         //rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
        $("#currentWeatherDiv").css( "border", "1px solid lightgreen" );
        var k_temp = response.main.temp; //in kelvin
        var f_temp = (k_temp - 273.15) * 1.80 + 32; //converted to Faren height
        //temperature
        $("#temperature").text("Temperature: "+Number.parseFloat(f_temp).toFixed(2));
       //humidity
       $("#humidity").text("Humidity: "+response.main.humidity);
        console.log("humidity");
        //wind speed
        console.log("wind speed");
        $("#wind-speed").text("Wind Speed: "+response.wind.speed);
        //UV Index
        
        

    });
console.log("############ "+city_name);

    show5dayForecast(city_name);
    

}

function show5dayForecast(city_name) {

    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city_name + "&appid=" + APIKey;

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
$("#search-btn").on("click",showWeatherReport);  //Event listener for search button  beside City Name input field

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
    console.log("iconID "+iconID);
    var iconURL = "http://openweathermap.org/img/wn/"+iconID+"@2x.png";
    weather_icon.attr("src",iconURL)
                .width("40%")
                .height("40%");
    
    var temperature = $("<p>");
    temperature.attr("class", "card-text");
    temperature.text("Temp: " + Number.parseFloat(day[1].main.temp).toFixed(2));
    var humidity = $("<p>");
    humidity.attr("class", "card-text");
    humidity.text("Humidity: " + day[1].main.humidity);
    cardBodyDiv.append(dateEl,weather_icon, temperature, humidity);
    cardDiv.append(cardBodyDiv);
    $("#5dayForecastDiv").append(cardDiv);
}







});