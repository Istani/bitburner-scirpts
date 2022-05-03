var server_list = {};

function mostMoneyTarget(ns, targets) {
	let most = 0;//
	let mvp = "";
	for (const [key, target] of Object.entries(targets)) {
		var output = {
			name: target.id
		}
		output.ms = target.hms;
		//ns.print(output);
		if (output.ms > most) {
			most = output.ms;
			mvp = target;
		}
	}
	return mvp;
}
function getTarget(ns, servers, target) {
	var targets = [];
	for (const [key, server] of Object.entries(servers)) {
		if (server.isTarget) {
			targets.push(server);
		}
	};
	//ns.print(targets);

	if (targets.includes(target)) {
		return target;
	}

	return mostMoneyTarget(ns, targets);
}

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL");
	ns.clearLog();
	var str = "Start Hacking";
	ns.print(str);
	ns.tprint(str);
	//ns.tail();
	server_list = JSON.parse(ns.peek(1));
	for (const [key, server] of Object.entries(server_list)) {
		await ns.scp(["bin.weak.js", "bin.grow.js", "bin.hack.js"], "home", server.id);
		await ns.sleep(10);
	};

	while (true) {
		server_list = {};
		server_list = JSON.parse(ns.peek(1));
		for (const [key, server] of Object.entries(server_list)) {
			if (server.data.hasAdminRights == false) {
				ns.run('home.open.js', 1, server.id);
			} else {
				try {
					//ns.installBackdoor(server.id);
				} catch { };

				let target = getTarget(ns, server_list, server.id);
				let script = "";
				//ns.print(target.data.hackDifficulty, " > ",target.data.minDifficulty)
				//ns.print(target.data.moneyAvailable, " < ", target.data.moneyMax);

				if (target.data.hackDifficulty-1 > target.data.minDifficulty) {
					script = "bin.weak.js";
				} else if (target.data.moneyAvailable+1 < target.data.moneyMax) {
					script = "bin.grow.js";
				} else {
					script = "bin.hack.js";
				}
				let scriptRam = ns.getScriptRam(script);
				let maxThread = Math.floor(server.ramFree / scriptRam);
				/*if (server == "home") {
					maxThread -= 5;
					continue;
				}*/
				if (maxThread >= 1) {
					ns.exec(script, server.id, maxThread, target.id);
					ns.print(server.id, " attacking ", target.id, " with ", maxThread, " x ", script);
				}
			}
			await ns.sleep(500);
		};
		await ns.sleep(1000);
	}
}