var {find_next_room, find_nearest_building} = require('utils')
module.exports = {
    run: function(creep){
        let mem = creep.memory
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            mem.active = false
        } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            mem.active = true
        }
        mem = this.repair(creep, mem)
        creep.memory = mem
        creep.say(`🔧${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`)
    },

    repair: function(creep, mem){
        if (mem.active){
            let target = Game.getObjectById(mem.target)
            if (creep.repair(target) == ERR_NOT_IN_RANGE){
                if (creep.room.name != mem.target_pos.roomName){
                    let next = find_next_room(creep.room.name, mem.target_pos.roomName)
                    let exit = creep.room.findExitTo(Game.rooms[next])
                    creep.moveTo(creep.pos.findClosestByPath(exit))
                } else {
                    creep.moveTo(mem.target_pos.x, mem.target_pos.y)
                }
            } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                mem.active = false
                mem = this.repair(creep, mem)
            }
            return mem
        } else {
            let deposit = Game.getObjectById(mem.deposit)
            if (!deposit || deposit.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                deposit = find_nearest_building(creep.pos, {filter: this.filter_deposit})
                if (!deposit){
                    let spawn = Object.values(Game.spawns)[0]
                    creep.moveTo(spawn)
                    return mem
                }
                mem.deposit = deposit.id
            }
            if (creep.withdraw(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(deposit)
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                mem.active = true
                mem = this.repair(creep, mem)
            }
            return mem
        }
    },

    filter_deposit: function(structure){
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    }
}