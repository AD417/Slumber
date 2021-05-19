/* eslint-disable prefer-const */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
"use strict";
// General Data
let player;
const D = x => new Decimal(x); // I'm lazy. 
const getEl = x => document.getElementById(x);
const basePlayer = { 
  firstTick: Date.now(),
  lastTick: Date.now(),
  version: 0.001,
  // Stage: 0,

  tran: D(0),
  tranProducers: {
    timeLeft: [3000, 15000, 60000, 99999999],
    intLevel: [0, 0, 0, 0],
    payout: [0, 0, 0, 0],
  },

  know: D(0), 
  upgs: [0, 0, 0, 0, false, false, false, false],

  resets: {
    study: 0,
    sleepTime: 0, // If this value reaches break levels, we fucked up.
  },

  stats: {
    totalTran: D(0),
    totalUpgs: D(0),
  },

  testVar: "Anthios made this you forkin idiots"
};
let prod;

function tab(tabID) {
  let i, tabcontent, tablinks;
  
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  
  getEl([null, "Main", "Knowledge", "Options", "Statistics", "DevLog"][tabID]).style.display = "block";
  // SetUpCanvas(tabID)
}

function load() {
  tab(1);
  const parse = localStorage.getItem("save");
  try {
    player = JSON.parse(atob(parse));
    player = check(player, basePlayer);
  } catch (e) {
    newGame();
  }
  player = decimalify(player); // Give everything its code-mandated Break
  setup(); // Load in everything that is not updated on every tick. 
  // setupTemp();
  setInterval(loop, 50);
  setInterval(save, 10000);
}

function setup() {
  setupProduction();
  checkTranStatus();
  if (hasStudied()) getEl("knowTab").style.display = "inline-block";
}

function check(val, base) {
  if (base instanceof Object && !(base instanceof Decimal)) {
    if (val === undefined) return base;
    let i;
    for (i in base) {
      val[i] = check(val[i], base[i]);
    }
    return val;
  } 
  if (val === undefined) return base;
  return val;
    
}

function decimalify(val) {
  if (val instanceof Object && !(val instanceof Decimal)) {
    let i;
    for (i in val) {
      val[i] = decimalify(val[i]);
    }
    return val;
  } 
  if (typeof(val) === "string" && !isNaN(parseInt(val, 10))) {
    return D(val);
  }
  return val;
}

function newGame() {
  basePlayer.lastTick = Date.now();
  basePlayer.firstTick = Date.now();
  player = decimalify(JSON.parse(JSON.stringify(basePlayer)));
  setup();
}

function save() {
  if (canSave()) {
    localStorage.setItem("save", btoa(JSON.stringify(player)));
  }
  // Console.log("Game saved.")
}

function canSave() {
  return true; // ToDo... not now, but eh.
}

function reset() {
  if (!confirm("are you suuuuuuuuurrrreeee????")) return;
  newGame();
}

// Game Loop stuff

function loop(diff) { // Runs at 20TPS
  if (!diff) {
    // eslint-disable-next-line no-param-reassign
    diff = Date.now() - player.lastTick;
    player.lastTick += diff;
  }
  updateProduction(diff); // Dont worry about it.
  showProduction();
  updateProductionProgress();

  updateTranquility();
  updateTranCosts();

  updatePrestigeGain();
  updateKnowledge();

  updateStatistics();
}

function updateStatistics() {
  const stats = player.stats;
  getEl("playtime").innerHTML = toCTime(player.lastTick - player.firstTick);
  getEl("totalTran").innerHTML = `A total of ${stats.totalTran} tranquility has been produced.`;
  getEl("totalUpgs").innerHTML = `${stats.totalUpgs} upgrades have been bought.`;
}
