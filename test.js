city = $(".city").val();
state = $(".state").val();
bedsMin = $(".beds-min").val();
bathsMin = $(".baths-min").val();
priceMax = $(".price-max").val();
propertyID = '';
listingID = '';

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
    console.log(bedsMin);
    console.log(bathsMin);
    console.log(priceMax);
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
        "x-rapidapi-key": "16ab730a53msh0550f13b995e7e9p1584a5jsn6d2b5305918d"
      }
    }
    $.ajax(settings).done(function (response) {
      console.log(response);
      
      


      $(".slideshow-h1").text(response.listing.address.line);
      $(".slideshow-h3").text(response.listing.address.city + ", " + response.listing.address.state_code);
      $(".property-desc").text(response.listing.description);

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
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://realtor.p.rapidapi.com/properties/v2/list-for-rent?sort=relevance&city=" + city + "&state_code=" + state + "&beds_min=" + bedsMin + "&baths_min=" + bathsMin + "&price_max=" + priceMax + "&limit=100&offset=0",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "realtor.p.rapidapi.com",
      "x-rapidapi-key": "16ab730a53msh0550f13b995e7e9p1584a5jsn6d2b5305918d"
    }
  }
  
  $.ajax(settings).done(function (response) {
    var cardGrid = $("<div>");
    for (i = 0; i < response.properties.length; i++) {
        var cardDiv = $("<div>");
        
        var innerDiv = $("<div>");
        var propertyImage = $("<img>");
        if (response.properties[i].photo_count != 0){
        propertyImage.attr("src", response.properties[i].photos[0].href);
        }

        cardGrid.addClass("uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s uk-text-center");
        cardGrid.attr("uk-grid", "")
        cardDiv.addClass("uk-card uk-card-default uk-card-body");
  
        var infoButton = $("<button>");
        infoButton.attr("type", "button");
        infoButton.addClass("button");
        infoButton.addClass("more-info uk-button uk-button-default uk-margin-small-right");
        infoButton.attr("tpye", "button");
        infoButton.attr("uk-toggle", "target: #modal-close-default");
        infoButton.attr("listing-id", response.properties[i].listing_id);
        infoButton.attr("property-id", response.properties[i].property_id);
        infoButton.text("More Info")


        var propertyInfo = $("<ul>");
        propertyInfo.addClass("card-ul");
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
        cardDiv.append(infoButton);
        cardDiv.prepend(propertyImage);

        innerDiv.append(cardDiv);
        $(".uk-grid-column-small").append(innerDiv);
    }
    
  })
}