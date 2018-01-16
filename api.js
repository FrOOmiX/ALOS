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

        var applicant, work, date = null;

        if(msg.args.query.applicant) { applicant = msg.args.query.applicant }
        if(msg.args.body.applicant) { applicant = msg.args.body.applicant }
        if(msg.args.query.work) { work = msg.args.query.work }
        if(msg.args.body.work) { work = msg.args.body.work }
        if(msg.args.query.date) { date = msg.args.query.date }
        if(msg.args.body.date) { date = msg.args.body.date }

        this.act('role:dt', {
            cmd: "create",
            data: {
                applicant: applicant,
                work: work,
                date: date,
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
        this.act('role:dt', {
            cmd: "update",
            data: {
                id: msg.args.params.id,
                state: msg.args.query.state,
                work: msg.args.query.work
            }
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