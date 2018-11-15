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





function showFlightsCard(jsonObj) {
	var flying = jsonObj["flying"];


	for (var i = 0; i < flying.length; i++) { 
		var card = document.createElement('div');
		var cardList = document.createElement('ul');

		var itemCardList = flying[i];
		
		Object.keys(itemCardList).forEach(function (key) {

			if (key === "type" || key === "delay") {
				return;
			}

  			var itemList = document.createElement('li');

  			itemList.textContent = itemCardList[key];
  			cardList.appendChild(itemList);
  			itemList.classList.add("card__content-item");
		});
		
		cardList.classList.add("card__content-list");


		card.appendChild(cardList);

		main.appendChild(card);

	}
}


