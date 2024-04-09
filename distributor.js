var task = require("task")
module.exports = {
	run: function (creep) {
		let mem = creep.memory
		mem.active = task.checkEnergy(creep.store, mem.active, (fill = false))
		if (mem.active) {
			mem = task.interactContainer(creep, mem, true, this.find_deposit)
		} else {
			mem = task.interactContainer(
				creep,
				mem,
				false,
				this.find_store,
				(mem_key = "target")
			)
		}
		creep.memory = mem
		creep.say(
			`🚚${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`
		)
	},

	find_deposit: function (creep) {
		return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return (
					(structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN ||
						structure.structureType == STRUCTURE_TOWER ||
						structure.structureType == STRUCTURE_CONTAINER) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
				)
			},
		})
	},

	find_store: function (creep) {
		return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return (
					structure.structureType == STRUCTURE_STORAGE &&
					structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
				)
			},
		})
	},
}
