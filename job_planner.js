module.exports = {
    cycle: function(room){
        if (!room.memory.jobs){
            this.init(room)
        }
        let sites = room.find(FIND_CONSTRUCTION_SITES).filter(this.filter_sites)
        for (let s in sites){
            let site = sites[s]
            this.create_job(room, 'build', site.id, staffing=1)
        }
        let assigned_maintaince_sites = _.filter(Object.values(Memory.jobs), (job) => job.type == 'maintain').map((job) => job.target) 
        let maintenance = room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax && !(structure.id in assigned_maintaince_sites)}).sort((a, b) => a.hits/a.hitsMax - b.hits/b.hitsMax)
        for (let m in maintenance){
            let site = maintenance[m]
            this.create_job(room, 'maintain', site.id, staffing=1)
        }
    },

    init: function(room){
        room.memory.jobs = []
        let sources = room.find(FIND_SOURCES)
        for (let s in sources){
            let source = sources[s]
            let source_id = source.id
            let source_jobs = _.filter(room.memory.jobs, (job) => job.target == source_id)
            if (source_jobs.length == 0){
                this.create_job(room, 'harvest', source_id)
            }
        }
        let controller = room.controller
        if (controller.owner && controller.owner.username == this.USERNAME) {
            this.create_job(room, 'upgrade', controller.id)
        }
    },

    create_job: function(room, type, target, staffing=2){
        let job = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            target: target,
            staffing: staffing,
            assigned: [],
        }
        Memory.jobs[job.id] = job
        room.memory.jobs.push(job.id)
    },

    filter_sites: function(site){
        return Object.values(Memory.jobs).filter((job) => job.target == site.id).length < 1
    }
}