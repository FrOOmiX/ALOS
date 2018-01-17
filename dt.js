module.exports = function dt(options){

    this.add('role:dt, cmd:list', function list(msg, respond) {
        this.make('dt').list$({},function (err, list) {
            var data = [];
            list.forEach(function (dt) {
                data.push(dt)
            });
            respond(null, {success: true, msg: "", data:data})
        })
    });

    this.add('role:dt, cmd:load', function load(msg, respond) {
        this.make('dt').load$(msg.id, function (err, dt) {
            if(dt != null)
                respond(null, {success: true, msg: "", data:dt})
            else
                respond(null, {success: false, msg: "Cette demande de travaux n'existe pas", data:[]})
        })
    });

    this.add('role:dt, cmd:create', function create(msg, respond) {
        this.make('dt').data$(msg.data).save$(function (err, dt) {
            respond(null, {success: true, msg: "", data:{id: dt.id, applicant: msg.data.applicant, work: msg.data.work, state: msg.data.state}})
        })
    });

    this.add('role:dt, cmd:remove', function remove(msg, respond) {
        this.make('dt').load$(msg.id, function (err, dt) {
            if(dt.state == "created"){
                this.make('dt').remove$(dt.id, function (err, dt) {
                    respond(null, {success: true, msg: "", data: dt})
                })
            }
            else{
                respond(null, {success: false, msg: "Suppresion impossible, la demande de travaux est terminée.", data: dt})
            }
        })
    });

    this.add('role:dt, cmd:update', function update(msg, respond) {
        if(msg.id == undefined){
            respond(null, {success: false, msg: "wr id not provided", data:[]})
        }
        else{
            this.make('dt').load$(msg.data.id, function (err, dt){
                if(dt.state == "created"){
                    this.make('dt').data$(msg.data).save$(function (err, dt) {
                        respond(null, {success: true, msg: "", data:dt})
                    })
                }
                else{
                    respond(null, {success: false, msg: "work request is already closed", data: dt})
                }
            })
        }

    })
};