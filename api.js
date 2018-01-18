module.exports = function api(options) {
    
    this.add('role:api,path:stats', function(msg, respond) {
        this.act('role:stats', {
            cmd: msg.request$.method,
            user: msg.args.params.user
        }, respond)
    });

    this.add('role:api,path:dt', function (msg, respond) {

        var data = msg.args.body;
        var params = msg.args.params;

        this.act('role:dt', {
            cmd: msg.request$.method,
            data: {
                applicant: data.applicant,
                work: data.work,
                state: data.state,
                date: data.date,
                id: params.id
            }
        }, respond)
    });

    this.add('init:api', function(msg, respond) {
        this.act('role:web', {
            routes: [
                {
                    prefix: '/api/dt',
                    pin: 'role:api,path:stats',
                    map: {
                        stats: {
                            GET: true,
                            suffix: '/:user?'
                        }
                    }
                },
                {
                    prefix: '/api',
                    pin: 'role:api,path:dt',
                    map: {
                        dt: {
                            GET: true,
                            POST: true,
                            PUT: true,
                            DELETE: true,
                            suffix: '/:id?'
                        }
                    }
                }
            ]
        }, respond)
    })  
}