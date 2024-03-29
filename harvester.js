var find_nearest_building = require('utils').find_nearest_building
var find_next_room = require('utils').find_next_room
module.exports = {
    run: function(creep) {
        let mem = creep.memory
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            mem.active = true
        } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            mem.active = false
        }
        mem = this.harvset_target(creep, mem)
        creep.say(`⛏️${creep.store.getCapacity() - creep.store.getFreeCapacity()}/${creep.store.getCapacity()}`)
        creep.memory = mem
    },

    harvset_target: function(creep, mem) {
        if (mem.active) {
            let source = Game.getObjectById(mem.target)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                if (creep.room.name != mem.target_pos.roomName) {
                    let next = find_next_room(creep.room.name, mem.target_pos.roomName)
                    let exit = creep.room.findExitTo(Game.rooms[next])
                    creep.moveTo(creep.pos.findClosestByPath(exit))
                } else {
                    creep.moveTo(mem.target_pos.x, mem.target_pos.y)
                }
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                mem.active = false
                mem = this.harvset_target(creep, mem)
            }
            return mem
        } else {            
            let deposit = Game.getObjectById(mem.deposit)
            if (!deposit || deposit.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                deposit = find_nearest_building(creep.pos, {filter: this.filter_deposit})
                if (!deposit) {
                    deposit = Object.values(Game.spawns).filter(s => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)[0]
                    if (!deposit) {
                        if (this.debug) {
                            console.log("No deposit found")
                        }
                        return mem
                    }
                }
                mem.deposit = deposit.id
            }
            if (creep.transfer(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(deposit)
            } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                mem.active = true
                mem = this.harvset_target(creep, mem)
            }
            return mem
        }
    },

    filter_deposit: function(structure) {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    }
}