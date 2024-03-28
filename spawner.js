const spawner = {
    cycle: function (spawn){
        console.log("Spawn: [" + spawn.name + ", " + spawn.store.getUsedCapacity(RESOURCE_ENERGY) + "/" + spawn.store.getCapacity(RESOURCE_ENERGY) + "]")
        if (spawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 200) {
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time, {memory: {role: 'unemployed'}})
        }
    }
}
module.exports = spawner