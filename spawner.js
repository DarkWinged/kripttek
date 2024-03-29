var cost = require('utils').cost
module.exports = {
    cycle: function (spawn){
        let room = Game.rooms[spawn.room.name]
        console.log("Spawn: [" + spawn.name + ", " + room.energyAvailable + "/" + room.energyCapacityAvailable + "]")
        let genome = [WORK, CARRY, MOVE, MOVE]
        if (room.energyAvailable >= cost(genome)){
            spawn.spawnCreep(genome, 'Worker' + Game.time, {memory: {role: 'unemployed'}})
        }
    }
}