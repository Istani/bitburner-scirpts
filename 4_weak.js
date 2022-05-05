import * as Scan from '3_target.js';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  var scan_list = await Scan.main(ns);
  var weaken_list={};
  var pow=ns.weakenAnalyze(1,1); // 0.05
  for (var hostname of Object.keys(scan_list)) {
    var val = ns.getServerSecurityLevel(hostname)-ns.getServerMinSecurityLevel(hostname)
    if (val>0) {
      var turn = Math.ceil(val/pow);
      var time = Math.ceil(ns.getWeakenTime(hostname));
      weaken_list[hostname] = scan_list[hostname];
      weaken_list[hostname].weaken={};
      weaken_list[hostname].weaken.turns=turn;
      weaken_list[hostname].weaken.time=time;
    } else {
      weaken_list[hostname] = scan_list[hostname];
      weaken_list[hostname].weaken={};
      weaken_list[hostname].weaken.turns=0;
      weaken_list[hostname].weaken.time=0;
    }
  }
  //ns.print(Object.keys(weaken_list).length, " to Weaken");
  return weaken_list;
}