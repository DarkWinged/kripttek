var cost = require('utils').cost
module.exports = {
    cycle: function (spawn){
        let room = Game.rooms[spawn.room.name]
        console.log("Spawn: [" + spawn.name + ", " + room.energyAvailable + "/" + room.energyCapacityAvailable + "]")
        let genome = [WORK, CARRY, MOVE, MOVE]
        if (room.energyAvailable >= cost(genome)){
            let unemployment_rate = Object.values(Memory.creeps).filter(c => c.role == 'unemployed').length
            if (this.debug) console.log("Unemployment rate: " + unemployment_rate)
            if (unemployment_rate < 5){
                spawn.spawnCreep(genome, 'Worker' + Game.time, {memory: {role: 'unemployed'}})
            }
        }
    }
}