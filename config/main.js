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

function createGameCard(game) {
  const gameDiv = document.createElement("div");
  gameDiv.classList.add("game");

  const gameImage = document.createElement("img");

  const isExternal =
    typeof game.url === "string" &&
    (game.url.startsWith("https://") ||
      game.url.startsWith("http://"));

  if (isExternal) {
    gameImage.src = game.image;
  } else {
    gameImage.src = `${serverUrl1}/${game.url}/${game.image}`;
  }

  gameImage.alt = game.name;

  gameImage.onerror = () => {
    gameImage.src = "https://via.placeholder.com/200x200?text=Game";
  };

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

  return gameDiv;
}

function displayGames(filteredGames) {
  const gamesContainer = document.getElementById("gamesContainer");
  gamesContainer.innerHTML = "";

  const newGames = filteredGames.filter(game => game.new === true);
  const regularGames = filteredGames.filter(game => !game.new);

  // 🔥 NEW GAMES SECTION
  if (newGames.length > 0) {
    const title1 = document.createElement("h2");
    title1.textContent = "🔥 New Games";
    title1.className = "section-title";
    gamesContainer.appendChild(title1);

    const newGrid = document.createElement("div");
    newGrid.className = "games-grid";

    newGames.forEach(game => {
      newGrid.appendChild(createGameCard(game));
    });

    gamesContainer.appendChild(newGrid);
  }

  // 🎮 ALL GAMES SECTION
  const title2 = document.createElement("h2");
  title2.textContent = "🎮 All Games";
  title2.className = "section-title";
  gamesContainer.appendChild(title2);

  const allGrid = document.createElement("div");
  allGrid.className = "games-grid";

  regularGames.forEach(game => {
    allGrid.appendChild(createGameCard(game));
  });

  gamesContainer.appendChild(allGrid);
}

function handleSearchInput() {
  const searchInputValue = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const filteredGames = gamesData.filter(game =>
    game.name.toLowerCase().includes(searchInputValue)
  );

  displayGames(filteredGames);
}

fetch("./config/games.json")
  .then((response) => response.json())
  .then((data) => {
    gamesData = data;
    displayGames(data);
  })
  .catch((error) =>
    console.error("Error fetching games:", error)
  );

document
  .getElementById("searchInput")
  .addEventListener("input", handleSearchInput);

document.getElementById("title").textContent = sitename;
document.getElementById("subtitle").textContent = subtext;
