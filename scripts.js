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
    const response = await fetch(`https://catalog.api.2gis.ru/3.0/items/geocode?key=${apiKey}&lon=${lon}&lat=${lat}`);
    const data = await response.json();
    return data.result.items[0].address_name || "Адрес не найден";
  } catch (error) {
    console.error("Ошибка получения адреса:", error);
    return "Ошибка получения адреса";
  }
}

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

// Вызов функции для автоматического заполнения поля "Откуда"
window.onload = getCurrentLocation;
