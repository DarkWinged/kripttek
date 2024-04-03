module.exports = {
	run: function (job) {
		let site = Game.getObjectById(job.target)
		if (!site || site.hits == site.hitsMax) {
			return (Memory.jobs[job.id].completed = true)
		}
		console.log(
			`Site: ${site.pos} ${(site.hits / site.hitsMax) * 100}% progress`
		)

		if (job.assigned.length >= job.staffing) return false
		let creep = _.find(Game.creeps, this.filter_prospects)
		if (!creep) return false

		let mem = creep.memory
		mem.job = job.id
		mem.target = job.target
		mem.target_pos = site.pos
		mem.role = "maintainer"
		creep.memory = mem
		job.assigned.push(creep.id)
		Memory.jobs[job.id] = job
	},

	filter_prospects: function (creep) {
		let mem = creep.memory
		return (
			(mem.role == "maintainer" || mem.role == "unemployed") &&
			mem.job == null
		)
	},
}
