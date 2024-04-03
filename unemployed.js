module.exports = {
    run: function (creep) {
        if (creep.store.getUsedCapacity() > 0) {
            let deposit = creep.memory.deposit;
            if (!deposit) {
                deposit = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        );
                    },
                });
            }
            if (!deposit) {
                deposit = Object.values(Game.spawns).filter(
                    (s) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )[0];
            }
            if (creep.transfer(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(deposit);
            }
            creep.memory.deposit = deposit.id;
        } else {
            creep.memory = this.patrol(creep, creep.memory);
        }
    },

    patrol: function (creep, mem) {
        let current_pos = creep.pos;
        let flag = Game.flags[mem.flag];
        if (
            !flag ||
            (flag.pos.roomName == current_pos.roomName &&
                flag.pos.x == current_pos.x &&
                flag.pos.y == current_pos.y)
        ) {
            mem = this.get_next_flag(mem);
        }
        creep.moveTo(Game.flags[mem.flag]);
        return mem;
    },

    get_next_flag: function (mem) {
        let idle_flags = Object.keys(Game.flags)
            .filter((f) => f.includes("Idle"))
            .sort();
        if (!mem.flag in idle_flags) {
            mem.flag = idle_flags[0];
            return mem;
        }
        let current_flag = mem.flag;
        let next = idle_flags.indexOf(current_flag) + 1;
        if (next >= idle_flags.length) {
            next = 0;
        }
        mem.flag = idle_flags[next];
        return mem;
    },
};
