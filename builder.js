// builder.js
var task = require("task")

module.exports = {
	/*
	 * Run the builder
	 * @param {Creep} creep
	 */
	run: function (creep) {
		let mem = creep.memory
		mem.active = task.checkEnergy(creep.store, mem.active, (fill = false))
		if (mem.active) {
			task.act(creep, mem, "build")
		} else {
			mem = task.interactContainer(creep, mem, false, this.findContainer)
		}
		creep.memory = mem
		creep.say(
			`🔨${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`
		)
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
						structure.structureType == STRUCTURE_STORAGE ||
						structure.structureType == STRUCTURE_CONTAINER) &&
					structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
				)
			},
		})
	},
}
