var roles = {
    harvester: require('harvester'),
    upgrader: require('upgrader'),
    builder: require('builder'),
    // repairer: require('repairer')
}
var unemployed = require('unemployed')
var creep = {
    cycle: function(creep) {
        if (!creep || creep.ticksToLive == 1) {
            let job = Memory.jobs[creep.memory.job]
            Memory.jobs[creep.memory.job].assigned = _.without(job.assigned, creep.id)
            delete Memory.creeps[creep.name]
        }
        if (this.debug && creep.memory.role != 'unemployed') {
            console.log("Creep: [" + creep.name + ", " + creep.memory.role + ", " + creep.memory.job + ", " + creep.ticksToLive + "]")
        }
        if (creep.memory.role in roles && creep.memory.job) {
            return roles[creep.memory.role].run(creep)
        }
        else if (creep.memory.role != 'unemployed') {
            console.log("Creep: role(" + creep.memory.role + ") not found")
        }
        creep.memory.role = 'unemployed'
        creep.memory.job = null
        creep.memory.target = null
        unemployed.run(creep)
    }
}

module.exports = creep