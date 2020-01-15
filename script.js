var APIKey = "80153e75178279ff6dfdc2b1bc72f6a2";
var city_name;
var today;

//funtion createCityNameButton() creates a button with every city name searched 
function createCityNameButton()
{
    var cityButton = $("<button>");
    cityButton.text(city_name);
    cityButton.attr("class","btn btn-light text-dark border border-success");
    $("#city-buttons").append(cityButton);

}

function futureForecast()
{
    //step:1 - grab current date
 
 for(var i=0;i<5;i++)
 {
    var today = moment(new Date()).add(i,"days");
    console.log(today.format("MM/D/YYYY"));
    
 }
    //step2:   generate forecast for next 5 days
    // loop for 5 times. in each iteration , take 1 date , take response from weather API for that date , display and move to the next date.
}

function showWeatherReport(event){
    event.preventDefault(); 
    city_name = $("#search-city").val().trim();
    // alert("city name "+city_name);
    createCityNameButton();
 //   futureForecast();
    $("#search-city").val("");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city_name+"&appid=" + APIKey;
// alert(queryURL);
    $.ajax({
        url: queryURL,
        method:"GET"

    }).then(function(response){
        console.log(response);

      
       // $("#dataDiv").empty(); //empty the existing child elements
        
       
        var cityName = response.name;
        today = moment(new Date());
        var cloud = $("<i>");
        cloud.attr("class","fa fa-cloud");
        cloud.css({"font-size":"24px","color":"lightgray"});
        $("#city-name").text(cityName+" \("+today.format("MM/D/YYYY"+"\)")+" ");
        $("#city-name").append(cloud);
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
    // show5dayForecast();

}

function show5dayForecast(event)
{    
    event.preventDefault();
    city_name = $("#search-city").val().trim();

    
   var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city_name+"&appid=" + APIKey;

console.log("URL "+forecastURL);

    $.ajax({
        url : forecastURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        // var forecastArray = response.list;
        // console.log("array length--"+response.list.length); 
        // for(let i=0;i<+forecastArray.length;i++)
        // {
        //    // console.log(forecastArray[i]);
        // //Date
          
        //     var _date = moment(forecastArray[i].dt_txt);
        //     console.log("date "+ _date.format("L"));
            
         //   dateEl.text(_date.format("L"));
          //  $("#5dayForecastDiv").append(dateEl);

                //date
                //weather icon
                //Temp:
                //Humidity
/*** <div class="card text-white bg-primary mb-3 mr-1" style="max-width: 18rem;">
                
                <div class="card-body">
                  <h5 class="card-title">Primary card title</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
              </div> */
        }
        
        
    });
                
}
$("#search-btn").on("click",show5dayForecast);