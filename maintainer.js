var task = require("task")
module.exports = {
	run: function (creep) {
		let mem = creep.memory
		mem.active = task.checkEnergy(creep.store, mem.active, (fill = false))
		if (mem.active) {
			task.act(creep, mem, "repair")
		} else {
			mem = task.interactContainer(creep, mem, false, this.find_deposit)
		}
		creep.memory = mem
		creep.say(
			`🔧${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`
		)
	},

	find_deposit: function (creep) {
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
