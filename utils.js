module.exports = {
	find_nearest_spawn: function (pos) {
		return pos.findClosestByPath(FIND_MY_SPAWNS)
	},

	find_nearest_building: function (pos, filter) {
		return pos.findClosestByRange(FIND_MY_STRUCTURES, filter)
	},

	parts: {
		move: 50,
		work: 100,
		attack: 80,
		carry: 50,
		heal: 250,
		ranged_attack: 150,
		tough: 10,
		claim: 600,
	},

	cost: function (parts) {
		let cost = 0
		for (let p in parts) {
			cost += BODYPART_COST[parts[p]]
		}
		return cost
	},

	fatigue: function (parts, terrain) {
		let multiplier = { road: 1, plain: 2, swamp: 10 }[terrain]
		let generation = 0
		let reduction = 0
		for (let p in parts) {
			let part = parts[p]
			if (part != "move") {
				generation += multiplier
			} else {
				reduction += 2
			}
		}
		return Math.max(generation - reduction, 0)
	},

	reset_jobs: function () {
		Memory.jobs = {}
		for (let r in Game.rooms) {
			let room = Game.rooms[r]
			room.memory.jobs = null
		}
		for (let c in Game.creeps) {
			let creep = Game.creeps[c]
			let mem = creep.memory
			mem.job = null
			mem.target = null
			mem.target_pos = null
			mem.role = "unemployed"
			creep.memory = mem
		}
		console.log("Reset all jobs")
	},

	unemploy_all: function () {
		for (let c in Game.creeps) {
			let creep = Game.creeps[c]
			let mem = creep.memory
			mem.job = null
			mem.target = null
			mem.target_pos = null
			mem.role = "unemployed"
			creep.memory = mem
		}
		for (let j in Memory.jobs) {
			let job = Memory.jobs[j]
			job.assigned = []
			Memory.jobs[j] = job
		}
		console.log("Unemployed all creeps")
	},

	find_next_room: function (current, target) {
		let route = Game.map.findRoute(current, target)
		if (route.length > 0) {
			return route[0].room
		} else {
			return target
		}
	},
}
