/**
 * Created by Steven on 18/01/2018.
 */
// client pour tester l'API REST
var restify = require('restify-clients');
var masync = require('async');
var assert = require('assert');
const Code = require('code');
const expect = Code.expect;

var client = restify.createJsonClient({
    url: 'http://0.0.0.0:3000'
});

// a test DT to CREATE (POST) READ (GET)
var paulWR = {
    applicant: "paul",
    work: "PC update",
    date : "10-10-2018"
};

var pierreWR = {
    applicant: "pierre",
    work: "PC configuration",
    date : "10-10-2018"
};

// a test DT to UPDATE (PUT)
var updDT = {
    applicant: "paul",
    work: "PC reinstall",
    date : "10-10-2018"
};

var pierreWRwithID = {
    applicant: "pierre",
    work: "PC configuration",
    date : "10-10-2018"
};

function DTEquals(p1, p2) {
    for (var n in p1) {
        assert.equal(p1[n], p2[n]);
    }
}

console.log('Client start')

var dt_id = null;
var pierre_id = null;
var dt_applicant = null

masync.series([
    // creation d'une DT
    function(callback) {
        client.post('/api/dt', paulWR, function(err, req, res, result) {
            assert.ifError(err);
            console.log('post Paul %j', result);
            assert.equal(result.success,true,'Echec post')
            dt_id = result.data.id
            dt_applicant = result.data.applicant
            DTEquals(paulWR, result.data);
            callback(null, 'one');
        })
    },

    // obtention d'une DT avec son identifiant
    function(callback) {
        client.get('/api/dt/'+ dt_id, function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec get')
            console.log('get Paul %j', result);
            DTEquals(paulWR, result.data);
            callback(null, 'two');
        })
    },

    // modification d'une DT (changement de description)
    function(callback) {
        client.put('/api/dt/'+ dt_id, {
            "work": "PC reinstall"
        }, function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec put (work)')
            console.log('put Paul %j', result);
            DTEquals(updDT, result.data);
            callback(null, 'three');
        })
    },

    // modification d'une DT (cloture)
    function(callback) {
        client.put('/api/dt/'+ dt_id, {
            "state": "closed"
        }, function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec put (state)')
            console.log('put Paul %j', result);
            assert.equal(result.data.state,'closed')
            callback(null, 'four');
        })
    },

    // tentative de modification d'une DT (echec car deja cloturée)
    function(callback) {
        client.put('/api/dt/'+ dt_id, {
            "work": "PC destruction"
        }, function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,false,'Echec put (work2)')
            console.log('put Paul %j', result);
            assert.equal(result.msg,'wr is already closed')
            callback(null, 'five');
        })
    },

    // Creation d'une deuxieme DT
    function(callback) {
        client.post('/api/dt', pierreWR, function(err, req, res, result) {
            assert.ifError(err);
            console.log('post Pierre %j', result);
            assert.equal(result.success,true,'Echec post')
            pierre_id = result.data.id
            DTEquals(pierreWR, result.data);
            updDT.id = dt_id;
            pierreWRwithID.id = pierre_id;
            callback(null, 'six');
        })
    },

    // obtention de toutes les DT
    function(callback) {
        client.get('/api/dt', function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec get')
            console.log('get all WR %j', result);
            expect(result.data).to.include([updDT, pierreWRwithID])
            callback(null, 'seven');
        })
    },

    // suppression d'une DT
    function(callback) {
        client.del('/api/dt/' + pierre_id, function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec del')
            console.log('del DT %j', result);
            assert.equal(result.data.id,pierre_id)
            callback(null, 'eight');
        })
    },

    // suppression d'une DT deja cloturee
    function(callback) {
        client.del('/api/dt/' + dt_id, function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,false,'Echec del (closed)')
            console.log('del DT already closed %j', result);
            assert.equal(result.msg,'wr is already closed')
            callback(null, 'nine');
        })
    },

    // modification d'une DT avec un id inconnu
    function(callback) {
        client.put('/api/dt/'+ 'falseId', {
            "work": "wr error"
        }, function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,false,'Echec put (false id)')
            console.log('put wr false id %j', result);
            assert.equal(result.msg,'wr id not found')
            callback(null, 'ten');
        })
    },

    // modification d'une DT sans id
    function(callback) {
        client.put('/api/dt', function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,false,'Echec put (no id)')
            console.log('put wr without id %j', result);
            assert.equal(result.msg,'wr id not provided')
            callback(null, 'eleven');
        })
    },

    // suppression d'une DT avec un id inconnu
    function(callback) {
        client.del('/api/dt/' + 'falseId', function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,false,'Echec del (false id)')
            console.log('del DT with false id %j', result);
            assert.equal(result.msg,'wr id not found')
            callback(null, 'twelve');
        })
    },

    // obtention des stats globales
    function(callback) {
        client.get('/api/dt/stats', function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec get global stats (1)')
            console.log('get global stats %j', result);
            assert.equal(result.data.global_stats_wr_created,1);
            assert.equal(result.data.global_stats_wr_opened,0);
            assert.equal(result.data.global_stats_wr_closed,1);
            callback(null, 'thirteen');
        })
    },

    // obtention des stats d'un utilisateur
    function(callback) {
        client.get('/api/dt/stats/' + dt_applicant, function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec get user stats')
            console.log('get ' + dt_applicant + ' stats %j', result);
            assert.equal(result.data.stats_wr_created,1);
            assert.equal(result.data.stats_wr_opened,0);
            assert.equal(result.data.stats_wr_closed,1);
            callback(null, 'fourteen');
        })
    },

    // recreation de la DT pierre avant la suppression de toutes les DT ouvertes
    function(callback) {
        client.post('/api/dt', pierreWR, function(err, req, res, result) {
            assert.ifError(err);
            console.log('post Pierre again before removing all created WR%j', result);
            assert.equal(result.success,true,'Echec post')
            DTEquals(pierreWR, result.data);
            callback(null, 'fifteen');
        })
    },

    // obtention des stats globales apres recreation de la DT depierre
    function(callback) {
        client.get('/api/dt/stats', function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec get global stats (2)')
            console.log('get global stats %j', result);
            assert.equal(result.data.global_stats_wr_created,2);
            assert.equal(result.data.global_stats_wr_opened,1);
            assert.equal(result.data.global_stats_wr_closed,1);
            callback(null, 'sixteen');
        })
    },


    // suppression d'une DT sans id
    function(callback) {
        client.del('/api/dt', function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec del (without id)')
            console.log('del seventeen opened WR %j', result);
            callback(null, 'fifeteen');
        })
    },

    // obtention des stats globales apres suppression des DT ouvertes
    function(callback) {
        client.get('/api/dt/stats', function(err, req, res, result) {
            assert.ifError(err);
            assert.equal(result.success,true,'Echec get global stats (3)')
            console.log('get global stats %j', result);
            assert.equal(result.data.global_stats_wr_created,1);
            assert.equal(result.data.global_stats_wr_opened,9);
            assert.equal(result.data.global_stats_wr_closed,1);
            callback(null, 'eighteen');
        })
    },
]);

