module.exports = function api(options) {
    
    // Traite les requetes GET pour l'affichage des stats
    this.add('role:api,path:stats', function(msg, respond) {
        this.act('role:stats', {
            cmd: msg.request$.method,
            user: msg.args.params.user
        }, respond)
    });

    // Traite les requetes GET pour la recherche
    this.add('role:api,path:search', function(msg, respond) {
        this.act('role:indexation', {
            cmd: msg.request$.method,
            work: msg.args.params.work
        }, respond)
    });

    // Traite les operations CRUD pour la gestion des DT
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

    // Definition des routes du service web
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
                    prefix: '/api/dt',
                    pin: 'role:api,path:search',
                    map: {
                        search: {
                            GET: true,
                            suffix: '/:work'
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