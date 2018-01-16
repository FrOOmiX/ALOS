module.exports = function dt( options ){

    this.add('role:dt, cmd:list', function list(msg, respond) {
        this.make('dt').list$({},function (err, list) {
            var data = [];
            list.forEach(function (dt) {
                data.push(dt)
            });
            respond(null, {succes: true, msg: "", data:data})
        })
    });

    this.add('role:dt, cmd:load', function load(msg, respond) {
        this.make('dt').load$(msg.id, function (err, dt) {
            if(dt != null)
                respond(null, {succes: true, msg: "", data:[dt]})
            else
                respond(null, {succes: false, msg: "Cette demande de travaux n'existe pas", data:[]})
        })
    });

    this.add('role:dt, cmd:create', function create(msg, respond) {
        this.make('dt').data$(msg.data).save$(function (err, dt) {
                respond(null, {succes: true, msg: "", data:[{id: dt.id}]})
        })

    });

    this.add('role:dt, cmd:remove', function remove(msg, respond) {
        this.make('dt').load$(msg.id, function (err, dt) {
            if(dt.state == "En cours"){
                this.make('dt').remove$(dt.id, function (err, dt) {
                    respond(null, {succes: true, msg: "", data:[dt]})
                })
            }
            else{
                respond(null, {succes: false, msg: "Suppresion impossible, la demande de travaux est terminée.", data:[dt]})
            }
        })
    });

    this.add('role:dt, cmd:update', function update(msg, respond) {
        this.make('dt').load$(msg.data.id, function (err, dt){
            if(dt.state == "En cours"){
                this.make('dt').data$(msg.data).save$(function (err, dt) {
                    respond(null, {succes: true, msg: "", data:[dt]})
                })
            }
            else{
                respond(null, {succes: false, msg: "Modification impossible, la demande de travaux est terminée.", data:[dt]})
            }
        })

    })
};