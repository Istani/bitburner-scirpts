/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	
	try {
		ns.brutessh(target);
		ns.ftpcrack(target);
	} catch { }

	try {
		ns.nuke(target);
	} catch { }

	
}