var harvest = {
    run: function(job){
        let source = Game.getObjectById(job.target)
        console.log(`Source: ${source.pos} ${source.energy}/${source.energyCapacity} energy`)

        if (job.assigned.length < job.staffing){
            let creep = _.find(Game.creeps, this.filter_prospects)
            if (creep){
                creep.memory.job = job.id
                creep.memory.target = job.target
                creep.memory.role = 'harvester'
                job.assigned.push(creep.id)
            }
        }
    },
    
    filter_prospects: function(creep){
        return (creep.memory.role == 'harvester' || creep.memory.role == 'unemployed') && creep.memory.job == null
    }
}

module.exports = harvest