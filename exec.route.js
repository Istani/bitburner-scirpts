var servers = {};

/** @param {NS} ns */
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    let route = [];
    let server = args._[0];

	servers = JSON.parse(ns.peek(1));
    var currentNode=servers[server];
    var output="backdoor;";
    while (currentNode.parent!="") {
        output="connect "+currentNode.id+"; "+output;
        currentNode=servers[currentNode.parent];
    }
    ns.tprint(output);
}