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

	reset_jobs_of_type: function (type) {
		for (let j in Memory.jobs) {
			let job = Memory.jobs[j]
			if (job.type == type) {
				for (let c in job.assigned) {
					let creep = Game.getObjectById(job.assigned[c])
					let mem = creep.memory
					mem.job = null
					mem.target = null
					mem.target_pos = null
					mem.role = "unemployed"
					creep.memory = mem
				}
				delete Memory.jobs[j]
			}
		}

		console.log(`Reset all ${type} jobs`)
	},

	unemploy_all: function () {
		for (let c in Game.creeps) {
			let creep = Game.creeps[c]
			let mem = creep.memory
			mem.job = null
			mem.target = null
			mem.target_pos = null
			mem.container = null
			mem.container_pos = null
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

	graph_cpu_usage: function (
		time_scale,
		graph_length,
		graph_height,
		graph_width,
		view_pos,
		filter = {}
	) {
		let current_time = Game.time
		usage_report = Memory.cpu_usage
		if (!usage_report) {
			return null
		}
		data = this.aggirage_report_data(
			usage_report,
			time_scale,
			current_time,
			graph_length,
			filter
		)
		for (let bar in data) {
			this.graph_bar(
				new RoomPosition(
					view_pos.x + bar * graph_width,
					view_pos.x,
					view_pos.roomName
				),
				graph_height,
				graph_width,
				data[bar]
			)
		}
	},

	aggirage_report_data: function (
		data,
		batch_size,
		start,
		max_batches,
		filter
	) {
		let aggirated_report = []
		let batch = []
		while (aggirated_report.length() < max_batches) {
			for (
				let segment = start + batch_size * aggirated_report.length();
				segment < batch_size;
				segment--
			) {
				if (data[segment]) {
					batch.push(data[segment])
				} else {
					break
				}
			}
			let average = {}
			for (let segment in batch) {
				for (let key in Object.values(filter)) {
					if (key == "total") continue
					if (!batch[segment][key]) {
						average[key] = 0
					}
					average[key] += segment[key]
				}
			}
			for (let key in average) {
				average[key] = average[key] / batch.length
			}
			let total = 0
			for (let value in average) {
				total += value
			}
			average["total"] = total
			aggirated_report.push(average)
			batch = []
		}
	},

	graph_bar: function (view_pos, heigth, width, data) {
		let total = data["total"]
		let ratio = heigth / total
		let pos = view_pos
		let heigth_offset = 0
		for (let key in data) {
			if (key == "total") continue
			let bar = key * ratio

			Game.map.visual.rect(
				new RoomPosition(pos.x, pos.y, pos.roomName),
				width,
				heigth,
				{
					fill: bar,
					opacity: 0.5,
				}
			)
		}
	},
}
// require("utils").unemploy_all()
// require("utils").reset_jobs_of_type("maintain")
