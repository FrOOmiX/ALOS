module.exports = function dt( options ){

    this.add('role:dt, cmd:list', function list(msg, respond) {
        respond(null, {answer: msg.cmd})
    })

    this.add('role:dt, cmd:load', function list(msg, respond) {
        respond(null, {answer: msg.id})
    })
}