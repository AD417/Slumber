/* eslint-disable max-len */
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
    "Boost bookshelf dusting based on time spent studying", 
    () => Math.sqrt(player.reset.studyTime), 1, 5)
};

const tableSize = { x: 5, y: 5 };
function drawUpgTable() { // Random garbage for drawing a table, do NOT call this function.
  const table = getEl("upgrade-table");
  table.innerHTML = `<colgroup><col span="${tableSize.x}" style="width:${100 / tableSize.x}%"></colgroup>`;
  for (let r = 1; r <= tableSize.y; r++) {
    const row = table.insertRow(r - 1);
    for (let c = 1; c <= tableSize.x; c++) {
      const col = row.insertCell(c - 1);
      const id = `u${r}${c}`;
      try {
        col.innerHTML = 
          `<button id='upgrade-base-${id}' class='know-upgrade' onclick='buyUpg(${id},${r < 2})'>
          ${typeof(upgrades[id].desc) === "function" ? `<span id='upgrade-desc-${id}'></span>` : upgrades[id].desc || "???"}
          ${upgrades[id].effect ? `<br>Currently: <span id='upgrade-effect-${id}'></span>` : ""}<br>
          <span id='upgrade-cost-${id}'></span></button>`;
      } catch (e) {
        col.innerHTML = 
          `<button id='upgrade-base-${id}' class='upgrade'> ??? </button>`;
      }
    }
  }
} 


const testVar = new Upgrade("I can do itttt", Decimal.pow(2, 87865), D(50));