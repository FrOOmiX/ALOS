module.exports = function dt( options ){

    this.add('role:dt, cmd:list', function list(_, respond) {
        respond(null, {answer: "Cmd list"})
    })
}