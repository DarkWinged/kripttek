var jobs = {
    harvest: require('harvest'),
    upgrade: require('upgrade'),
    build: require('build'),
}


var job = {
    cycle: function(job){
        if (job.completed){
            this.cleanup(job)
            return
        }
        if (job.assigned.length < job.staffing){
            this.unemploy_excess(job)
        }
        // this.remove_expired(job)
        this.remove_vacant(job)
        console.log("Job: " + job.type + " " + job.target, job.assigned.length + "/" + job.staffing)
        if (job.type in jobs) {
            return jobs[job.type].run(job)
        }
        console.log("Job: type(" + job.type + ") not found")
    },

    remove_vacant: function(job){
        let dead = 0
        for (let c in job.assigned){
            let creep = Game.getObjectById(job.assigned[c])
            if (!creep){
                dead += 1
            }
        }
        if (dead > 0){
            job.assigned.sort(function(a,b){if(!a && !b){return 0} else if(!a){return 1} else if(!b){return -1} else{return 0}})
            while (dead > 0){
                job.assigned.pop()
                dead -= 1
            }
            Memory.jobs[job.id].assigned = job.assigned
        }
    },

    remove_expired: function(job){
        let alive = []
        for (let c in job.assigned){
            let creep = Game.getObjectById(job.assigned[c])
            if (!creep){
                continue
            } else {
                alive.push(job.assigned[c])
            }
        }
        Memory.jobs[job.id].assigned = alive
        
    },

    unemploy_excess: function(job){
        if (job.assigned.length > job.staffing){
            let excess = job.assigned.length - job.staffing
            for (let e = 0; e < excess; e++){
                let creep = Game.getObjectById(Memory.jobs[job.id].assigned.pop())
                creep.memory.job = null
                creep.memory.target = null
                creep.memory.role = 'unemployed'
            }
        }
    },
    
    cleanup: function(job){
        for (let c in job.assigned){
            let creep = Game.getObjectById(job.assigned[c])
            creep.memory.job = null
            creep.memory.target = null
            creep.memory.role = 'unemployed'
        }
        delete Memory.jobs[job.id]
    }
}

module.exports = job;