var roles = {
	harvester: require("harvester"),
	upgrader: require("upgrader"),
	builder: require("builder"),
	maintainer: require("maintainer"),
	distributor: require("distributor"),
}
var unemployed = require("unemployed")
module.exports = {
	cycle: function (creep) {
		let mem = creep.memory
		if (!creep || creep.ticksToLive == 1) {
			let job = Memory.jobs[mem.job]
			Memory.jobs[mem.job].assigned = _.without(job.assigned, creep.id)
			delete Memory.creeps[creep.name]
			creep.suicide()
		}
		if (this.debug && mem.role != "unemployed") {
			console.log(
				`Creep: [${creep.name}, ${mem.role}, ${mem.job}, ${mem.ticksToLive}]`
			)
		}
		if (mem.role in roles && mem.job) {
			creep.memory = mem
			let cpu_usage = Game.cpu.getUsed()
			let result = roles[mem.role].run(creep)
			let creep_cpu_usage = Game.cpu.getUsed() - cpu_usage
			console.log(
				`<font color="seegreen">${mem.role} creep cpu usage: ${creep_cpu_usage}</font>`
			)
			return result
		} else if (mem.role != "unemployed") {
			console.log(`Creep: role(${mem.role}) not found`)
		}
		mem.role = "unemployed"
		mem.job = null
		mem.target = null
		creep.memory = mem
		unemployed.run(creep)
	},
}
