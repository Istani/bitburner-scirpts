/** @param {NS} ns */
export async function main(ns) {
	await ns.sleep(100);
	ns.exec("db.server.js","home");

	await ns.sleep(1000);
	ns.exec("home.net.js","home");
	await ns.sleep(1000);
	ns.exec("home.purchase.js","home");
	await ns.sleep(1000);
	ns.exec("home.hack.js","home");
	await ns.sleep(100);
	ns.tprint("Init done!");
}