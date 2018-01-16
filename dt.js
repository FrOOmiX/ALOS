module.exports = function dt( options ){

    this.add('role:dt, cmd:list', function list(msg, respond) {
        respond(null, {answer: msg.cmd})
    })

    this.add('role:dt, cmd:load', function load(msg, respond) {
        respond(null, {answer: msg.id})
    })

    this.add('role:dt, cmd:create', function create(msg, respond) {
        this.make('dt').data$(msg.data).save$(respond)
    })
}