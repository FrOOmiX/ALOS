module.exports = function stats(options) {

    var compteur = {

            global_stats_wr_created: 0,
            global_stats_wr_opened: 0,
            global_stats_wr_closed: 0,
            global_stats_wr_deleted: 0
        },
        cptByUser = {};

    this.add('role:stats, cmd:add', function (msg, respond) {

        // Compteur global
        compteur.global_stats_wr_created += 1;
        compteur.global_stats_wr_opened += 1;

        var applicant = msg.applicant;

        // Compteur par applicant
        if (cptByUser.hasOwnProperty(applicant)) {
            
            cptByUser[applicant].stats_wr_created += 1;
            cptByUser[applicant].stats_wr_opened += 1;
        } else {

            cptByUser[applicant] = {}
            cptByUser[applicant].stats_wr_created = 1;
            cptByUser[applicant].stats_wr_opened = 1;
            cptByUser[applicant].stats_wr_closed = 0;
            cptByUser[applicant].stats_wr_deleted = 0;
        }

        respond(null, { success: true, msg: "", data: [] });
    });

    this.add('role:stats, cmd:update', function (msg, respond) {

        var applicant = msg.applicant;

        // Compteur global
        compteur.global_stats_wr_opened -= 1;
        compteur.global_stats_wr_closed += 1;

        // Compteur par applicant
        cptByUser[applicant].stats_wr_opened -= 1;
        cptByUser[applicant].stats_wr_closed += 1;

        respond(null, { success: true, msg: "", data: [] });
    });

    this.add('role:stats, cmd:delete', function (msg, respond) {

        var applicant = msg.applicant;

        // Compteur global
        compteur.global_stats_wr_opened -= 1;
        compteur.global_stats_wr_deleted += 1;

        // Compteur par applicant
        cptByUser[applicant].stats_wr_opened -= 1;
        cptByUser[applicant].stats_wr_deleted += 1;

        respond(null, { success: true, msg: "", data: [] });
    });

    this.add('role:stats, cmd:GET', function (msg, respond) {
        
        if (msg.user === undefined)                  respond(null, { success: true, msg: "", data: compteur });
        else if (cptByUser.hasOwnProperty(msg.user)) respond(null, { success: true, msg: "", data: cptByUser[msg.user] });
        else                                         respond(null, { success: false, msg: "applicant not found", data: {} });
    });
};