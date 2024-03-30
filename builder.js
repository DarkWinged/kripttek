var find_nearest_building = require('utils').find_nearest_building

module.exports = {
    run: function(creep){
        let mem = creep.memory
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            mem.active = false
        } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            mem.active = true
        }
        mem = this.construct(creep, mem)
        creep.memory = mem
        creep.say(`🔨${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}`)
    },

    construct: function(creep, mem){
        if (mem.active){
            var target = Game.getObjectById(mem.target)
            if (creep.build(target) == ERR_NOT_IN_RANGE){
                if (creep.room.name != mem.target_pos.roomName) {
                    let next = find_next_room(creep.room.name, mem.target_pos.roomName)
                    let exit = creep.room.findExitTo(Game.rooms[next])
                    creep.moveTo(creep.pos.findClosestByPath(exit))
                } else {
                    creep.moveTo(mem.target_pos.x, mem.target_pos.y)
                }
            } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                mem.active = false
                mem = this.construct(creep)
            }
            return mem
        } else {
            var container = find_nearest_building(creep.pos, {filter: this.filter_container})
            if (!container) {
                let spawn = Object.values(Game.spawns)[0]
                creep.moveTo(spawn)
                return mem
            }
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(container)
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                mem.active = true
                mem = this.construct(creep)
            }
            return mem
        }
    },

    filter_container: function(structure){
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    }

}