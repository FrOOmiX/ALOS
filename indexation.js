module.exports = function indexation(options) {

    var fulltextsearchlight = require('full-text-search-light');
    var search = new fulltextsearchlight();

    this.add('role:indexation, cmd:index', function (msg, respond) {

        // Index simplement le champ work, l'id est ignore grace a la fonction
        var idIndex = search.add({ id: msg.id, work: msg.work }, function (key, val) {
            
            if (key == "id") return false;
        
            return true;
        });

        search.saveSync('indexation.json');

        respond(null, { success: true, msg: "", data: [] });
    });

    /** L'update d'un element indexe requiert de
     *  d'abord le rechercher, recuperer l'id de la DT
     *  le supprimer par rapport a cet id
     *  et en creer un nouveau
     *
    this.add('role:indexation, cmd:update', function (msg, respond) {

        // Recherche de la DT donc id correspond
        var res = search.search(msg.oldWork);

        res.forEach(function(el) {

            if (el.id == msg.id) 
        });

        search.remove()

        // Index simplement le champ work, l'id est ignore grace a la fonction
        var idIndex = search.add({ id: msg.id, work: msg.work }, function (key, val) {
            
            if (key == "id") return false;
        
            return true;
        });

        search.saveSync('indexation.json');
        
        respond(null, { success: true, msg: "", data: [] });
    });*/

    this.add('role:indexation, cmd:GET', function (msg, respond) {

        if (msg.work != undefined) {

            var res  = search.search(msg.work),
                data = [];

            res.forEach(function(el) {

                data.push({ id: el.id });
            });

            respond(null, { success: true, msg: "", data: data });
        } else {

            respond(null, { success: false, msg: "Pas de description fournie", data: [] });
        }
    });
}