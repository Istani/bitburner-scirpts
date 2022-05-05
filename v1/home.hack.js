import * as ServerClass from './class.server.js';
var server_list = {};

function mostMoneyTarget(ns, targets) {
	let most = 0;//
	let mvp = "";
	for (const [key, target] of Object.entries(targets)) {
		if (target.hacks.max_money_second > most) {
			most = target.hacks.max_money_second;
			mvp = target;
		}
	}
  /*
	for (const [key, target] of Object.entries(targets)) {
		if (target.hacks.time < most) {
			most = target.hacks.time;
      mvp = target;
		}
	}
	*/
	return mvp;
}
function getTarget(ns, servers, target) {
	var targets = [];
	for (const [key, server] of Object.entries(servers)) {
		if (
			(server.working.gt>=server.max_thread.gt) &&
			(server.working.wt>=server.max_thread.wt) &&
			(server.working.ht>=server.max_thread.ht)
		) {
			// Dies ist kein Ziel Aktuell?
		} else if (server.isTarget) {
			targets.push(server);
		}
		//await ns.sleep(1);
	};
	var cntTargets=0;
	for (const [key, server] of Object.entries(targets)) {
		cntTargets++;
	}
	if (cntTargets==0) {
		for (const [key, server] of Object.entries(servers)) {
			server.reset_th();
			//await ns.sleep(1);
		}
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
	server_list = await ServerClass.main(ns);
	for (const [key, server] of Object.entries(server_list)) {
		await ns.scp(["bin.weak.js", "bin.grow.js", "bin.hack.js"], "home", server.id);
		await ns.sleep(10);
	};

	//while (true) {	
		server_list = {};
		server_list = await ServerClass.main(ns);
		for (const [key, server] of Object.entries(server_list)) {
      server_list[server.id]._neightboors() // Update if new Server?

			if (server.root.root == false) {
				ns.run('home.open.js', 1, server.id);
        await ns.sleep(100);
			} 
      if (server.root.root == true) {
				try {
					//ns.installBackdoor(server.id);
				} catch { };

        let script = "";
        let scriptRam =0;
        let maxThread =1;
				let target = getTarget(ns, server_list, server.id);
        while(maxThread>0) {
          maxThread =0;

					if (server.ram.free<2) {
						await ns.sleep(1);
						continue;
					}
        
          target = getTarget(ns, server_list, server.id);
					if (typeof server_list[target.id]=="undefined") {
						await ns.sleep(1);
						continue;
					}
          if (server_list[target.id].max_thread.wt > server_list[target.id].working.wt) {
            script = "bin.weak.js";
            scriptRam = ns.getScriptRam(script);
            maxThread = Math.floor(server.ram.free / scriptRam);
            if (maxThread>(server_list[target.id].max_thread.wt-server_list[target.id].working.wt)) {
              maxThread=(server_list[target.id].max_thread.wt-server_list[target.id].working.wt)
            }
            server_list[target.id].working.wt+=maxThread;
						if (server_list[target.id].working.wt<0) server_list[target.id].working.wt=0;
          } else if (server_list[target.id].max_thread.gt > server_list[target.id].working.gt) {
            script = "bin.grow.js";
            scriptRam = ns.getScriptRam(script);
            maxThread = Math.floor(server.ram.free / scriptRam);
            if (maxThread>(server_list[target.id].max_thread.gt-server_list[target.id].working.gt)) {
              maxThread=(server_list[target.id].max_thread.gt-server_list[target.id].working.gt)
            }
            server_list[target.id].working.gt+=maxThread;
						if (server_list[target.id].working.gt<0) server_list[target.id].working.gt=0;
          } else {
            script = "bin.hack.js";
            scriptRam = ns.getScriptRam(script);
            maxThread = Math.floor(server.ram.free / scriptRam);
            if (maxThread>(server_list[target.id].max_thread.ht-server_list[target.id].working.ht)) {
              maxThread=(server_list[target.id].max_thread.ht-server_list[target.id].working.ht)
            }
            server_list[target.id].working.ht+=maxThread;
						if (server_list[target.id].working.ht<0) server_list[target.id].working.ht=0;
          }
          if (maxThread >= 1) {
            ns.exec(script, server.id, maxThread, target.id);
            //ns.print(server.id, " attacking ", target.id, " with ", maxThread, " x ", script);
          }
					await ns.sleep(100);
        }
			ns.print(server.id);
			if (typeof target.disableWork != "undefined") {
        		target.displayWork();
			}
				await ns.sleep(100);
			}
			await ns.sleep(100);
		};
		await ns.sleep(100);
	//}
}