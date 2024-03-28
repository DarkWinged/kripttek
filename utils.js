var utils = {
    find_nearest_spawn: function(pos){
        return pos.findClosestByPath(FIND_MY_SPAWNS)
    },

    find_nearest_building: function(pos, filter){
        return pos.findClosestByPath(FIND_MY_STRUCTURES, filter)
    },
}

module.exports = utils;