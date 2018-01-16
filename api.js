module.exports = function api(options) {
    
    // localhost:3000/api/dt
    this.add('role:api,cmd:list', function(msg, respond) {
        this.act( 'role:dt', {
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
                state: "En cours"
            }
        }, respond)
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
            data: data
        }, respond)
    });

    this.add('init:api', function(msg, respond) {
        this.act('role:web', {
            routes:
            {
                prefix: '/api/dt',
                pin: 'role:api,cmd:*',
                map: {
 
                    list: { GET: true, name: '' },
                    load: { GET: true, name: '', suffix: '/:id' },
                    create: { POST: true, name: '' },
                    remove: { DELETE: true, name: '', suffix: '/:id' },
                    update: { PUT: true, name: '', suffix: '/:id' },
                }
            }
        }, respond)
    })  
}