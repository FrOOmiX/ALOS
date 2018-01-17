module.exports = function api(options) {
    
    // localhost:3000/api/dt
    /*this.add('role:api,cmd:list', function(msg, respond) {
        this.act('role:dt', {
            cmd: "list"
        }, respond)
    });

    // localhost:3000/api/dt/1
    this.add('role:api,cmd:load', function(msg, respond) {
        this.act('role:dt', {
            cmd: "load",
            id: msg.args.params.id
        }, respond)
    });

    // localhost:3000/api/dt/?applicant=paul&work=changer_ampoule&date=16-01-2018
    this.add('role:api,cmd:create', function(msg, respond) {
        this.act('role:dt', {
            cmd: "create",
            data: {
                applicant:  msg.args.body.applicant,
                work:  msg.args.body.work,
                date:  msg.args.body.date,
                state: "created"
            }
        }, respond);

        this.act('role:stats', {
            cmd: "add"
        })
    });
    
    this.add('role:api,cmd:remove', function(msg, respond) {
        this.act('role:dt', {
            cmd: "remove",
            id: msg.args.params.id
        }, respond)
    });

    this.add('role:api,cmd:update', function(msg, respond) {
        
        var data = { id: msg.args.params.id };

        if (msg.args.body.state) data.state = msg.args.body.state;
        if (msg.args.body.work) data.work = msg.args.body.work;

        this.act('role:dt', {
            cmd: "update",
            id: msg.args.params.id,
            data: data
        }, respond)

        // Envoi asynchrone au module stats pour incrementer le compteur
        if (data.state && data.state === "closed") {

            this.act('role:stats', {
                cmd: "update"
            });
        }
    });

    this.add('role:api,info:statsAll', function(msg, respond) {
        this.act('role:stats', {
            info: "statsAll"
        }, respond)
    });
*/
    this.add('role:api,path:stats', function(msg, respond) {
        this.act('role:stats', {
            cmd: msg.request$.method,
            user: msg.args.params.user
        }, respond)
    });

    // traite les messages concernant les operations CRUD pour les DT
    this.add('role:api,path:dt', function (msg, respond) {
        var data = msg.args.body;
        var params = msg.args.params; // accès aux données passées via l'URL
        this.act('role:dt', {
            cmd: msg.request$.method, // HTTP method
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