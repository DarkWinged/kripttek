const task = require("./task")

module.exports = {
	/*
	 * Run the upgrader
	 * @param {Creep} creep
	 */
	run: function (creep) {
		let mem = creep.memory
		let store = creep.store
		mem.active = task.checkEnergy(store, mem.active, (fill = false))
		if (mem.active) {
			task.act(creep, mem, "upgradeController")
		} else {
			mem = task.interactContainer(creep, mem, false, this.find_deposit)
		}
		creep.memory = mem
		creep.say(
			`⚡${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`
		)
	},

	/*
	 * Filter for finding a deposit
	 * @param {creep} creep
	 * @returns
	 */
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
