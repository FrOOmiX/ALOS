module.exports = function stats(options) {

    var compteur = {
        global_stats_wr_created: 0,
        global_stats_wr_opened: 0,
        global_stats_wr_closed: 0
    };

    this.add('role:stats, cmd:add', function (msg, respond) {

        compteur.global_stats_wr_created += 1;
        compteur.global_stats_wr_opened += 1;
        respond(null, { success: true, msg: "", data: [] });
    });

    this.add('role:stats, cmd:update', function (msg, respond) {

        compteur.global_stats_wr_closed += 1;
        compteur.global_stats_wr_opened -= 1;
        respond(null, { success: true, msg: "", data: [] });
    });

    this.add('role:stats, cmd:delete', function (msg, respond) {

        compteur.global_stats_wr_created -= 1;
        compteur.global_stats_wr_opened -= 1;
        respond(null, { success: true, msg: "", data: [] });
    });

    this.add('role:stats, cmd:GET', function (msg, respond) {

        if (msg.user !== null)
            respond(null, { succes: true, msg: "", data: compteur });
    });
};