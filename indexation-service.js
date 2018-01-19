require( 'seneca' )()
    .use( 'entity' )
    .use( 'indexation' )
    .listen({ type: 'tcp', port: 9002, pin: 'role:indexation' })