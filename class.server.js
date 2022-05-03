var gns;
var AllServer = {};

function addToList(hostname, parent = "") {
  if (!(hostname in AllServer)) {
    AllServer[hostname] = new Server(hostname, parent);
    AllServer[hostname]._neightboors();
  }
}

class Server {
  constructor(id, parent) {
    this.id = id;
    this.parent = parent;
    this.working={};
    this.reset_th();
  }

  get _data() {
    return gns.getServer(this.id);
  }

  _neightboors() {
    var tmp_list = gns.scan(this.id);
    for (var host of tmp_list) {
      addToList(host, this.id);
    }
    return tmp_list;
  }

  get neightboors() {
    return this._neightboors();
  }

  get ram() {
    var tmp_max = this._data.maxRam;
    var tmp_used = this._data.ramUsed;
    var tmp_free = this._data.maxRam - this._data.ramUsed;
    if (this.id == "home") tmp_free = 0;
    return { max: tmp_max, used: tmp_used, free: tmp_free };
  }

  get money() {
    var tmp_max = this._data.moneyMax;
    var tmp_av = Math.ceil(this._data.moneyAvailable);
    var tmp_mi = Math.ceil(this._data.moneyMax-this._data.moneyAvailable);
    return { max: tmp_max, available: tmp_av, missing: tmp_mi };
  }

  get security() {
    var tmp_max = this._data.minDifficulty;
    var tmp_cu = this._data.hackDifficulty;
    var tmp_ba = this._data.baseDifficulty;
    return { min: tmp_max, current: tmp_cu, base: tmp_ba };
  }

  get root() {
    var tmp_r = this._data.hasAdminRights;
    var tmp_b = this._data.backdoorInstalled;
    var tmp_pn = this._data.numOpenPortsRequired;
    var tmp_po = this._data.openPortCount;
    return {
      root: tmp_r,
      backdoor: tmp_b,
      ports_required: tmp_pn,
      ports_open: tmp_po,
    };
  }

  get hacks() {
    var tmp_lv = this._data.requiredHackingSkill;
    var tmp_ti = Math.ceil(gns.getHackTime(this.id));
    var tmp_anal = gns.hackAnalyze(this.id);
    var tmp_ch = 0; //gns.hackAnalyzeChance(this.id);
    var tmp_sec = 0; //ns.hackAnalyzeSecurity(this.id);
    var tmp_hrh = this.money.max * tmp_anal;
    var tmp_hrs = tmp_hrh / tmp_ti;
    var tmp_th = Math.ceil(this.money.max / tmp_hrh);
    if (this.money.max==0) tmp_th = 0;
    if (tmp_hrh == 0)  tmp_th = 0;
    if (tmp_anal ==0) tmp_th = 0;

    return {
      level: tmp_lv,
      time: tmp_ti,
      analyze: tmp_anal,
      max_money: tmp_hrh,
      max_money_second: tmp_hrs,
      wanted_threads: tmp_th,
    };
  }

  get grows() {
    var tmp_multi=this.money.missing/(this.money.available+1);
    if (this.money.missing==0) tmp_multi=0;
    if (tmp_multi>1.0) {
      var tmp_th = Math.ceil(
        gns.growthAnalyze(this.id,tmp_multi)
      );
    } else {
      var tmp_th = 0;
    }
    return { wanted_threads: tmp_th };
  }

  get weaks() {
    var tmp_wk = gns.weakenAnalyze(1);
    var tmp_th = Math.ceil(
      (this.security.current - this.security.min) / tmp_wk
    );
    return { wanted_threads: tmp_th };
  }

  get max_thread() {
    var gr = this.grows.wanted_threads;
    var wk = this.weaks.wanted_threads;
    var hk = this.hacks.wanted_threads;
    var mx = 0;
    if (gr == 0) {
      this.working.gt=0;
    }
    if (wk == 0 || this.security.current>=90) {
      this.working.wt=0;
    }
    if (hk <= this.working.ht) {
      //this.reset_th();
    }
    return { gt: gr, wt: wk, ht: hk };
  }

  reset_th() {
    this.working.gt=0;
    this.working.wt=0;
    this.working.ht=0;
  }

  get isTarget() {
    var is=true;
		if (this._data.purchasedByPlayer) is=false;
		if (this._data.hasAdminRights != true) is=false;
		if (this._data.hackDifficulty > gns.getHackingLevel()) is=false;
		if (this._data.moneyMax == 0) is=false;
    return is;
  }

  displayWork() {
    var str=
      this.id + ":\t" +
      "G:" + this.working.gt + "/" + this.max_thread.gt + "\t" +
      "W:" + this.working.wt + "/" + this.max_thread.wt + "\t" +
      "H:" + this.working.ht + "/" + this.max_thread.ht + ""
    ;
    gns.print(str);
    gns.tprint(str);
  }
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  gns = ns;
  ns.clearLog();
  ns.tail();
  addToList("home");
  await ns.sleep(10);
  //ns.print(AllServer['phantasy'].id, ":\t ",AllServer['phantasy'].max_thread);
  //3416
  
  while (false) {
    ns.clearLog();
    //98449
    var printoutServer="foodnstuff";
    ns.print(AllServer[printoutServer].id, ":\t", 
      "G:",AllServer[printoutServer].working.gt,"/",AllServer[printoutServer].max_thread.gt,"\t",
      "W:",AllServer[printoutServer].working.wt,"/",AllServer[printoutServer].max_thread.wt,"\t",
      "H:",AllServer[printoutServer].working.ht,"/",AllServer[printoutServer].max_thread.ht,"\n",
      "GrowThread:\t",AllServer[printoutServer].grows,"\n",
      "Money:\t\t",AllServer[printoutServer].money,"\n",
      "Target:\t\t",AllServer[printoutServer].isTarget,"\n",
      "Sec:\t\t",AllServer[printoutServer].security,"\n"
    );

    //
    await ns.sleep(10);
  }
  ns.print("Server List Count: ", Object.keys(AllServer).length);
  return AllServer;
}
