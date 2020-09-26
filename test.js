let city = $(".city").val();
let state = $(".state").val();
let bedsMin = $(".beds-min").val();
let bathsMin = $(".baths-min").val();
let priceMax = $(".price-max").val();
let limit = $(".results-limit").val();
let zip = '';
let lat = '';
let long = '';
let propertyID = '';
let listingID = '';

$('body').on('submit', '.search', function (e) {
  e.preventDefault();
  if ($(".city").val() === '') {
    errorModal();
    return false;
  }
  state = $(".state").val();
  city = $(".city").val();
  bedsMin = $(".beds-min").val();
  bathsMin = $(".baths-min").val();
  priceMax = $(".price-max").val();
  limit = $(".results-limit").val();
  doTheThing();
});

function errorModal() {
  UIkit.modal("#my-id").show();
}

$('body').on('click', '.more-info', function (e) {
  e.preventDefault();
  propertyID = e.target.getAttribute("property-id");
  listingID = e.target.getAttribute("listing-id");
  $(".slideshow-h1").empty();
  $(".slideshow-h3").empty();
  $(".uk-slideshow-items").empty();
  $(".property-details").empty();
  $(".property-desc").empty();
  $(".property-info").empty();

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://realtor.p.rapidapi.com/properties/detail?listing_id=" + listingID + "&prop_status=for_safor_rent&property_id=" + propertyID,
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "realtor.p.rapidapi.com",
      "x-rapidapi-key": "f01f3e944fmsh3ad5fc7e5b2eef4p165b37jsn480129929052"
    }
  }
  $.ajax(settings).done(function (response) {
    console.log(response)
    lat = response.listing.address.lat;
    long = response.listing.address.long;
    zip = response.listing.address.postal_code;
    $(".slideshow-h1").text(response.listing.address.line);
    $(".slideshow-h3").text(response.listing.address.city + ", " + response.listing.address.state_code);
    $(".property-desc").text(response.listing.description);


    var schoolsHeader = $("<h3>");
    schoolsHeader.text("Local Schools:")
    var schoolsUL = $("<ul>");
    schoolsUL.addClass("modal-ul");

    for (i = 0; i < response.listing.school_catchments.length; i++) {
      console.log(response.listing.school_catchments[i].name)
      var schoolNames = $("<li>");
      schoolNames.text(response.listing.school_catchments[i].name);
      schoolsUL.append(schoolNames);
    }

    var featuresHeader = $("<h3>");
    featuresHeader.text("Amenities:");
    var featuresUL = $("<ul>")
    featuresUL.addClass("modal-ul");

    for (i = 0; i < response.listing.features[1].text.length; i++) {
      var featuresLi = $("<li>");
      featuresLi.text(response.listing.features[1].text[i]);
      featuresUL.append(featuresLi);
    }

    for (i = 0; i < response.listing.photos.length; i++) {
      var slideShowLi = $("<li>");
      var slideShowImage = $("<img>");
      slideShowImage.attr("src", response.listing.photos[i].href);
      slideShowImage.attr("uk-cover", '');
      slideShowLi.append(slideShowImage);
      $(".uk-slideshow-items").append(slideShowLi);
      $(".slideshowContainer").removeClass("hide");
    }

    $(".property-info").append(featuresUL);
    $(".property-info").append(schoolsUL);
    featuresUL.prepend(featuresHeader);
    schoolsUL.prepend(schoolsHeader);
  
    // Weather
    var weatherURL = "http://api.worldweatheronline.com/premium/v1/weather.ashx?key=5be4b040100d48a7b1d235820202409&q=" + zip + "&date=2020-01-01&enddate=2020-12-31&format=json";

    $.ajax({
      url: weatherURL,
      method: "GET"
    }).then(function (weatherResponse) {
      console.log("Weather");
      console.log(weatherURL);
      console.log(weatherResponse);
      console.log("test");
      // Spring min/max temp
      console.log("Spring min/max temp");
      console.log(weatherResponse.data.ClimateAverages[0].month[3].avgMinTemp_F);
      console.log(weatherResponse.data.ClimateAverages[0].month[3].absMaxTemp_F);
      // Summer min/max temp
      console.log("Summer min/max temp");
      console.log(weatherResponse.data.ClimateAverages[0].month[5].avgMinTemp_F);
      console.log(weatherResponse.data.ClimateAverages[0].month[5].absMaxTemp_F);
      // Fall min/max temp
      console.log("Fall min/max temp");
      console.log(weatherResponse.data.ClimateAverages[0].month[8].avgMinTemp_F);
      console.log(weatherResponse.data.ClimateAverages[0].month[8].absMaxTemp_F);
      // Winter min/max temp
      console.log("December min/max temp");
      console.log(weatherResponse.data.ClimateAverages[0].month[11].avgMinTemp_F);
      console.log(weatherResponse.data.ClimateAverages[0].month[11].absMaxTemp_F);
  
    });
  
  
    // Air quality
    var airURL = "https://api.weatherbit.io/v2.0/forecast/airquality?lat=" + lat + "&lon=" + long + "&key=dfa7440a3f3e4f539ce11b040f486d22";
  
    $.ajax({
      url: airURL,
      method: "GET"
    }).then(function (airResponse) {
      console.log("Air quality");
      // console.log(airURL);
      // console.log(airResponse);
      console.log(airResponse)
      console.log(airResponse.data[0].aqi);

    });
  
  
    // Gas price
    var gasURL = "https://api.collectapi.com/gasPrice/fromCoordinates?lng=" + long + "&lat=" + lat;
  
    $.ajax({
      url: gasURL,
      method: "GET",
      headers: { "Authorization": "apikey 1eoi3HRiAnugLyw6Y99v9Y:2uljHBfqlMNhbJkWQUyDBa" }
    }).then(function (gasResponse) {
      console.log("Average gas price: $" + Math.round(gasResponse.result.gasoline * 100)/100);
    });
  });
});

