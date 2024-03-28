var upgrade = {
    run: function(job) {
        let controller = Game.getObjectById(job.target)
        console.log(`Controller: ${controller.pos} ${(controller.progress/controller.progressTotal)*100}% progress`)

        if (job.assigned.length < job.staffing) {
            let creep = _.find(Game.creeps, this.filter_prospects)
            if (creep) {
                creep.memory.job = job.id
                creep.memory.target = job.target
                creep.memory.role = 'upgrader'
                job.assigned.push(creep.id)
            }
        }
    },

    filter_prospects: function(creep) {
        return (creep.memory.role == 'upgrader' || creep.memory.role == 'unemployed') && creep.memory.job == null
    }
}

module.exports = upgrade;