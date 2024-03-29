module.exports = {
    run: function(creep){
        if (creep.store.getUsedCapacity() > 0){
            let deposit = creep.memory.deposit
            if (!deposit){
                deposit = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0}})
            }
            if (!deposit){
                deposit = Object.values(Game.spawns).filter(s => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)[0]
            }
            if (creep.transfer(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(deposit)
            }
            creep.memory.deposit = deposit.id
        } else {
            creep.moveTo(Game.flags['Idle'])
        }
    }
}