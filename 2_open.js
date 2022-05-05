import * as Scan from '1_scan.js';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  var scan_list = await Scan.main(ns);
  var open_list = {};
  for (var hostname of Object.keys(scan_list)) {
    if (ns.hasRootAccess(hostname)) continue;
    try {
      ns.brutessh(hostname);
      ns.ftpcrack(hostname);
      ns.relaysmtp(hostname);
      ns.httpworm(hostname);
      ns.sqlinject(hostname);
    } catch {}

    try {
      ns.nuke(hostname);
    } catch {}
  }
  for (var hostname of Object.keys(scan_list)) {
    if (!ns.hasRootAccess(hostname)) continue;
    if (hostname=="home") continue;
    open_list[hostname]=scan_list[hostname];
  }
  //ns.print(Object.keys(open_list).length, " Open");
  return open_list;
}