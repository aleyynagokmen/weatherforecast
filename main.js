const form = document.querySelector(".form");
const input = document.querySelector("#location");
const msg = document.querySelector(".msg");
const list = document.querySelector(".weatherShow .cities");
const apiKey = '000439bbede23cb8be4da6e4f98d8805';



document.addEventListener("DOMContentLoaded", () => {
    getUserLocation();
});


form.addEventListener("submit", (e) => {
    e.preventDefault();

    let inputVal = input.value.trim();

    if (inputVal === "") {
        msg.textContent = "Lütfen geçerli bir şehir adı girin.";
        return;
    }

    const listItems = list.querySelectorAll(".city");
    const listItemArray = Array.from(listItems);

    const filtredArray = listItemArray.filter(eleman => {
        let content = eleman.querySelector(".city-name span").textContent.toLowerCase();
        return content === inputVal.toLowerCase();
    });

    if (filtredArray.length > 0) {
        msg.textContent = alert(`${filtredArray[0].querySelector(".city-name span").textContent} şehrinin hava durumunu daha önce seçtiniz.`);
        form.reset();
        input.focus();
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Şehir bulunamadı');
            }
            return response.json();
        })
        .then(data => {
            const { main, name, sys, weather } = data;
            const icon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

            const li = document.createElement("li");
            li.classList.add("city");

            const markup = `
                <h2 class="city-name" data-name="${name}" data-country="${sys.country}">
                    <span>${name}</span>
                    <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)} <sup>C</sup></div>
                <figure>
                    <img class="city-icon" src="${icon}" alt="${weather[0].description}" />
                    <figcaption>${weather[0].description}</figcaption>
                </figure>
            `;
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(error => {
            msg.textContent = alert('Lütfen geçerli bir şehir adı girin.');
        });

    msg.textContent = "";
    form.reset();
    input.focus();
});

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = now.toLocaleString('tr-TR', { weekday: 'long' });
    const date = now.toLocaleString('tr-TR');

    const timeString = `${hours}:${minutes}:${seconds}`;
    const dateString = `${day}, ${date}`;

    document.querySelector('#inf').textContent = `${timeString}    ${dateString}`;
}

setInterval(updateClock, 1000);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Lokasyon bulunamadı.");
    }
}

function successCallback(position) {
    const { latitude, longitude } = position.coords;
    getWeatherDataByCoordinates(latitude, longitude);
}

function errorCallback(error) {
    console.log("Konum bilgisi alınamadı:", error.message);
}

function getWeatherDataByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hava durumu verileri alınamadı.');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            console.error("Hata: ", error.message);
        });
}

function displayWeatherData(data) {
    const { main, name, sys, weather } = data;
    const icon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

    const li = document.createElement("li");
    li.classList.add("auto-city");

    const markup = `
    <h2 class="city-name" data-name="${name}" data-country="${sys.country}">
    <span>${name}</span>
    <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)} <sup>C</sup></div>
    <figure>
    <img class="city-icon" src="${icon}" alt="${weather[0].description}" />
    <figcaption>${weather[0].description}</figcaption>
    </figure>
    `;

    li.innerHTML = markup;
    document.querySelector(".cities").appendChild(li);
}

