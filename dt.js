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
                    data.push(dt)
                });
                respond(null, {success: true, msg: "", data:data})
            })
        }

    });

    this.add('role:dt, cmd:POST', function(msg, respond) {
        msg.data.state = "created";
        this.make('dt').data$(msg.data).save$(function (err, dt) {
            respond(null, {success: true, msg: "", data:{id: dt.id, applicant: msg.data.applicant, work: msg.data.work, state: msg.data.state}})
        })
    });

    this.add('role:dt, cmd:DELETE', function(msg, respond) {
        this.make('dt').load$(msg.data.id, function (err, dt) {
            if (dt == null) {
                respond(null, {success: false, msg: "wr id not found", data: {}})
            }else{
                if(dt.state == "created"){
                    this.make('dt').remove$(dt.id, function (err, dt) {
                        respond(null, {success: true, msg: "", data: msg.data})
                    })
                }
                else{
                    respond(null, {success: false, msg: "wr is already closed", data: {}})
                }
            }

        })
    });

    this.add('role:dt, cmd:PUT', function(msg, respond) {
        if(msg.data.id == undefined){
            respond(null, {success: false, msg: "wr id not provided", data:{}})
        }
        else{
            this.make('dt').load$(msg.data.id, function (err, dt){
                if (dt == null) {
                    respond(null, {success: false, msg: "wr id not found", data: {}})
                }else {
                    if (dt.state == "created") {

                        if (msg.data.applicant == null) msg.data.applicant = dt.applicant;
                        if (msg.data.work == null) msg.data.work = dt.work;
                        if (msg.data.state == null) msg.data.state = dt.state;

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