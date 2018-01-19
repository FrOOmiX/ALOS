module.exports = function indexation(options) {

    var fulltextsearchlight = require('full-text-search-light'),
        search              = new fulltextsearchlight(),
        dico                = {};

    /** Index simplement le champ work,
     *  l'id est ignore grace a la fonction passee
     *  en parametre de la fonction add
     *  L'association entre l'id d'indexation et celui de la DT
     *  est realisee dans l'objet dico
     */
    this.add('role:indexation, cmd:index', function (msg, respond) {

        var idIndex = search.add({ id: msg.id, work: msg.work }, function (key, val) {
            
            if (key == "id") return false;
        
            return true;
        });

        // Association entre les id, celui de la DT est la clef pour retrouver celui d'indexation
        dico[msg.id] = idIndex;

        // Sauvegarde dans un fichier json
        search.saveSync('indexation.json');

        respond(null, { success: true, msg: "", data: [] });
    });

    /** Cette fonction doit normalement permettre
     *  d'updater, pour cela on doit passer par un remove de la DT
     *  Cependant la fonction remove plante a chaque appel
     */
    this.add('role:indexation, cmd:update', function (msg, respond) {

        // Recherche de la DT dont id correspond
        var idIndexation = dico[msg.id];

        // Suppression de la DT indexee
        search.remove(idIndexation);

        // Re-indexation la DT supprimee avec le nouveau champ work
        var idIndex = search.add({ id: msg.id, work: msg.work }, function (key, val) {
            
            if (key == "id") return false;
        
            return true;
        });

        // Re-association entre les id
        dico[msg.id] = idIndex;

        // Sauvegarde dans le fichier json
        search.saveSync('indexation.json');
        
        respond(null, { success: true, msg: "", data: [] });
    });

    /** Permet de faire une recherche par le work
     *  et de renvoyer les ID de la/les DT correspondante(s)
     */
    this.add('role:indexation, cmd:GET', function (msg, respond) {

        if (msg.work != undefined) {

            var res  = search.search(msg.work),
                data = [];

            // Permet de recuperer que les ID
            res.forEach(function(el) {

                data.push({ id: el.id });
            });

            if (res.length === 0) respond(null, { success: false, msg: "", data: [] });
            else                  respond(null, { success: true, msg: "", data: data });
        } else {

            /** Ceci n'est jamais affiché car la route
             *  est confondue avec celle des stats sans parametres...
             */
            respond(null, { success: false, msg: "Pas de description fournie", data: [] });
        }
    });
}