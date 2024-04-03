module.exports = {
	run: function (job) {
		let controller = Game.getObjectById(job.target)
		console.log(
			`Controller: ${controller.pos} lvl-${controller.level} ${
				(controller.progress / controller.progressTotal) * 100
			}% progress`
		)

		if (!(job.assigned.length < job.staffing)) return
		let creep = _.find(Game.creeps, this.filter_prospects)
		if (!creep) return

		let mem = creep.memory
		mem.job = job.id
		mem.target = job.target
		mem.role = "upgrader"
		creep.memory = mem
		job.assigned.push(creep.id)
		Memory.jobs[job.id] = job
	},

	filter_prospects: function (creep) {
		let mem = creep.memory
		return (
			(mem.role == "upgrader" || mem.role == "unemployed") &&
			mem.job == null
		)
	},
}
