var find_nearest_building = require('utils').find_nearest_building

var builder = {
    run: function(creep){
        creep.say(`🔨${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`)
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            var container = find_nearest_building(creep.pos, {filter: this.filter_container})
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(container)
            }
        } else {
            var target = find_nearest_building(creep.pos, {filter: this.filter_target})
            if (creep.build(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target)
            }
        }
    },

    filter_container: function(structure){
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    }

}

module.exports = builder;