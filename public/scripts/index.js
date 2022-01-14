//main page logic, handlers and whatnot.
console.log("loaded data scripts");

let refreshData = () => {
  fetch('/api/game/character').then((res) => {
    return res.json();
  }).then((data) => {
    console.log("character data:");
    console.log(data);
    document.querySelector("span.hp").textContent = data.hp;
    document.querySelector("span.level").textContent = data.level;
    document.querySelector("span.xp").textContent = data.xp;
    document.querySelector("span.gold").textContent = data.gold;
  }).catch((err) => {
    console.log("got error when trying to fetch character data");
  });

  fetch('/api/game/dice').then((res) => {
    return res.json();
  }).then((data) => {
    console.log("dice data:");
    console.log(data);
  }).catch((err) => {
    console.log("got error when trying to fetch dice data");
  });
}

refreshData();