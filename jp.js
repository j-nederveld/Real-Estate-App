city = $(".city").val();
state = $(".state").val();

$('body').on('submit', '.search', function(e) {
    e.preventDefault();
    state = $(".state").val();
    city = $(".city").val();
    doTheThing();
    console.log(city);
    console.log(state);
  });



function doTheThing() {
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://realtor.p.rapidapi.com/properties/v2/list-for-rent?sort=relevance&city=" + city + "&state_code=" + state + "&limit=200&offset=0",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "realtor.p.rapidapi.com",
      "x-rapidapi-key": "16ab730a53msh0550f13b995e7e9p1584a5jsn6d2b5305918d"
    }
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response)
    for (i = 0; i < response.properties.length; i++) {
        var cardDiv = $("<div>");
        var propertyImage = $("<img>");
        if (response.properties[i].photo_count != 0){
        propertyImage.attr("src", response.properties[i].photos[0].href);
        }
        var propertyInfo = $("<ul>");
        var address = $("<li>");
        var cityState = $("<li>");
        var propertyType = $("<li>");
        var propertyURL = $("<li>");
        cardDiv.addClass("card");
        propertyImage.addClass("property-image");
        address.text(response.properties[i].address.line);
        cityState.text(city + ', ' + state);
        propertyType.text(response.properties[i].prop_type);
        propertyURL.html("<a href=" + response.properties[i].rdc_web_url + ">Link to Property</a>");
        propertyInfo.append(address);
        propertyInfo.append(cityState);
        propertyInfo.append(propertyType);
        propertyInfo.append(propertyURL);
        cardDiv.append(propertyInfo);
        cardDiv.prepend(propertyImage);
        $(".scrolling-wrapper").append(cardDiv);
    }
  })
}