module.exports = function dt(options){

    this.add('role:dt, cmd:GET', function(msg, respond) {
        if (msg.data.id != undefined){
            this.make('dt').load$(msg.data.id, function (err, dt) {
                if(dt != null)
                    respond(null, {success: true, msg: "", data:dt})
                else
                    respond(null, {success: false, msg: "wr not found", data:{}})
            })
        }else{
            this.make('dt').list$({},function (err, list) {
                var data = [];
                list.forEach(function (dt) {
                    data.push({applicant : dt.applicant, work : dt.work, date: dt.date, id: dt.id})
                    //data.push(dt)
                });
                respond(null, {success: true, msg: "", data:data})
            })
        }
    });

    this.add('role:dt, cmd:POST', function(msg, respond) {

        msg.data.state = "created";

        this.act('role:stats', {
            cmd: "add",
            applicant: msg.data.applicant
        })

        this.make('dt').data$(msg.data).save$(function (err, dt) {

            this.act('role:indexation', {
                cmd: "index",
                work: dt.work,
                id: dt.id
            });

            respond(null, {success: true, msg: "", data:{id: dt.id, applicant: dt.applicant, work: dt.work, state: dt.state, date: dt.date}});
        })
    });

    this.add('role:dt, cmd:DELETE', function(msg, respond) {
        if (msg.data.id != undefined){
            this.make('dt').load$(msg.data.id, function (err, dt) {
                if (dt == null) {
                    respond(null, {success: false, msg: "wr id not found", data: {}})
                }else{
                    if(dt.state == "created"){

                        this.act('role:stats', {
                            cmd: "delete",
                            applicant: dt.applicant
                        })

                        this.make('dt').remove$(dt.id, function (err, dt) {
                            respond(null, {success: true, msg: "", data: msg.data})
                        })
                    }
                    else{
                        respond(null, {success: false, msg: "wr is already closed", data: dt})
                    }
                }

            })
        }else{
            this.make('dt').list$({state:'created'}, function (err, res) {
                //that = this parce que dans le foreach le this fait reference a res
                var that = this;

                res.forEach(function (dt) {
                    that.act('role:stats', {
                        cmd: "delete",
                        applicant: dt.applicant
                    })
                    dt.remove$(function (err, dt) {
                    })
                })
                respond(null, {success: true, msg: "", data: {}})
            })
        }

    });

    this.add('role:dt, cmd:PUT', function(msg, respond) {
        if(msg.data.id == undefined){
            respond(null, {success: false, msg: "wr id not provided", data:{}})
        }
        else{
            this.make('dt').load$(msg.data.id, function (err, dt){
                if (dt == null) {
                    respond(null, {success: false, msg: "wr id not found", data: {}})
                } else {
                    if (dt.state == "created") {

                        // Update de l'indexation si champ work fourni
                        if (msg.data.work != null) {

                            this.act('role:indexation', {
                                cmd: "update",
                                work: msg.data.work,
                                id: dt.id
                            });
                        }

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
                            respond(null, {success: true, msg: "", data: dt})
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