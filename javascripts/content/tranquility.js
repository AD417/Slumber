/* eslint-disable prefer-const */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
"use strict";
class Countdown {
  // eslint-disable-next-line max-params
  constructor(name, ID, time, reward) {
    this.name = name;
    this.id = ID;
    this.timeMax = time; // In ms
    this.timeLeft = time;
    this.reward = reward;
    this.running = false; // Might need to fix this in data. Somehow. 
  }

  get timeLevel() {
    return player.tranProducers.intLevel[this.id];
  }

  set timeLevel(level) {
    player.tranProducers.intLevel[this.id] = level;
  }

  get timeCost() {
    return Decimal.ceil(Decimal.pow(3, this.id + 1).times(Decimal.pow(1.8 - (this.id / 10), this.timeLevel)));
  }

  get payLevel() {
    return player.tranProducers.payout[this.id];
  }

  set payLevel(level) {
    player.tranProducers.payout[this.id] = level;
  }

  get payCost() {
    return Decimal.ceil(Decimal.pow(3, this.id + 1).times(Decimal.pow(1.5 - (this.id / 10), this.payLevel)));
  }

  get timeStep() {
    return 1000 * Math.pow(1.25, this.timeLevel);
  }

  get timeLeft() {
    return player.tranProducers.timeLeft[this.id];
  }

  set timeLeft(time) {
    player.tranProducers.timeLeft[this.id] = time;
  }

  stepTime(diff) { // Diff is the number of ms since last tick
    if (!this.running) {
      this.timeLeft = this.timeMax; // Failsafe
      return;
    }
    this.timeLeft -= this.timeStep * (diff / 1000);
    if (this.timeLeft <= 0) {
      this.running = false;
      this.timeLeft = this.timeMax;
      player.tran = player.tran.add(this.reward * (1 + this.payLevel));
      player.stats.totalTran = player.stats.totalTran.add(this.reward * (1 + this.payLevel));
    }
  }

  start() {
    if (this.running) {
      this.running = false;
      return;
    }
    let anyRunning = false;
    for (let i in prod) {
      anyRunning = (anyRunning || prod[i].running);
    }
    if (anyRunning) return;
    this.running = true;
  }

  getTimeLeft() {
    return Math.round(1000 * this.timeLeft / this.timeStep);
  }

  getInvervalCost() {
    return Decimal.pow(5, this.id + 1);
  }
}
function setupProduction() {
  prod = [
    new Countdown("Tidy up the bookshelves", 0, 3000, 1),
    new Countdown("Mop the floor", 1, 15000, 5),
    new Countdown("Mow the lawn", 2, 60000, 25), 
    new Countdown("Develop the game", 3, 99999999, 0) // I dunno tbh. 
  ];
}

function doTask(taskID) {
  prod[taskID].start();
}

function updateProduction(diff) {
  for (let i in prod) {
    prod[i].stepTime(diff);
  }
}

function showProduction() {
  let item;
  for (let i in prod) {
    item = prod[i];
    getEl(`prod-${i}`).innerHTML = 
      `${item.name}<br>
      for ${item.reward * (1 + item.payLevel)} tranquility <br>
      ${toCTime(item.getTimeLeft())} remaining`;
  }
}

function updateProductionProgress() {
  let item;
  for (let i in prod) {
    item = prod[i];
    if (item.running) {
      getEl(`prod-bar-${i}`).style.width = 
        `${(1 - (item.timeLeft / item.timeMax)) * (4 + getEl(`prod-${i}`).clientWidth)}px`;
    } else {
      getEl(`prod-bar-${i}`).style.width = "0px";
    }
  }
}

function upgTranInterval(ID) {
  const item = prod[ID];
  if (item.timeCost.gt(player.tran)) return;
  player.tran = player.tran.minus(item.timeCost);
  item.timeLevel += 1;
  player.stats.totalUpgs++;
  checkTranStatus();
}

function upgTranPay(ID) {
  const item = prod[ID];
  if (item.payCost.gt(player.tran)) return;
  player.tran = player.tran.minus(item.payCost);
  item.payLevel += 1;
  player.stats.totalUpgs++;
  checkTranStatus();
}

function updateTranCosts() {
  for (let i in prod) {
    let item = prod[i];
    getEl(`cost-time-${i}`).innerHTML = `Decrease Interval for ${item.timeCost} tranquility`;
    getEl(`cost-pay-${i}`).innerHTML = `Increase gain for ${item.payCost} tranquility`;
  }
}

function checkTranStatus() {
  for (let i = 0; i < 3; i++) {
    if (i < 2 && (prod[i].timeLevel > 0 || prod[i].payLevel > 0)) {
      getEl(`tile-${i + 1}`).style = "visibility: visibile";
    } else {
      getEl(`tile-${i + 1}`).style = "visibility: hidden";
    }
  }
}

function updateTranquility() {
  getEl("tranquility").innerHTML = player.tran;
}

