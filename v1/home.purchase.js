async function getPurchaseServer(ns) {
	var owned=[];
	var servers = JSON.parse(ns.peek(1));

	for (const [key, target] of Object.entries(servers)) {
		if (target.id=="home") continue;
		if (target.data.purchasedByPlayer==false) continue;
		owned.push(target);
	}

	await ns.sleep(10);
	return owned;
}

async function getLowestServer(ns) {
	var servers = JSON.parse(ns.peek(1));
	var res=null;

	for (const [key, target] of Object.entries(servers)) {
		if (target.id=="home") continue;
		if (target.data.purchasedByPlayer==false) continue;

		if (res==null) {
			res=target;
		}
		if (res.data.maxRam>target.data.maxRam) {
			res=target;
		}
	}

	await ns.sleep(10);
	return res;
}

const servername="-F.U.C.K.U.P-";

/** @param {NS} ns */
export async function main(ns) {
	ns.clearLog();
	ns.disableLog('ALL');
	var str = "Start Purchase Server";
	ns.print(str);
	ns.tprint(str);

	const maxRam=ns.getPurchasedServerMaxRam();
	const maxServer=ns.getPurchasedServerLimit();
	var buyRam=2;

	while(true) {
		var owned=await getPurchaseServer(ns);
		var myMoney=Math.floor(ns.getPlayer().money);
		var cost=ns.getPurchasedServerCost(buyRam);

		if (myMoney<cost) {
			await ns.asleep(1000);
			continue;
		} else if (owned.length<maxServer) {
			str = "Buy Server";
			ns.print(str);
			ns.tprint(str);
			ns.purchaseServer(servername + owned.length, buyRam);
		} else {					
			var tmp = await getLowestServer(ns);
			ns.print(tmp.id);
			if (tmp.data.maxRam<maxRam) {
				buyRam=buyRam*2;
				if (buyRam>maxRam) buyRam=maxRam;
				cost=ns.getPurchasedServerCost(buyRam);
				if (myMoney>cost) {
					ns.killall(tmp.id);
					if (ns.deleteServer(tmp.id)) {
						await ns.asleep(10);
						ns.purchaseServer(tmp.id,buyRam);
						str = "Update Server "+tmp.id;
						ns.print(str);
						ns.tprint(str);
					} else {
						ns.print("Could not delte Server ",tmp.id);
					}
				}
			} else {
				str = "Max Server ";
				ns.print(str);
				ns.tprint(str);
				ns.exit();
			}
		}

		await ns.asleep(30000);
	}
}