var find_nearest_building = require('utils').find_nearest_building

var upgrader = {
    run: function(creep) {
        creep.say(`⚡${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`)
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.active = true
        } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.active = false
        }
        this.upgrade_controller(creep)
    },

    upgrade_controller: function(creep) {
        if (creep.memory.active) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller)
            }
        } else {
            let deposit = Game.getObjectById(creep.memory.deposit)
            if (!deposit || deposit.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                deposit = find_nearest_building(creep.pos, {filter: this.filter_deposit})
                creep.memory.deposit = deposit.id
            }
            if (creep.withdraw(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(deposit)
            }
        }
    },

    filter_deposit: function(structure) {
        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    }
}

module.exports = upgrader