import * as Slaves from '2_open.js';
import * as Targets from '6_hack.js';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  var Worker_List = await Slaves.main(ns);
  for (var worker of Object.keys(Worker_List)) {
    ns.killall(worker);
    await ns.scp(["bin.weak.js", "bin.grow.js", "bin.hack.js"], "home", worker);
  }
  while (true) {
    var Worker_List = await Slaves.main(ns);
    var Target_List = await Targets.main(ns);
    ns.print(Object.keys(Target_List).length, ' Targets for ', Object.keys(Worker_List).length, ' Workers.');

    // Prepare Worker
    var max_time=1;
    for (var worker of Object.keys(Worker_List)) {
      for (var target of Object.keys(Target_List)) {
        var script="";
        var planed=0;

        if (Target_List[target].hack.turns>0) {
          script="bin.hack.js";
          planed=Target_List[target].hack.turns;
        }
        if (Target_List[target].grow.turns>0) {
          script="";
        }
        if (Target_List[target].weaken.turns>0) {
          script="";
        }
        if (script=="") continue;
        
        var freeRam=ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        var needRam=ns.getScriptRam(script);
        var turns=0;
        
        if (freeRam<needRam) break;
        turns=Math.floor(freeRam/needRam);
        if (turns>planed) turns=planed;

        ns.exec(script, worker, turns, target);
        switch (script) {
          case 'bin.hack.js':
            Target_List[target].hack.turns-turns;
            break;
          case 'bin.grow.js':
            Target_List[target].grow.turns-turns;
            break;
          case 'bin.weak.js':
            Target_List[target].weaken.turns-turns;
            break;
        }
        ns.print(worker,": \t",turns," x \t",script,"\t",target);
        await ns.sleep(10);
      }
      for (var target of Object.keys(Target_List)) {
        var script="";
        var planed=0;

        if (Target_List[target].hack.turns>0) {
          script="";
          planed=Target_List[target].hack.turns;
        }
        if (Target_List[target].grow.turns>0) {
          script="bin.grow.js";
          planed=Target_List[target].grow.turns;
        }
        if (Target_List[target].weaken.turns>0) {
          script="";
          planed=Target_List[target].weaken.turns;
        }
        if (script=="") continue;
        
        var freeRam=ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        var needRam=ns.getScriptRam(script);
        var turns=0;
        
        if (freeRam<needRam) break;
        turns=Math.floor(freeRam/needRam);
        if (turns>planed) turns=planed;

        ns.exec(script, worker, turns, target);
        switch (script) {
          case 'bin.hack.js':
            Target_List[target].hack.turns-turns;
            break;
          case 'bin.grow.js':
            Target_List[target].grow.turns-turns;
            break;
          case 'bin.weak.js':
            Target_List[target].weaken.turns-turns;
            break;
        }
        ns.print(worker,": \t",turns," x \t",script,"\t",target);
        await ns.sleep(10);
      }
      for (var target of Object.keys(Target_List)) {
        var script="";
        var planed=0;

        if (Target_List[target].hack.turns>0) {
          script="";
          planed=Target_List[target].hack.turns;
        }
        if (Target_List[target].grow.turns>0) {
          script="";
          planed=Target_List[target].grow.turns;
        }
        if (Target_List[target].weaken.turns>0) {
          script="bin.weak.js";
          planed=Target_List[target].weaken.turns;
        }
        if (script=="") continue;
        
        var freeRam=ns.getServerMaxRam(worker)-ns.getServerUsedRam(worker);
        var needRam=ns.getScriptRam(script);
        var turns=0;
        
        if (freeRam<needRam) break;
        turns=Math.floor(freeRam/needRam);
        if (turns>planed) turns=planed;

        ns.exec(script, worker, turns, target);
        switch (script) {
          case 'bin.hack.js':
            Target_List[target].hack.turns-turns;
            break;
          case 'bin.grow.js':
            Target_List[target].grow.turns-turns;
            break;
          case 'bin.weak.js':
            Target_List[target].weaken.turns-turns;
            break;
        }
        ns.print(worker,": \t",turns," x \t",script,"\t",target);
        await ns.sleep(10);
      }
      await ns.sleep(100);
    }
    await ns.sleep(1000*5);
  }
}