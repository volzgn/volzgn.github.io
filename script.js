const apiKey = '988f7970-4e3c-4022-b4f4-a389981b9b68';

// Функция для получения текущего местоположения
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      const address = await getAddressFromCoords(lat, lon);
      document.getElementById("from").value = address;
    }, () => {
      alert("Не удалось получить местоположение");
    });
  } else {
    alert("Геолокация не поддерживается браузером");
  }
}

// Функция для получения адреса из координат
async function getAddressFromCoords(lat, lon) {
  try {
    const response = await fetch(`https://catalog.api.2gis.ru/3.0/items/geocode?key=${apiKey}&lon=${lon}&lat=${lat}&radius=50&fields=items.address&type=building%2Cattraction%2Cstation_platform`);
    const data = await response.json();
    return data.result.items[0].full_name || "Адрес не найден";
  } catch (error) {
    console.error("Ошибка получения адреса:", error);
    return "Ошибка получения адреса";
  }
}

// Функция для предложения адресов в поле "Куда" с использованием Suggest API и параметра suggest_type=route_endpoint
async function suggestAddresses(query) {
  try {
    const response = await fetch(`https://catalog.api.2gis.ru/3.0/suggests?q=${query}&key=988f7970-4e3c-4022-b4f4-a389981b9b68&suggest_type=route_endpoint&locale=ru_RU&fields=items.full_address_name`);
    const data = await response.json();
    return data.result.items.map(item => item.name);
  } catch (error) {
    console.error("Ошибка получения предложений адресов:", error);
    return [`https://catalog.api.2gis.ru/3.0/suggests?q=${query}&key=${apiKey}&type=address&suggest_type=route_endpoint`];
  }
}

// Отображение предложений по мере ввода
document.getElementById("to").addEventListener("input", async (event) => {
  const query = event.target.value;
  const suggestions = await suggestAddresses(query);

  const suggestionsContainer = document.getElementById("suggestions");
  suggestionsContainer.innerHTML = ""; // Очищаем старые предложения

  suggestions.forEach((suggestion) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.className = "suggestion-item";
    suggestionItem.innerText = suggestion;
    suggestionItem.onclick = () => {
      document.getElementById("to").value = suggestion;
      suggestionsContainer.innerHTML = ""; // Очистка предложений после выбора
    };
    suggestionsContainer.appendChild(suggestionItem);
  });
});

// Функция, которая вызывается при заказе такси
function orderTaxi() {
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;

  if (!to) {
    alert("Пожалуйста, введите адрес назначения");
    return;
  }

  alert(`Заказ такси\nОткуда: ${from}\nКуда: ${to}`);
}

// Вызов функции для автоматического заполнения поля "Откуда" при загрузке страницы
window.onload = getCurrentLocation;
