var main = document.querySelector('main');

var requestURL = "https://alyacherevko.github.io/flights.json";
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  var flightsCard = request.response;
  showFlightsCard(flightsCard);
}








