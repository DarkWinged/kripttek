var unemployed = {
    run: function(creep){
        if (creep.store.getUsedCapacity() > 0){
            let deposit = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0}})
            if (creep.transfer(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(deposit)
            }
        } else {
            creep.moveTo(Game.flags['Idle'])
        }
    }
}

module.exports = unemployed