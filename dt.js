module.exports = function dt( options ){

    this.add('role:dt, cmd:list', function list(msg, respond) {
        this.make$('dt').list$({},function (err, list) {
            var data = [];
            list.forEach(function (dt) {
                data.push(dt)
            });
            respond(null, {succes: true, msg: "", data:data})
        })
    });

    this.add('role:dt, cmd:load', function load(msg, respond) {
        this.make('dt').load$(msg.id, function (err, dt) {
            respond(null, {succes: true, msg: "", data:[dt]})
        })
    });

    this.add('role:dt, cmd:create', function create(msg, respond) {
        this.make('dt').data$(msg.data).save$(function (err, dt) {
                respond(null, {succes: true, msg: "", data:[{id: dt.id}]})
            })

    })
};