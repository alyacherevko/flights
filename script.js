var type = "departure";

function changeType(newType) {
	type = newType;
	var active = document.getElementsByClassName("header__button--active");
	console.log(active);
	while(active && active.length > 0) {
		active[0].classList.remove('header__button--active');
	}
	document.querySelector("#" + newType).classList.add("header__button--active")
}

var timetable = document.querySelector('#timetable');

var requestURL = "https://alyacherevko.github.io/flights.json";
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  var flightsCard = request.response;
  showFlightsCard(flightsCard);

  document.querySelector('#departure').onclick = function () {
  	changeType("departure");
  	showFlightsCard(flightsCard);
  	return false;
  }

  document.querySelector('#arrival').onclick = function () {
  	changeType("arrival");
  	showFlightsCard(flightsCard);
  	return false;
  }

}


function showFlightsCard(jsonObj, searchFn=function (_) {return true;}) {
	var flying = jsonObj["flying"].filter(function (item) {return item["type"] === type}).filter(searchFn);

	if (timetable) {
		timetable.innerHTML = '';
	}

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

		timetable.appendChild(card);

	}
}



