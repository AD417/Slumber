/* eslint-disable prefer-const */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
"use strict";
function updatePrestigeGain() {
  if (player.tran.lt(200)) {
    getEl("prestigeBtn").style.visibility = "hidden";
    return;
  }
  getEl("prestigeBtn").style.visibility = "visible";
  getEl("prestigeBtn").innerHTML = `Study in Peace. <br>Get ${knowledgeGain()} Knowledge.`;
}

function knowledgeGain() {
  return player.tran.div(200).sqrt().floor();
}

function study() {
  if (player.tran.lt(200)) return; // A failsafe, but, I mean... it's important.

  player.resets.study++;
  player.resets.studyTime += Math.sqrt(knowledgeGain().toNumber());

  player.tran = D(0);
  player.know = player.know.add(knowledgeGain());

  for (let i = 0; i < 4; i++) {
    player.tranProducers.intLevel[i] = 0;
    player.tranProducers.payout[i] = 0;
  }

  if (player.resets.study === 1) {
    tab(2);
    getEl("knowTab").style.display = "inline-block";
  }
}

function hasStudied() {
  return player.resets.study > 0;
}

function updateKnowledge() {
  getEl("knowledge").innerHTML = player.know;
}

class Upgrade {
  // eslint-disable-next-line max-params
  constructor(name, desc, effect, cost, ID) {
    this.id = ID;
    this.name = name;
    this.desc = desc;
    this.effect = effect;
    this.cost = cost;
    this.enabled = true; // Keeping this for later
  }

  get bought() {
    return player.upgs[ID];
  }

  set bought(x) {
    player.upgs[ID] = x;
  }

  canAfford() {
    return (player.dual.gte(this.cost));
  }

  buy() {
    if (!this.canAfford() || this.bought) return false;
    player.dual.minus(this.cost);
    this.bought = true;
    return true;
  }
}

class Repeatable extends Upgrade { 
  // eslint-disable-next-line max-params
  constructor(name, desc, effect, cost, ID, maxLvl) {
    super(name, desc, effect, cost, ID);
    this.max = maxLvl;
  }
  //
  // get cost() {
  //   return 21;
  // }

  maxxed() {
    return (this.bought >= this.max);
  }

  buy() {
    if (!this.canAfford() || this.maxxed()) return false;
    player.dual.minus(this.cost);
    this.bought++;
    return true;
  }
}

const upgrades = {
  u11: new Repeatable(
    "Focus", 
    "Increase tranquility gain", 
    () => D(player.upgs[0] + 1), 
    () => Decimal.pow(2, player.upgs[0]), 
    0, 10
  ),
  u12: new Repeatable(
    "Determination", 
    "Tasks run for longer", 
    () => Decimal.pow(2, player.upgs[1]), 
    () => Decimal.pow(10, player.upgs[1]), 
    1, 7
  ),
  u13: new Repeatable(
    "Understanding", 
    "Increase Knowledge gain", 
    () => D(player.upgs[2] + 1), 
    () => Decimal.pow(player.upgs[2] + 1, 4), 
    2, 9
  ),
  u14: new Repeatable(
    "Restfulness", 
    "Increase tranquility gain based on time since last rest", 
    () => Math.min(30 * Math.pow(0.4, player.upgs[3]), 0.05), 
    () => (10 * Decimal.pow(5, player.upgs[3])), 
    3, 7
  ),

  u21: new Upgrade(
    "Cleanliness", 
    "Unlock a new task", 
    null, 
    1, 4
  ),

  u22: new Upgrade(
    "Recollection", 
    "Boost bookshelf dusting based on time slept", 
    () => Math.sqrt(player.reset.sleepTime), 1, 5)
};

const dUSizes = { x: 4, y: 2 };
// Function drawDualityTable(reset = false) { // Random garbage for drawing a table, do NOT call this function.
// const table = document.getElementById("upgs");
// for (let r = 1; r <= dUSizes.y; r++) {
//     const row = table.insertRow(r - 1);
//     for (let c = 1; c <= dUSizes.x; c++) {
//       const col = row.insertCell(c - 1);
//       const id = (r * 10 + c);
// eslint-disable-next-line max-len
//       col.innerHTML = `<button id='pu${id}' class='infinistorebtn1' onclick='buyPU(${id},${r < 2})'>${typeof(puDescs[id]) === "function" ? `<span id='pud${id}'></span>` : puDescs[id] || "???"}${puMults[id] ? `<br>Currently: <span id='pue${id}'></span>` : ""}<br><span id='puc${id}'></span></button>`;
//     }
// }
// } 


const testVar = new Upgrade("I can do itttt", Decimal.pow(2, 87865), D(50));