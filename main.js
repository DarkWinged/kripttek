var imports = {
    planner: require('job_planner'),
    spawner: require('spawner'),
    creeper: require('creep'),
    profession: require('job')
}
const USERNAME = "DarkWingedDaemon"

module.exports.loop = function () {
    var debug = Memory.debug
    try {
        console.log("<h3>" + "-".repeat(10) + "=[" + Game.time + "]=" + "-".repeat(10) + "</h3>")
        // console.log("<style>div {text-align: left;}</style>")
        if (!Memory.jobs){
            Memory.jobs = {}
        }
        for (let i in imports){
            imports[i].debug = debug
            imports[i].USERNAME = USERNAME
        }
        for (let j in Memory.jobs){
            let job = Memory.jobs[j]
            imports.profession.cycle(job)
        }
        for (let r in Game.rooms) {
            let room = Game.rooms[r]
            console.log("Room: " + room.name + " - " + (room.controller.owner ? room.controller.owner.username : "unowned"))
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
        for (let c in Memory.creeps){
            if (!Game.creeps[c]){
                delete Memory.creeps[c]
            }
        }
    } catch (e) {
        console.log(`<font color="orangered">${e.stack}</font>`);
    } finally {
    }
    if (!debug) {
        if (Game.cpu.bucket > 5000){
            Game.cpu.generatePixel()
        } else {
            console.log("<font color='limegreen'>pixel progress: " + Math.round((Game.cpu.bucket/5000)*10000)/100 + "%</font>")
        }
    }
}