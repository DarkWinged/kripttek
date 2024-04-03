var roles = {
	harvester: require("harvester"),
	upgrader: require("upgrader"),
	builder: require("builder"),
	maintainer: require("maintainer"),
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
				"Creep: [" +
					creep.name +
					", " +
					mem.role +
					", " +
					mem.job +
					", " +
					creep.ticksToLive +
					"]"
			)
		}
		if (mem.role in roles && mem.job) {
			creep.memory = mem
			return roles[mem.role].run(creep)
		} else if (mem.role != "unemployed") {
			console.log("Creep: role(" + mem.role + ") not found")
		}
		mem.role = "unemployed"
		mem.job = null
		mem.target = null
		creep.memory = mem
		unemployed.run(creep)
	},
}
