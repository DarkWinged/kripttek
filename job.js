var jobs = {
	harvest: require("harvest"),
	upgrade: require("upgrade"),
	build: require("build"),
	maintain: require("maintain"),
	distribute: require("distribute"),
}

module.exports = {
	cycle: function (job) {
		if (job.completed) {
			this.cleanup(job)
			return
		}
		this.remove_expired(job)
		if (job.assigned.length > job.staffing) {
			this.unemploy_excess(job)
		}
		// this.remove_expired(job)
		console.log(
			"Job: " + job.type + " " + job.target,
			job.assigned.length + "/" + job.staffing
		)
		if (job.type in jobs) {
			return jobs[job.type].run(job)
		}
		console.log("Job: type(" + job.type + ") not found")
	},

	remove_vacant: function (job) {
		let dead = 0
		for (let c in job.assigned) {
			let creep = Game.getObjectById(job.assigned[c])
			if (!creep) {
				dead += 1
			}
		}
		if (dead > 0) {
			job.assigned.sort(function (a, b) {
				if (!a && !b) {
					return 0
				} else if (!a) {
					return 1
				} else if (!b) {
					return -1
				} else {
					return 0
				}
			})
			while (dead > 0) {
				job.assigned.pop()
				dead -= 1
			}
			Memory.jobs[job.id].assigned = job.assigned
		}
	},

	remove_expired: function (job) {
		let alive = []
		for (let c in job.assigned) {
			let creep = Game.getObjectById(job.assigned[c])
			if (!creep) {
				continue
			} else {
				alive.push(job.assigned[c])
			}
		}
		Memory.jobs[job.id].assigned = alive
	},

	unemploy_excess: function (job) {
		while (job.assigned.length > job.staffing) {
			let creep = Game.getObjectById(job.assigned[0])
			this.unemploy(job, creep)
		}
	},

	unemploy: function (job, creep) {
		let mem = creep.memory
		mem.role = "unemployed"
		mem.job = null
		mem.target = null
		creep.memory = mem
		job.assigned = job.assigned.filter((c) => c != creep.id)
		Memory.jobs[job.id] = job
	},

	cleanup: function (job) {
		for (let c in job.assigned) {
			let creep = Game.getObjectById(job.assigned[c])
			let mem = creep.memory
			mem.role = "unemployed"
			mem.job = null
			mem.target = null
			creep.memory = mem
		}
		delete Memory.jobs[job.id]
	},
}
