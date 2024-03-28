var build = {
    run: function(job){
        let site = Game.getObjectById(job.target)
        if (!site || site.progress == site.progressTotal){
            return Memory.jobs[job.id].completed = true
        }
        console.log(`Site: ${site.pos} ${(site.progress/site.progressTotal)*100}% progress`)

        if (job.assigned.length < job.staffing){
            let creep = _.find(Game.creeps, this.filter_prospects)
            if (creep){
                creep.memory.job = job.id
                creep.memory.target = job.target
                creep.memory.role = 'builder'
                job.assigned.push(creep.id)
            }
        }
    },

    filter_prospects: function(creep){
        return (creep.memory.role == 'builder' || creep.memory.role == 'unemployed') && creep.memory.job == null
    },
}

module.exports = build;