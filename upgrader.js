var find_nearest_building = require('utils').find_nearest_building

module.exports = {
    run: function(creep) {
        let mem = creep.memory
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            mem.active = true
        } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            mem.active = false
        }
        mem = this.upgrade_controller(creep, mem)
        creep.memory = mem
        creep.say(`⚡${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`)
    },

    upgrade_controller: function(creep, mem) {
        if (mem.active) {
            let controller = creep.room.controller
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller)
            } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                mem.active = false
                return this.upgrade_controller(creep, mem)
            }
            return mem
        } else {
            let deposit = Game.getObjectById(mem.deposit)
            if (!deposit || deposit.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                deposit = find_nearest_building(creep.pos, {filter: this.filter_deposit})
                if (!deposit) {
                    deposit = Object.values(Game.spawns).filter(s => s.store.getUsedCapacity(RESOURCE_ENERGY) > 0)[0]
                    if (!deposit) {
                        if (this.debug) {
                            console.log("No deposit found")
                        }
                        return mem
                    }
                }
                mem.deposit = deposit.id
            }
            if (creep.withdraw(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(deposit)
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                mem.active = true
                return this.upgrade_controller(creep, mem)
            }
            return mem
        }
    },

    filter_deposit: function(structure) {
        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    }
}