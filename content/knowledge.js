function updatePrestigeGain() {
    if (player.tran.lt(200)) {
        
    }
}

class Upgrade {
    constructor(name, desc, effect, cost, ID) {
        this.name = name;
        this.desc = desc;
        this.effect = effect;
        this.cost = cost;
        this.enabled = true; //keeping this for later
        const upg = this;
        Object.defineProperty(upg, "bought", {
            get() {
              return player.upgs[ID]
            },
            set(x) {
              player.upgs[ID] = x
            }
        })
    }
    canAfford() {
        return (player.dual.gte(this.cost))
    }
    buy() {
        if (!this.canAfford() || this.bought) return false
        player.dual.minus(this.cost)
        this.bought = true
    }
}

class Repeatable extends Upgrade { 
    constructor(name, desc, effect, cost, ID, maxLvl) {
        super(name, desc, effect, cost, ID)
        const upg = this;
        this.max = maxLvl
        Object.defineProperty(upg, "cost", {
          get() {
            return cost.bind(upg)()
          }
        })
    }
    maxxed() {
        return (this.bought >= this.max)
    }
    buy() {
        if (!this.canAfford() || this.maxxed()) return false
        player.dual.minus(this.cost)
        this.bought++
    }
}

function hasRested() {
    return player.resets.sleep > 0;
}

const upgrades = {
    u11: new Repeatable("Focus", "Increase tranquility gain", () => D(player.upgs[0] + 1), () => Decimal.pow(2, player.upgs[0]), 0, 10),
    u12: new Repeatable("Determination", "Tasks run for longer", () => Decimal.pow(2,player.upgs[1]), () => Decimal.pow(10, player.upgs[1]), 1, 7),
    u13: new Repeatable("Understanding", "Increase Knowledge gain", () => D(player.upgs[2] + 1), () => Decimal.pow(player.upgs[2]+1, 4), 2, 9),
    u14: new Repeatable("Restfulness", "Increase tranquility gain based on time since last rest", () => Math.min(30 * Math.pow(0.4, player.upgs[3]), 0.05), () => (10 * Decimal.pow(5, player.upgs[3])), 3, 7),

    u21: new Upgrade("Cleanliness", "Unlock a new task", null, 1, 4),
    u22: new Upgrade("Recollection", "Boost <1st task> based on time slept", () => Math.sqrt(player.reset.sleepTime), 1, 5)
}

const dUSizes = {x: 4, y:2}
function drawDualityTable(reset = false) { //random garbage for drawing a table, do NOT call this function.
    var table = document.getElementById("upgs")
    for (let r = 1; r <= dUSizes.y; r++) {
        let row = table.insertRow(r - 1)
        for (let c = 1; c <= dUSizes.x; c++) {
            var col = row.insertCell(c - 1)
            var id = (r * 10 + c)
            col.innerHTML = "<button id='pu" + id + "' class='infinistorebtn1' onclick='buyPU("+id+","+(r<2)+")'>"+(typeof(puDescs[id])=="function"?"<span id='pud"+id+"'></span>":puDescs[id]||"???")+(puMults[id]?"<br>Currently: <span id='pue"+id+"'></span>":"")+"<br><span id='puc"+id+"'></span></button>"
        }
    }
}


const testVar = new Upgrade("I can do itttt", Decimal.pow(2,87865), D(50))