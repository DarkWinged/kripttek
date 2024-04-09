// harvester.js
var task = require("task")

module.exports = {
	/*
	 * Run the harvester
	 * @param {Creep} creep
	 */
	run: function (creep) {
		let mem = creep.memory
		mem.active = task.checkEnergy(creep.store, mem.active)
		if (mem.active) {
			task.act(creep, mem, "harvest")
		} else {
			mem = task.interactContainer(creep, mem, true, this.findContainer)
		}
		creep.say(
			`⛏️${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`
		)
		creep.memory = mem
	},

	/**
	 * Find the nearest container that is not full
	 * @param {Creep} creep
	 * @return {Structure} container
	 */
	findContainer: function (creep) {
		return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return (
					(structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN ||
						structure.structureType == STRUCTURE_STORAGE) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
				)
			},
		})
	},
}
