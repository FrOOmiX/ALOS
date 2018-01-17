module.exports = function stats(options) {

    var compteur = {
        global_stats_wr_created: 0,
        global_stats_wr_opened: 0,
        global_stats_wr_closed: 0
    };

    this.add('role:stats, info:add', function add(msg, respond) {

        compteur.global_stats_wr_created += 1;
        compteur.global_stats_wr_opened += 1;
        respond(null, { success: true, msg: "", data: [] });
    });

    this.add('role:stats, info:update', function update(msg, respond) {

        compteur.global_stats_wr_closed += 1;
        compteur.global_stats_wr_opened -= 1;
        respond(null, { success: true, msg: "", data: [] });
    });

    this.add('role:stats, info:statsAll', function statsAll(msg, respond) {
        respond(null, { succes: true, msg: "", data:[compteur] });
    });

    this.add('role:stats, info:statsUser', function statsUser(msg, respond) {
    });
};