var find_nearest_building = require('utils').find_nearest_building
var harvester = {
    run: function(creep) {
        creep.say(`⛏️${creep.store.getCapacity() - creep.store.getFreeCapacity()}/${creep.store.getCapacity()}`)
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.active = true
        } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.active = false
        }
        this.harvset_target(creep)
    },

    harvset_target: function(creep) {
        if (creep.memory.active) {
            let source = Game.getObjectById(creep.memory.target)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source)
            } 
        } else {            
            let deposit = Game.getObjectById(creep.memory.deposit)
            if (!deposit || deposit.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                deposit = find_nearest_building(creep.pos, {filter: this.filter_deposit})
                creep.memory.deposit = deposit.id
            }
            if (creep.transfer(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(deposit)
            }
        }
    },

    filter_deposit: function(structure) {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    }
}

module.exports = harvester