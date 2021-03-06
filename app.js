var SenecaWeb = require('seneca-web')
var Express = require('express')
var Router = Express.Router
var context = new Router()

var senecaWebConfig = {
    context: context,
    adapter: require('seneca-web-adapter-express'),
    options: { parseBody: false }
}

var app = Express()
    .use(require('body-parser').json())
    .use(context)
    .listen(3000)

var seneca = require('seneca')()
    .use(SenecaWeb, senecaWebConfig)
    .use('entity')
    .use('api')
    .client( { type: 'tcp', port: 9000, pin: 'role:dt' } )
    .client( { type: 'tcp', port: 9001, pin: 'role:stats' } )
    .client( { type: 'tcp', port: 9002, pin: 'role:indexation' } )
