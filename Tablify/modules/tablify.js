
module.exports = {
    // ici, nous allons coder ensemble les middlewares qui généreront progressivement un tableau HTML à partir d'un array JS
    // chaque sous-ensemble de balises aura son(ses) propre(s) middleware(s) : table, thead, tbody, tfoot

    /**
     * Middleware générant l'ouverture de la balise <table>
     *
     * @param {Array} i Tableau d'entrée
     * @param {Array} o Tableau de sortie
     * @param {Function} next Fonction de passage de bâton
     */


    openTag(i, o, next){
        o.push("<table>");
        next(); // sans cette ligne notre processeur de middleware n'ira pas plus loin, or on en aura d'autres à traiter

    },

    closeTag(i, o, next){
        o.push("</table>");
        next();

    },

    // [quelques fonctions codées ensemble ici]

    // exo en autonomie 1 (avant ou après fait le body, au choix)
    // créer un middleware générant le <thead> à partir des clés du premier élément du tableau
    // ne pas oublier :
    // - l'appel à la fonction d'enchaînement :-P
    // - que tableau.push() peut prendre plusieurs arguments pour ajouter plusieurs éléments d'un seul coup

    generateBody(i, o, next){
        o.push("<tbody>");
        i.forEach(row => {
            o.push(`<tr>`);
            //La fonction forEach ne fonctionne que sur des tableaux or row est un objet
            //Astuce : nous, ce qui nous intéresse c'est uniquement les valeurs du tableau, ici les clés osef
            //En js il existe un moyen de récupérer toutes les valeurs d'un objet sous forme de array
            //la technique object.values(object)
            Object.values(row).forEach(value =>{
                o.push(`<td>${value}</td>`);

            });

            o.push(`</tr>`);
        });



        o.push(`</tbody>`);
        next();
    },

    generateHead(i, o, next){
        o.push(`<thead>`);
        o.push(`<tr>`);
        //Ce qu'on veut c'est récupérer les clés du premier objet du tableau
        //Du coup on a besoin que d'un élément des éléments  le premier car ils ont tous les meme clés à priori
        //i[0] me donne le premier objet de ka kiste en input
        //Object.keys(object) me donne un tableau constitué des clés de l'objet
        //Ensuite on boucle pour avoir une cellule par clé
        Object.keys(i[0]).forEach(key =>{
            o.push(`<th>${key}</th>`);
        })

        o.push(`</tr>`);
        o.push(`</thead>`);
        next();

    },

    // exo en autonomie 2
    // générer, via un middleware, un <tfoot> contenant les sommes des colonnes numériques
    // se baser sur le type des données de la première ligne pour décider de calculer la somme de la colonne
    generateFoot(i, o, next){
        o.push(`<tfoot>`);
        o.push(`<tr>`);
        o.push(`<th>Totaux</th>`);

        let isFisrtColumn = true;

        for (const key in i[0]) {
            //Ici, on se retrouve avec un nom de clé
            //selon certain critère on va vouloir faire un traitement différent
            //  -si on est sur la première clé on ne fait rien car on a déja géré la premiere cellule du footer
            //  -si non si, les valeurs associées à la clé ne sont pas des nombres on écrit un -
            //  -sinon on calcule la sonne en parcourant les différents éléments, puis on écrit la somme
            
            if(isFisrtColumn){
                isFisrtColumn = false; //on s'assure de ne plus jamais passer la => on ne sera jamais plus sur la première colonne
                
                //Le mot clé continue est une sorte de cheat code pour sauter la fin de la boucle et aller à l'occurence suivante
                continue;
            }

            if(isNaN(i[0][key])){
                o.push(`<td>-</td>`);
            }else {
                //On va parcourir tous les naims pour calculer la somme des colonnes
                //Option 1

                let sum = 0;
                i.forEach(row => {
                    sum += row[key];
                });
                o.push(`<td>${sum}</td>`);

                // Option 2
                //const sum = i.reduce((accumulator, row) => accumulator + row[key], 0)
                //o.push(`<td>${Math.round(sum*100)/100)}</td>`);
            }
            
            

        };


        o.push(`</tr>`)
        o.push(`</tfoot>`);
        next();
    },



}
