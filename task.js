// task.js

module.exports = {
	move: function (creep, target, target_pos) {
		if (!target || creep.room.name !== target_pos.roomName) {
			creep.moveTo(
				new RoomPosition(
					target_pos.x,
					target_pos.y,
					target_pos.roomName
				)
			)
		} else {
			creep.moveTo(target)
		}
	},

	checkEnergy: function (store, active, fill = true) {
		if (fill) {
			if (store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
				return false
			} else if (store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
				return true
			} else {
				return active
			}
		} else {
			if (store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
				return true
			} else if (store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
				return false
			} else {
				return active
			}
		}
	},

	interactContainer: function (
		creep,
		mem,
		give,
		find,
		mem_key = "container"
	) {
		if (creep.room.name !== mem.spawnRoom) {
			creep.moveTo(Game.flags["Harvester"])
			return mem
		}

		let container = Game.getObjectById(mem[mem_key])

		if (
			!container ||
			(give && container.store.getFreeCapacity(RESOURCE_ENERGY) == 0) ||
			(!give && container.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
		) {
			container = find(creep)
			if (!container) {
				creep.moveTo(Game.flags["Harvester"])
				return mem
			}
			mem[mem_key] = container.id
		}

		if (give) {
			if (
				creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
			) {
				creep.moveTo(container)
			}
		} else if (!give) {
			if (
				creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
			) {
				creep.moveTo(container)
			}
		}

		return mem
	},

	act: function (creep, mem, callback) {
		let target = Game.getObjectById(mem.target)
		if (!target || creep[callback](target) == ERR_NOT_IN_RANGE) {
			this.move(creep, target, mem.target_pos)
		}
	},
}
