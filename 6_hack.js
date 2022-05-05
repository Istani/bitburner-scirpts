import * as Scan from '3_target.js';
import * as Weak from '4_weak.js';
import * as Grow from '5_grow.js';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  var scan_list = await Scan.main(ns);
  var weak_list = await Weak.main(ns);
  var grow_list = await Grow.main(ns);
  var hack_list={};
  
  for (var hostname of Object.keys(scan_list)) {
    hack_list[hostname]=scan_list[hostname];
    hack_list[hostname].grow=grow_list[hostname].grow;
    hack_list[hostname].weaken=weak_list[hostname].weaken;

    var turn=Math.ceil(ns.hackAnalyzeThreads(hostname, hack_list[hostname].maxMoney*0.1));
    var max=Math.ceil(ns.hackAnalyzeThreads(hostname, hack_list[hostname].maxMoney));
    var time=Math.ceil(ns.getHackTime(hostname));
    hack_list[hostname].hack={};
    hack_list[hostname].hack.turns=turn;
    hack_list[hostname].hack.max=max;
    hack_list[hostname].hack.time=time;
  }
  //ns.print(Object.keys(weaken_list).length, " to Weaken");
  return hack_list;
}