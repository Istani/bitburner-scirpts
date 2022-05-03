function getLowestLevelNode(ns) {
	let retrunValue=0;
	let numNodes=ns.hacknet.numNodes();
	for (let i = 0; i<numNodes;i++) {
		if (ns.hacknet.getNodeStats(retrunValue).level>=ns.hacknet.getNodeStats(i).level) {
			retrunValue=i;
		}
	}
	return retrunValue;
}
function getLowestRamNode(ns) {
	let retrunValue=0;
	let numNodes=ns.hacknet.numNodes();
	for (let i = 0; i<numNodes;i++) {
		if (ns.hacknet.getNodeStats(retrunValue).ram>=ns.hacknet.getNodeStats(i).ram) {
			retrunValue=i;
		}
	}
	return retrunValue;
}
function getLowestCoresNode(ns) {
	let retrunValue=0;
	let numNodes=ns.hacknet.numNodes();
	for (let i = 0; i<numNodes;i++) {
		if (ns.hacknet.getNodeStats(retrunValue).cores>=ns.hacknet.getNodeStats(i).cores) {
			retrunValue=i;
		}
	}
	return retrunValue;
}
function getLowestCacheNode(ns) {
	let retrunValue=0;
	let numNodes=ns.hacknet.numNodes();
	for (let i = 0; i<numNodes;i++) {
		if (ns.hacknet.getNodeStats(retrunValue).cache>=ns.hacknet.getNodeStats(i).cache) {
			retrunValue=i;
		}
	}
	return retrunValue;
}

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	//ns.tail();
	let numNodes=ns.hacknet.numNodes();
	while (numNodes<9) {
		ns.hacknet.purchaseNode();
		numNodes=ns.hacknet.numNodes();
		await ns.sleep(10);
	}
	
	while (true) {
		await ns.sleep(10);
		if (ns.hacknet.upgradeLevel(getLowestLevelNode(ns),1)) {
			ns.print("Buy Hacknet Level Upgrade");
			continue;
		}
		if (ns.hacknet.upgradeRam(getLowestRamNode(ns),1)) {
			ns.print("Buy Hacknet Ram Upgrade");
			continue;
		}
		if (ns.hacknet.upgradeCore(getLowestCoresNode(ns),1)) {
			ns.print("Buy Hacknet Core Upgrade");
			continue;
		}
		if (ns.hacknet.upgradeCache(getLowestCacheNode(ns),1)) {
			ns.print("Buy Hacknet Cache Upgrade");
			continue;
		}
		ns.hacknet.purchaseNode();
	}
	ns.tprint(numNodes);
}