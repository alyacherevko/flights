var type = "departure"; //переменная, отвечающая за отображении данных по умолчанию при загрузки страницы
var searchTerm = null; //значение по умолчанию переменной, отвечающией за поиск в приложении
var onlyDelay = false; //значение по умолчанию переменной, отвечающей за отображение задержанных рейсов 

function changeType(newType, flightsCard) { //функция изменение типа "вылет"/"прилет"
	type = newType; //в переменную type перезаписывается значение в зависимости от выбора типа 
	var active = document.getElementsByClassName("header__button--active"); //записываем в переменную active все найденые элемент с указанным классом 
	while(active && active.length > 0) { //цикл, пока есть элементы с активным стилем
		active[0].classList.remove('header__button--active'); //удаляет у выбранных элементов указанный класс
	}
	document.querySelector("#" + newType).classList.add("header__button--active");//добавляем заголовку активного типа класс активности
	showFlightsCard(flightsCard);
	return false; //чтобы подавить перезагрузку страницы при клике на элемент
}

var timetable = document.querySelector('#timetable'); 

var requestURL = "https://alyacherevko.github.io/flights.json"; //ссылка на json с данными о рейсах
var request = new XMLHttpRequest(); //создание нового запроса 
request.open('GET', requestURL); //открытие нового запроса 
request.responseType = 'json'; 
request.send(); 

request.onload = function() { //ожидание и возврат ответа с сервера
  var flightsCard = request.response; 
  showFlightsCard(flightsCard); //передаем объект в функцию, которая отображает полученные из объекта данные на странице 

  document.querySelector('#departure').onclick = function () {//меняем тип на departure по клику на элемент
  	return changeType("departure", flightsCard);
  }

  document.querySelector('#arrival').onclick = function () {//меняем тип на arrival по клику на элемент
  	return changeType("arrival", flightsCard);
  }

  document.querySelector("#search").addEventListener('input', function (e) {//обработчик ввода текста в строку поиска
  	searchTerm = e.target.value; //значение поисковой строки
  	showFlightsCard(flightsCard);
  })

  document.querySelector("#delays").addEventListener('change', function () {//обработчик фильтра задерживающихся рейсов
  	onlyDelay = this.checked; //перезаписываем переменную onlyDelay c новым состоянием 
  	showFlightsCard(flightsCard);
  })

}

function showFlightsCard(jsonObj) {
	var flying = jsonObj["flying"].sort(function (a, b) { //сортировка ключа "time" по возрастанию
		if (a["time"] < b["time"]) {
			return -1;
		} else if (a["time"] > b["time"]) {
			return 1;
		} else {
			return 0;
		}
	})

	var flying = jsonObj["flying"].filter(function (item) { //фильтрация элементов по ключу "type"
		return item["type"] === type;
	})

	if (searchTerm) {
		flying = flying.filter(function (item) { //поиск элементов по названию города и номеру рейса 
			var number = (item["num"].indexOf(searchTerm) !== -1); //true, если ключ "num" содержит поисковый запрос
			var city = (item["city"].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1); //true, если ключ "city" содержит поисковый запрос не в зависимости от регистра
			return (number || city); 
		})
	}

	if (onlyDelay) {
		flying = flying.filter(function (item) { //возврат всех рейсов с задержкой 
			return item["delay"] === true;
		})
	}

	if (timetable) { //находит расписание и очищает этот элемент
		timetable.innerHTML = '';
	}

	for (var i = 0; i < flying.length; i++) { 
		var card = document.createElement('div'); //создаем элемент, отвечающий за отображений карточки полета
		var cardList = document.createElement('ul'); //создаем элемент, отвечаюший за отображение содержимого карточки полета

		var itemCardList = flying[i]; //записываем в данную переменную все элементы массива из полученного JSON
		var delay = (itemCardList["delay"] === true); //в списках "вылет" и "прилет" так же показываем рейсы с задержкой
		
		Object.keys(itemCardList).forEach(function (key) {//функция, которая отвечает за создание элементов списка из данного массива

			if (key === "type" || key === "delay") {//если функция получает эти ключи, она исключает их из ключей, которые должны отобразиться на странице (КАК ПРАВИЛЬНО ЭТО СКАЗАТЬ?????)
				return;
			}

  			var itemList = document.createElement('li'); //создаем элемент списка, который отвечает за содержимое карточки полета

  			itemList.textContent = itemCardList[key]; //записываем в него все текстовые значения
  			cardList.appendChild(itemList); //добавляем элементы списка в созданный список
  			itemList.classList.add("card__content-item"); //добавляем элементам указанный класс
  			if (delay) {
  				itemList.classList.add("delay"); //если у элемента есть ключ delay c значением true добавлем у меня указанный класс, который стилистически покажет, что рейс задержан (выделение красным цветом)
  			}
		});
		
		cardList.classList.add("card__content-list");//добавлем созданную ранее списку указанный класс


		card.appendChild(cardList);//добавляем созданный список в созданный ранее div, который отвечает за отображение карточки полета на странице

		timetable.appendChild(card);//добавляем созданный ранее div на страницу 

	}
}



