// This changes the title of your site

var sitename = "Umblocked";
var subtext = "V1 Updates weekly";

// more settings in main.css

// END CONFIG
// DO NOT MODIFY IF YOU DO NOT KNOW WHAT YOUR DOING!

import "/./config/custom.js";

var serverUrl1 = "https://gms.parcoil.com";

var currentPageTitle = document.title;
document.title = `${currentPageTitle} | ${sitename}`;

let gamesData = [];

function displayFilteredGames(filteredGames) {
  const gamesContainer = document.getElementById("gamesContainer");
  gamesContainer.innerHTML = "";

  filteredGames.forEach((game) => {
    const gameDiv = document.createElement("div");
    gameDiv.classList.add("game");

    const gameImage = document.createElement("img");

    const isExternal =
      typeof game.url === "string" &&
      (game.url.startsWith("https://") ||
       game.url.startsWith("http://"));

    // Image source
    if (isExternal) {
      gameImage.src = game.image;
    } else {
      gameImage.src = `${serverUrl1}/${game.url}/${game.image}`;
    }

    gameImage.alt = game.name;

    // Fallback image if broken
    gameImage.onerror = () => {
      gameImage.src =
        "https://via.placeholder.com/200x200?text=Game";
    };

    // Click handler
    gameImage.onclick = () => {
      if (isExternal) {
        window.location.href = game.url;
      } else {
        window.location.href =
          `play.html?gameurl=${encodeURIComponent(game.url + "/")}`;
      }
    };

    const gameName = document.createElement("p");
    gameName.textContent = game.name;

    if (game.new === true) {
      gameName.innerHTML += " 🔥";
    }

    gameDiv.appendChild(gameImage);
    gameDiv.appendChild(gameName);
    gamesContainer.appendChild(gameDiv);
  });
}

function handleSearchInput() {
  const searchInputValue = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const filteredGames = gamesData.filter((game) =>
    game.name.toLowerCase().includes(searchInputValue)
  );

  displayFilteredGames(filteredGames);
}

fetch("./config/games.json")
  .then((response) => response.json())
  .then((data) => {
    gamesData = data;
    displayFilteredGames(data);
  })
  .catch((error) =>
    console.error("Error fetching games:", error)
  );

document
  .getElementById("searchInput")
  .addEventListener("input", handleSearchInput);

document.getElementById("title").textContent = sitename;
document.getElementById("subtitle").textContent = subtext;
