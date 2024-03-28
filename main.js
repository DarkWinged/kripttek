var imports = {
    planner: require('job_planner'),
    spawner: require('spawner'),
    creeper: require('creep'),
    profession: require('job')
}

module.exports.loop = function () {
    var debug = Memory.debug
    if (!Memory.jobs){
        Memory.jobs = {}
    }

    for (let i in imports){
        imports[i].debug = debug
    }

    for (let j in Memory.jobs){
        let job = Memory.jobs[j]
        imports.profession.cycle(job)
    }
    for (let r in Game.rooms) {
        let room = Game.rooms[r]
        console.log("Room: " + room.name)
        imports.planner.cycle(room)
    }
    for (let c in Game.creeps) {
        let creep = Game.creeps[c] 
        imports.creeper.cycle(creep)
    }
    for (let s in Game.spawns) {
        let spawn = Game.spawns[s]
        imports.spawner.cycle(spawn)
    }
    if (!debug) {
        if (Game.cpu.bucket > 5000){
            Game.cpu.generatePixel()
        } else {
            console.log("pixel progress: " + Math.round((Game.cpu.bucket/5000)*10000)/100 + "%" )
        }
    }
    for (let c in Memory.creeps){
        if (!Game.creeps[c]){
            delete Memory.creeps[c]
        }
    }
}