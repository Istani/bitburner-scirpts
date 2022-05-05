import * as Scan from '2_open.js';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  var scan_list = await Scan.main(ns);
  var money_list = {};
  for (var hostname of Object.keys(scan_list)) {
    if (!ns.hasRootAccess(hostname)) continue;
    if (ns.getHackingLevel()<ns.getServerRequiredHackingLevel(hostname)) continue;
    var money=ns.getServerMaxMoney(hostname);
    if (money>0) {
      money_list[hostname]=scan_list[hostname];
      money_list[hostname].maxMoney=money;
      money_list[hostname].currentMoney=ns.getServerMoneyAvailable(hostname);
    }
  }
  //ns.print(Object.keys(money_list).length, " Targets");
  return money_list;
}