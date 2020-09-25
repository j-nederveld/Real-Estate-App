city = $(".city").val();
state = $(".state").val();
bedsMin = $(".beds-min").val();
bathsMin = $(".baths-min").val();
priceMax = $(".price-max").val();
limit = $(".results-limit").val();
propertyID = '';
listingID = '';
var schools = $("<h3>");
var details = $("<h3>");
details.addClass("details-h3");
details.text("Amenities:")

schools.addClass("schools-h3")
schools.text("Local Schools:")
var schoolsList = $("<ul>");
var propertyDetails = $("<ul>");
propertyDetails.addClass("property-details");



$('body').on('submit', '.search', function(e) {
    e.preventDefault();
    if ($(".city").val() === ''){
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

  function errorModal(){
    UIkit.modal("#my-id").show();
  }

  $('body').on('click', '.more-info', function(e) {
    e.preventDefault();
    propertyID = e.target.getAttribute("property-id");
    listingID = e.target.getAttribute("listing-id");
    $(".slideshow-h1").empty();
    $(".slideshow-h3").empty();
    $(".uk-slideshow-items").empty();
    $(".property-details").empty();
    $(".property-desc").empty();

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

      $(".slideshow-h1").text(response.listing.address.line);
      $(".slideshow-h3").text(response.listing.address.city + ", " + response.listing.address.state_code);
      $(".property-desc").text(response.listing.description);

      $(".property-desc").append(schools)
      for (i = 0; i < response.listing.school_catchments.length; i++){
        console.log(response.listing.school_catchments[i].name)
        var schoolNames = $("<li>");
        schoolNames.text(response.listing.school_catchments[i].name);
        schoolsList.append(schoolNames);
        $(".schools-h3").append(schoolsList);
        $(".schools-h3").append(details);
        details.append(propertyDetails)

      }

      for (i = 0; i < response.listing.photos.length; i++){
        var slideShowLi = $("<li>");
        var slideShowImage = $("<img>");
        slideShowImage.attr("src", response.listing.photos[i].href);
        slideShowImage.attr("uk-cover", '');
        slideShowLi.append(slideShowImage);
        $(".uk-slideshow-items").append(slideShowLi);
        $(".slideshowContainer").removeClass("hide");
      }

      for (i = 0; i < response.listing.features[1].text.length; i++){
        var featuresLi = $("<li>");
        featuresLi.text(response.listing.features[1].text[i]);
        $(".property-details").append(featuresLi)
      }
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

        if (response.properties[i].photo_count != 0){
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

