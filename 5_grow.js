import * as Scan from '3_target.js';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  var scan_list = await Scan.main(ns);
  var grow_list={};
  
  for (var hostname of Object.keys(scan_list)) {
    var pow=scan_list[hostname].currentMoney;
    var val=scan_list[hostname].maxMoney;//-pow;
    var multi = val/pow;
    if (multi>1) {

      var time = ns.getGrowTime(hostname);
      var turn = Math.ceil(multi*2);
      // Da die berechnung mit growAnalyze nicht richtig ist, einfach geschätzt^^

      grow_list[hostname] = scan_list[hostname];
      grow_list[hostname].grow={};
      grow_list[hostname].grow.turns=turn;
      grow_list[hostname].grow.time=time;
    } else {
      grow_list[hostname] = scan_list[hostname];
      grow_list[hostname].grow={};
      grow_list[hostname].grow.turns=0;
      grow_list[hostname].grow.time=0;
    }
  }
  //ns.print(Object.keys(grow_list).length, " to Grow");
  return grow_list;
}