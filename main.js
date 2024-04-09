var imports = {
	planner: require("job_planner"),
	spawner: require("spawner"),
	creeper: require("creep"),
	profession: require("job"),
	tower: require("tower"),
}
const USERNAME = "DarkWingedDaemon"

main = function () {
	var debug = Memory.debug
	var cpu_usage = { total: 0 }
	try {
		console.log(
			"<h3>" +
				"-".repeat(10) +
				"=[" +
				Game.time +
				"]=" +
				"-".repeat(10) +
				"</h3>"
		)
		if (!Memory.jobs) {
			Memory.jobs = {}
		}
		for (let i in imports) {
			imports[i].debug = debug
			imports[i].USERNAME = USERNAME
		}
		let turrets = _.filter(
			Game.structures,
			(s) => s.structureType == STRUCTURE_TOWER
		)
		for (let t in turrets) {
			let turret = turrets[t]
			imports.tower.cycle(turret)
		}
		cpu_usage.init = Game.cpu.getUsed()
		cpu_usage.total += cpu_usage.init
		console.log(`Init cpu: ${cpu_usage.init}`)
		let resource_jobs = _.filter(
			Memory.jobs,
			(job) => job.type == "harvest"
		)
		for (let j in resource_jobs) {
			imports.profession.cycle(resource_jobs[j])
		}
		cpu_usage.resource_jobs = Game.cpu.getUsed() - cpu_usage.total
		cpu_usage.total += cpu_usage.resource_jobs
		console.log(
			`<font color="dodgerblue">Resource jobs cpu: ${cpu_usage.resource_jobs}</font>`
		)
		let non_resource_jobs = _.filter(
			Memory.jobs,
			(job) => job.type != "harvest"
		)
		// if all resource jobs are filled, then fill non-resource jobs
		// if (
		// 	non_resource_jobs.every(
		// 		(job) => job.assigned.length >= job.staffing
		// 	)
		// ) {
		// }
		for (let j in non_resource_jobs) {
			imports.profession.cycle(non_resource_jobs[j])
		}
		cpu_usage.non_resource_jobs = Game.cpu.getUsed() - cpu_usage.total
		cpu_usage.total += cpu_usage.non_resource_jobs
		console.log(
			`<font color="dodgerblue">Non-resource jobs cpu: ${cpu_usage.non_resource_jobs}</font>`
		)
		for (let r in Game.rooms) {
			let room = Game.rooms[r]
			console.log(
				"Room: " +
					room.name +
					" - " +
					(room.controller.owner
						? room.controller.owner.username
						: "unowned")
			)
			imports.planner.cycle(room)
		}
		cpu_usage.planner = Game.cpu.getUsed() - cpu_usage.total
		cpu_usage.total += cpu_usage.planner
		console.log(
			`<font color="dodgerblue">Planner cpu: ${cpu_usage.planner}</font>`
		)
		for (let c in Game.creeps) {
			let creep = Game.creeps[c]
			// console.log(creep.memory.role)
			imports.creeper.cycle(creep)
		}
		cpu_usage.creeps = Game.cpu.getUsed() - cpu_usage.total
		cpu_usage.total += cpu_usage.creeps
		console.log(
			`<font color="dodgerblue">Creeps cpu: ${cpu_usage.creeps}</font>`
		)
		for (let s in Game.spawns) {
			let spawn = Game.spawns[s]
			imports.spawner.cycle(spawn)
		}
		cpu_usage.spawns = Game.cpu.getUsed() - cpu_usage.total
		cpu_usage.total += cpu_usage.spawns
		console.log(
			`<font color="dodgerblue">Spawns cpu: ${cpu_usage.spawns}</font>`
		)
		for (let c in Memory.creeps) {
			if (!Game.creeps[c]) {
				delete Memory.creeps[c]
			}
		}
		cpu_usage.cleanup = Game.cpu.getUsed() - cpu_usage.total
		cpu_usage.total += cpu_usage.cleanup
		console.log(
			`<font color="dodgerblue">Cleanup cpu: ${cpu_usage.cleanup}</font>`
		)
	} catch (e) {
		console.log(`<font color="orangered">${e.stack}</font>`)
	} finally {
		if (!Memory.cpu_usage) {
			Memory.cpu_usage = {}
		}

		if (!debug) {
			if (Game.cpu.bucket > 5000) {
				Game.cpu.generatePixel()
			} else {
				console.log(
					"<font color='limegreen'>pixel progress: " +
						Math.round((Game.cpu.bucket / 5000) * 10000) / 100 +
						"%</font>"
				)
			}
		}
		// Memory.cpu_usage[Game.time] = cpu_usage
		console.log(
			`<font color="dodgerblue">Total cpu reported: ${cpu_usage.total}</font>`
		)
		console.log(
			`<font color="dodgerblue">Total cpu used: ${Game.cpu.getUsed()}</font>`
		)
	}
}

module.exports.loop = function () {
	// delete Memory.cpu_usage
	main()
}
