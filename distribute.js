module.exports = {
	run: function (job) {
		let storage = Game.getObjectById(job.target)
		console.log(
			`Storage: ${storage.pos} ${
				storage.store[RESOURCE_ENERGY]
			}/${storage.store.getCapacity(RESOURCE_ENERGY)}`
		)

		job.staffing = 2 + Math.floor(storage.store[RESOURCE_ENERGY] / 50000)

		if (!(job.assigned.length < job.staffing)) return
		let creep = _.find(Game.creeps, this.filter_prospects)
		if (!creep) return

		let mem = creep.memory
		mem.job = job.id
		mem.target = job.target
		mem.role = "distributor"
		creep.memory = mem
		job.assigned.push(creep.id)
		Memory.jobs[job.id] = job
	},

	filter_prospects: function (creep) {
		let mem = creep.memory
		return (
			(mem.role == "distributor" || mem.role == "unemployed") &&
			mem.job == null
		)
	},
}
