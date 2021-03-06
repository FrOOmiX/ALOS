module.exports = function dt(options){

    /** Affichage une DT si un ID est specifie
     *  Sinon affiche toutes les DT
     */
    this.add('role:dt, cmd:GET', function(msg, respond) {
        if (msg.data.id != undefined){

            // Recupere la DT dont l'ID correspond
            this.make('dt').load$(msg.data.id, function (err, dt) {
                if(dt != null)
                    respond(null, {success: true, msg: "", data:{applicant : dt.applicant, work : dt.work, state: dt.state, id: dt.id}})
                else
                    respond(null, {success: false, msg: "wr not found", data:{}})
            })
        }else{

            // Recupere toutes les DT
            this.make('dt').list$({},function (err, list) {
                var data = [];
                list.forEach(function (dt) {
                    data.push({applicant : dt.applicant, work : dt.work, state: dt.state, id: dt.id})
                });
                respond(null, {success: true, msg: "", data:data})
            })
        }
    });

    // Creer une nouvelle DT en initialisant sont statut a created
    this.add('role:dt, cmd:POST', function(msg, respond) {

        msg.data.state = "created";

        // Appelle le module de stats pour les mettre a jour
        this.act('role:stats', {
            cmd: "add",
            applicant: msg.data.applicant
        })

        this.make('dt').data$(msg.data).save$(function (err, dt) {

            // Appelle le module d'indexation
            this.act('role:indexation', {
                cmd: "index",
                work: dt.work,
                id: dt.id
            });

            respond(null, {success: true, msg: "", data:{id: dt.id, applicant: dt.applicant, work: dt.work, state: dt.state, date: dt.date}});
        })
    });

    // Traite la suppression d'une DT
    this.add('role:dt, cmd:DELETE', function(msg, respond) {

        // Suppression unique d'une DT grace a l'ID
        if (msg.data.id != undefined){
            this.make('dt').load$(msg.data.id, function (err, dt) {
                if (dt == null) {
                    respond(null, {success: false, msg: "wr not found", data: {}})
                }else{

                    // Verification de la possibilite de supprimer la DT en fonction de son etat (created | closed)
                    if(dt.state == "created"){
                        //temp permet de stocker la DT a supprimer afin de la renvoyer
                        var temp = dt;
                        delete temp.entity$;

                        // Mise a jour des stats
                        this.act('role:stats', {
                            cmd: "delete",
                            applicant: dt.applicant
                        })

                        // Suppression
                        this.make('dt').remove$(dt.id, function (err, dt) {
                            respond(null, {success: true, msg: "", data: temp})
                        })
                    } else {

                        // DT cloturee donc suppression impossible
                        respond(null, {success: false, msg: "wr is already closed", data: dt})
                    }
                }
            })
        } else {

            // Suppression de toutes les DT dont le statut est created
            this.make('dt').list$({state:'created'}, function (err, res) {

                // that = this car dans le foreach le this fait desormais reference a res
                var that = this;

                res.forEach(function (dt) {

                    // Mise a jour des stats
                    that.act('role:stats', {
                        cmd: "delete",
                        applicant: dt.applicant
                    })

                    // Suppression
                    dt.remove$(function (err, dt) {
                    })
                })
                respond(null, {success: true, msg: "", data: {}})
            })
        }
    });

    // Modification d'une DT
    this.add('role:dt, cmd:PUT', function(msg, respond) {
        if(msg.data.id == undefined){
            respond(null, {success: false, msg: "wr id not provided", data:{}})
        }
        else{
            this.make('dt').load$(msg.data.id, function (err, dt){
                if (dt == null) {
                    respond(null, {success: false, msg: "wr not found", data: {}})
                } else {

                    // Verification de la possibilite de modifier une DT par rapport au statut
                    if (dt.state == "created") {

                        /** Update de l'indexation si champ work fourni
                         *  Mise en commentaire car le remove necessaire a l'update
                         *  ne fonctionne pas
                         *
                        if (msg.data.work != null) {

                            this.act('role:indexation', {
                                cmd: "update",
                                work: msg.data.work,
                                id: dt.id
                            });
                        }*/

                        // Recuperation des donnees de la DT enregistree si elles ne sont pas fournies dans la requete
                        if (msg.data.applicant == null) msg.data.applicant = dt.applicant;
                        if (msg.data.work == null) msg.data.work = dt.work;
                        if (msg.data.state == null) msg.data.state = dt.state;
                        if (msg.data.date == null) msg.data.date = dt.date;

                        // Update des stats si le statut change
                        if (msg.data.state === "closed") {

                            this.act('role:stats', {
                                cmd: "update",
                                applicant: msg.data.applicant
                            })
                        }

                        this.make('dt').data$(msg.data).save$(function (err, dt) {
                            respond(null, {success: true, msg: "", data: {applicant : dt.applicant, work : dt.work, state: dt.state, id: dt.id}})
                        })
                    }
                    else {
                        respond(null, {success: false, msg: "wr is already closed", data: dt})
                    }
                }
            })
        }
    })
};