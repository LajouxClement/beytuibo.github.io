import { Carte } from './Carte.js';


async function main() {

    function displayFusionCarteFusion(pseudo) {
        document.getElementById("afficheur").innerHTML = ""
        document.getElementById("formulaire").innerHTML = "";

        let urlInventaireUser = "https://zunivers-api.zerator.com/public/inventory/" + pseudo;
        let inventaire = rangerTableauDeCarte(httpGet(urlInventaireUser));

        let urlFusion = 'https://zunivers-api.zerator.com/public/fusion';
        let fusion = rangerTableauDeFusion(httpGet(urlFusion), inventaire);
        displayFusion(fusion);

    }

    function displayFusion(tableau) {
        for (var i = 0; i < tableau.length; i++) {
            let divElement = document.createElement("div");
            divElement.className = "wrapper-img"
            for (var y = 0; y < tableau[i].length; y++) {
                if (y == 0) {
                    tableau[i][y].appendTo(divElement, true);
                } else {
                    tableau[i][y].appendTo(divElement);
                }

            }
            document.getElementById("afficheur").appendChild(divElement);
        }

    }

    /**
     * 
     * @param {Object} tableauJson
     * @returns tableau de carte
     */
    function rangerTableauDeCarte(tableauJson) {
        let cartes = [];
        for (var i = 0; i < tableauJson.length; i++) {
            let c = new Carte(
                tableauJson[i].item.name,
                tableauJson[i].item.identifier,
                tableauJson[i].item.urls,
                tableauJson[i].isGolden,
                tableauJson[i].quantity,
                tableauJson[i].items
            );
            cartes.push(c);
        }
        return cartes;
    }

    /**
     * 
     * @param {Object} tableauJson
     * @param {Object} inventaire
     * @returns tableau de carte
     */
    function rangerTableauDeFusion(tableauJson, inventaire) {
        let fusion = [];
        let current = null;
        for (var i = 0; i < tableauJson.length; i++) {
            let cartes = [];
            let c = new Carte(
                tableauJson[i].item.name,
                tableauJson[i].item.identifier,
                tableauJson[i].item.urls
            );
            let cnt = 0;
            if (c.identifier == current) {
                cnt++;
            } else {
                cnt++;
                current = c.identifier;
            }
            let resultat = inventaire.find(cardToFind => cardToFind.identifier == c.identifier);
            if (resultat === undefined) {
                c.quantity = 0;
            } else {
                c.quantity = resultat.quantity;
            }
            c.quantityNeeded = cnt;
            cartes.push(c);
            cnt = 0;
            current = null;
            for (var y = 0; y < tableauJson[i].items.length; y++) {
                let carte = new Carte(
                    tableauJson[i].items[y].name,
                    tableauJson[i].items[y].identifier,
                    tableauJson[i].items[y].urls,
                );
                if (cnt == 0) {
                    cnt = carte.compterElement(tableauJson[i].items, carte.identifier);
                    let resultat = inventaire.find(cardToFind => cardToFind.identifier == carte.identifier);
                    if (resultat === undefined) {
                        carte.quantity = 0;
                    } else if (resultat.isGolden) {
                        carte.quantity = 0;
                    } else {
                        carte.quantity = resultat.quantity;
                    }
                    carte.quantityNeeded = cnt;
                    cartes.push(carte);
                    cnt--;
                } else {
                    cnt--;
                }
            }
            fusion.push(cartes);
        }
        return fusion;
    }

    /**
     * 
     * @param {string} theUrl l'url pour récupérer le fichier json
     * @returns tableau json
     */
    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        return JSON.parse(xmlHttp.responseText);
    }

    /**
     * on ecoute l'event onclick sur le bouton
     */
    let btnEnvoi = document.getElementById("envoi");
    btnEnvoi.addEventListener("click", getPseudoFromInput);

    /**
     * fonction qui récupère le text du champ pseudo et qui modifie la variable local;
     */

    function getPseudoFromInput() {
        let nom = document.getElementById("autoComplete").value;
        if (nom != "") {
            let pseudo = capitalize(nom.replace("#", "%23"));
            displayFusionCarteFusion(pseudo);
        }
    }

    function capitalize(s) {
        return s && s[0].toUpperCase() + s.slice(1);
    }

    function retourPseudo(word) {
        let mots = [];
        for (var i = 0; i < word.length; i++) {
            mots.push(word[i].discordUserName);
        }
        return mots;
    }


    let nom = document.getElementById("autoComplete");
    let once = false;
    nom.addEventListener("keydown", retourUrl);


    function retourUrl() {
        let divForm = document.getElementById("formulaire");
        let pseudo = document.getElementById("autoComplete").value;
        if (!pseudo) {
            pseudo = "a";
        }

        let urlword = 'https://zunivers-api.zerator.com/public/user/autocomplete/' + pseudo;
        let word = retourPseudo(httpGet(urlword));

        if (word.length == 0) {
            if (!this.once) {
                divForm.innerHTML = "";
                let pseudoElement = document.createElement('p');
                pseudoElement.innerHTML = "Plus de lettre";
                divForm.appendChild(pseudoElement);
                this.once = true;
            }
        } else {
            divForm.innerHTML = "";
            for (var i = 0; i < word.length; i++) {
                let pseudoElement = document.createElement('p');
                pseudoElement.innerHTML = word[i];
                pseudoElement.classList.add('pseudo-button');
                divForm.appendChild(pseudoElement);
            }
            this.once = false;
        }

    }

    const container = document.querySelector('#formulaire');

    // Click handler for entire DIV container
    container.addEventListener('click', function(e) {
        // But only alert for elements that have an alert-button class
        if (e.target.classList.contains('pseudo-button')) {
            let pseudo = document.getElementById("autoComplete");
            pseudo.value = e.target.innerHTML;
            console.log(e.target.innerHTML);
        }
    });
}
main();