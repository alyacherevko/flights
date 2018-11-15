var type = "departure";
var searchTerm = null;
var onlyDelay = false;

function changeType(newType, flightsCard) {
	type = newType;
	var active = document.getElementsByClassName("header__button--active");
	while(active && active.length > 0) {
		active[0].classList.remove('header__button--active');
	}
	document.querySelector("#" + newType).classList.add("header__button--active");
	showFlightsCard(flightsCard);
	return false;
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
  	return changeType("departure", flightsCard);
  }

  document.querySelector('#arrival').onclick = function () {
  	return changeType("arrival", flightsCard);
  }

  document.querySelector("#search").addEventListener('input', function (e) {
  	searchTerm = e.target.value;
  	showFlightsCard(flightsCard);
  })

  document.querySelector("#delays").addEventListener('change', function () {
  	onlyDelay = this.checked;
  	showFlightsCard(flightsCard);
  })

}

function showFlightsCard(jsonObj) {
	var flying = jsonObj["flying"].sort(function (a, b) {
		if (a["time"] < b["time"]) {
			return -1;
		} else if (a["time"] > b["time"]) {
			return 1;
		} else {
			return 0;
		}
	})

	var flying = jsonObj["flying"].filter(function (item) {
		return item["type"] === type;
	})

	if (searchTerm) {
		flying = flying.filter(function (item) {
			var number = (item["num"].indexOf(searchTerm) !== -1);
			var city = (item["city"].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
			return (number || city); 
		})
	}

	if (onlyDelay) {
		flying = flying.filter(function (item) {
			return item["delay"] === true;
		})
	}

	if (timetable) {
		timetable.innerHTML = '';
	}

	for (var i = 0; i < flying.length; i++) { 
		var card = document.createElement('div');
		var cardList = document.createElement('ul');

		var itemCardList = flying[i];
		var delay = (itemCardList["delay"] === true);
		
		Object.keys(itemCardList).forEach(function (key) {

			if (key === "type" || key === "delay") {
				return;
			}

  			var itemList = document.createElement('li');

  			itemList.textContent = itemCardList[key];
  			cardList.appendChild(itemList);
  			itemList.classList.add("card__content-item");
  			if (delay) {
  				itemList.classList.add("delay");
  			}
		});
		
		cardList.classList.add("card__content-list");


		card.appendChild(cardList);

		timetable.appendChild(card);

	}
}



