





city = $(".city").val();
state = $(".state").val();
propertyID = '';
listingID = '';

$('body').on('submit', '.search', function(e) {
    e.preventDefault();
    state = $(".state").val();
    city = $(".city").val();
    doTheThing();
  });

  $('body').on('click', '.button', function(e) {
    e.preventDefault();
    propertyID = e.target.getAttribute("property-id");
    listingID = e.target.getAttribute("listing-id");
    $(".slideshow-h1").empty();
    $(".slideshow-h3").empty();
    $(".uk-slideshow-items").empty();
    $(".property-details").empty();

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://realtor.p.rapidapi.com/properties/detail?listing_id=" + listingID + "&prop_status=for_safor_rent&property_id=" + propertyID,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "realtor.p.rapidapi.com",
        "x-rapidapi-key": "16ab730a53msh0550f13b995e7e9p1584a5jsn6d2b5305918d"
      }
    }
    $.ajax(settings).done(function (response) {
      console.log(response);
      $(".slideshow-h1").text(response.listing.address.line)
      $(".slideshow-h3").text(response.listing.address.city + ", " + response.listing.address.state_code);

      for (i = 0; i < response.listing.photos.length; i++){
        var slideShowLi = $("<li>");
        var slideShowImage = $("<img>");
        slideShowImage.attr("src", response.listing.photos[i].href);
        slideShowImage.attr("uk-cover", '');
        slideShowLi.append(slideShowImage);
        $(".uk-slideshow-items").append(slideShowLi);
      }

      for (i = 0; i < response.listing.features[1].text.length; i++){
        var featuresLi = $("<li>");
        featuresLi.text(response.listing.features[1].text[i]);
        $(".property-details").append(featuresLi)
      }


    });
  });

  



function doTheThing() {
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://realtor.p.rapidapi.com/properties/v2/list-for-rent?sort=relevance&city=" + city + "&state_code=" + state + "&limit=100&offset=0",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "realtor.p.rapidapi.com",
      "x-rapidapi-key": "16ab730a53msh0550f13b995e7e9p1584a5jsn6d2b5305918d"
    }
  }
  
  $.ajax(settings).done(function (response) {
    
    for (i = 0; i < response.properties.length; i++) {
        var cardDiv = $("<div>");
        var propertyImage = $("<img>");
        if (response.properties[i].photo_count != 0){
        propertyImage.attr("src", response.properties[i].photos[0].href);
        }
  
        var modalButton = $("<button>");
        modalButton.attr("type", "button");
        modalButton.addClass("button");
        modalButton.attr("listing-id", response.properties[i].listing_id);
        modalButton.attr("property-id", response.properties[i].property_id);
        modalButton.text("More Information")


        var propertyInfo = $("<ul>");
        var address = $("<li>");
        var cityState = $("<li>");
        var propertyType = $("<li>");
        var propertyURL = $("<li>");
        cardDiv.addClass("card");
        cardDiv.attr("lat", response.properties[i].address.lat);
        cardDiv.attr("lon", response.properties[i].address.lon);
        propertyImage.addClass("property-image");
        propertyImage.attr("listing-id", response.properties[i].listing_id);
        propertyImage.attr("property-id", response.properties[i].property_id);

        address.text(response.properties[i].address.line);
        cityState.text(city + ', ' + state);
        propertyType.text(response.properties[i].prop_type);
        propertyURL.html("<a href=" + response.properties[i].rdc_web_url + ">Link to Property</a>");
        propertyInfo.append(address);
        propertyInfo.append(cityState);
        propertyInfo.append(propertyType);
        propertyInfo.append(propertyURL);
        cardDiv.append(propertyInfo);
        cardDiv.append(modalButton);
        cardDiv.prepend(propertyImage);
        $(".scrolling-wrapper").append(cardDiv);
    }
  })
}