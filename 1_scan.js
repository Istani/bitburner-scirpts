function deepScan(ns, target="home", list={}) {
  if (typeof list[target] == "undefined") list[target]={}
  list[target].id=target;
  var neightboors=ns.scan(target);
  for (var node of neightboors) {
    if (typeof list[node] == "undefined") deepScan(ns, node, list);
  }
  return list;
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  var list_of_server = deepScan(ns);
  //ns.print(Object.keys(list_of_server).length, " Server");
  return list_of_server;
}