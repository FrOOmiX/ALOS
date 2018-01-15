module.exports = function api(options) {
  
    this.add( 'role:api,cmd:list', function(msg, respond) {
        this.act( 'role:dt', {
            cmd: "list"
        }, respond )
    });

    this.add( 'role:api,cmd:load', function(msg, respond) {
        this.act( 'role:dt', {
            cmd: "load",
            id: msg.args.params.id
        }, respond )
    });


    
    this.add('init:api', function(msg, respond) {
        this.act('role:web', {
            routes:
            {
                prefix: '/api/dt',
                pin: 'role:api,cmd:*',
                map: {
 
                    list: { GET: true, name: '' },
                    load: { GET: true, name: '', suffix: '/:id' }
                }
            }
        }, respond)
    })  
}