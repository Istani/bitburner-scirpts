var servers = {};

class Server {
	constructor(ns, hostname, parent="") {
		this.ns=ns;
		this.id=hostname;
		this.parent=parent;	

		this.updateData();
	}

	updateData() {
		if (typeof this.id == "undefined") return;
		//console.log(this.id);
		this.data=this.ns.getServer(this.id);

		let scanresp=this.ns.scan(this.id);
		scanresp.forEach(async (child) => {
			if ((child != this.parent) && (!(child in servers))) {
				servers[child]=new Server(this.ns, child, this.id);	
				
			}
		});
		this.neightboors=scanresp;

		this.isTarget=true;
		if (this.data.purchasedByPlayer) this.isTarget=false;
		if (this.data.hasAdminRights != true) this.isTarget=false;
		if (this.data.hackDifficulty > this.ns.getHackingLevel()) this.isTarget=false;
		if (this.data.moneyMax == 0) this.isTarget=false;

		this.ramFree = this.data.maxRam - this.data.ramUsed;
		if (this.id=="home") this.ramFree-=20;
		this.hackTimer = this.ns.getHackTime(this.id);
		this.hms = (this.data.moneyMax / this.hackTimer) / this.data.serverGrowth;
	}

}


/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	var str = "Start ServerDB";
	ns.tail();
	ns.print(str);
	ns.tprint(str);
	
	await ns.sleep(1);
	while(true) {
		servers = {};
		servers["home"]=new Server(ns, "home");
		servers["home"].neightboors;
		
		
		try {
		for (const [key, value] of Object.entries(servers)) {
			servers[key].updateData();
			await ns.sleep(1);
		}
		ns.clearLog();
		ns.print(JSON.stringify(servers["foodnstuff"],null,2));
		ns.print(new Date());
		
		ns.clear(1);
		await ns.writePort(1,JSON.stringify(servers,null,2),"W");
		} catch { }
		await ns.sleep(10);
	}
	
}