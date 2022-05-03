/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	
	try {
		ns.brutessh(target);
		ns.ftpcrack(target);
		ns.sqlinject(target);
	} catch { }

	try {
		ns.nuke(target);
	} catch { }

	
}