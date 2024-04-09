/*
 * tower.js
 * Static defense for the room
 * !st priority: attack hostiles
 * 2nd priority: heal damaged creeps
 * 3rd priority: repair structures
 */

module.exports = {
	cycle: function (tower) {
		let hostiles = tower.room.find(FIND_HOSTILE_CREEPS)
		if (hostiles.length > 0) {
			let target = tower.pos.findClosestByRange(hostiles)
			tower.attack(target)
			return
		}

		let creeps = tower.room.find(FIND_MY_CREEPS, {
			filter: (c) => c.hits < c.hitsMax,
		})
		if (creeps.length > 0) {
			let target = tower.pos.findClosestByRange(creeps)
			tower.heal(target)
			return
		}

		let structures = tower.room.find(FIND_STRUCTURES, {
			filter: (s) => s.hits < s.hitsMax,
		})
		if (structures.length > 0) {
			let target = tower.pos.findClosestByRange(structures)
			tower.repair(target)
		}
	},
}
