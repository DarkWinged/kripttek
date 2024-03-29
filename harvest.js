module.exports = {
    run: function(job){
        let source = Game.getObjectById(job.target)
        if (!source) {
            return true//Memory.jobs[job.id].completed = true
        }
        console.log(`Source: ${source.pos} ${source.energy}/${source.energyCapacity} energy`)

        if (!(job.assigned.length < job.staffing)) return
        let creep = _.find(Game.creeps, this.filter_prospects)
        if (!creep) return 

        let mem = creep.memory
        mem.job = job.id
        mem.target = job.target
        mem.target_pos = source.pos
        mem.role = 'harvester'
        creep.memory = mem
        job.assigned.push(creep.id)
        Memory.jobs[job.id] = job
    },
    
    filter_prospects: function(creep){
        let mem = creep.memory
        return (mem.role == 'harvester' || mem.role == 'unemployed') && mem.job == null
    }
}