function doTheThing() {

  $("#searchResults").empty();

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://realtor.p.rapidapi.com/properties/v2/list-for-rent?sort=relevance&city=" + city + "&state_code=" + state + "&beds_min=" + bedsMin + "&baths_min=" + bathsMin + "&price_max=" + priceMax + "&limit=" + limit + "&offset=0",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "realtor.p.rapidapi.com",
      "x-rapidapi-key": "f01f3e944fmsh3ad5fc7e5b2eef4p165b37jsn480129929052"
    }
  }

  $.ajax(settings).done(function (response) {
    var cardGrid = $("<div>");
    for (i = 0; i < response.properties.length; i++) {
      var cardDiv = $("<div>");
      var propertyInfo = $("<ul>");
      var innerDiv = $("<div>");
      var propertyImage = $("<img>");
      var address = $("<li>");
      var cityState = $("<li>");
      var propertyType = $("<li>");
      var propertyURL = $("<li>");
      var infoButton = $("<button>");

      if (response.properties[i].photo_count != 0) {
        propertyImage.attr("src", response.properties[i].photos[0].href);
      }

      cardGrid.addClass("uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s uk-text-center");
      cardDiv.addClass("uk-card uk-card-default uk-card-body");
      infoButton.addClass("button");
      infoButton.addClass("more-info uk-button uk-button-default uk-margin-small-right");
      propertyInfo.addClass("card-ul");
      cardDiv.addClass("card");
      propertyImage.addClass("property-image");
      innerDiv.addClass("result-card");

      cardGrid.attr("uk-grid", "");
      infoButton.attr("type", "button");
      infoButton.attr("tpye", "button");
      infoButton.attr("uk-toggle", "target: #modal-close-default");
      infoButton.attr("listing-id", response.properties[i].listing_id);
      infoButton.attr("property-id", response.properties[i].property_id);
      propertyImage.attr("listing-id", response.properties[i].listing_id);
      propertyImage.attr("property-id", response.properties[i].property_id);
      innerDiv.attr("result", i);

      address.text(response.properties[i].address.line);
      cityState.text(city + ', ' + state);
      propertyType.text(response.properties[i].prop_type);
      infoButton.text("More Info");
      propertyURL.html("<a href=" + response.properties[i].rdc_web_url + ">Link to Property</a>");
      propertyInfo.append(address);
      propertyInfo.append(cityState);
      propertyInfo.append(propertyType);
      propertyInfo.append(propertyURL);
      cardDiv.append(propertyInfo);
      cardDiv.append(infoButton);
      cardDiv.prepend(propertyImage);
      innerDiv.append(cardDiv);
      $(".uk-grid-column-small").append(innerDiv);
    }
  })
}

