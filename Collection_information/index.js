export let listBreweries = [];

const api = "https://api.openbrewerydb.org/breweries";





//---------------------------------------------------------------------------//
/*cette classe permet de creer un element html avec ou sans (une classe
et un identifiant) et permet de l'injecter à un autre élément appellé
pere tout en prenant on considération la dynamicité des éléments
*/

export class Conteneur {
    constructor(pere, noeud, cl, id) {
        this.pere = pere;
        this.noeud = noeud;
        this.cl = cl;
        this.id = id;
    }

    addId(element) {
        element.id = this.id;
    }

    noeudCreation(){
        const appContainer = document.createElement(this.noeud);
        if(this.cl != "")
            appContainer.classList.add(this.cl);
        if(this.id != "")
            this.addId(appContainer)
        if(typeof this.pere === "string")
            document.querySelector(this.pere).appendChild(appContainer);
        else
            this.pere.appendChild(appContainer);
    }
}
/*
permet de creer cette structure
<div class="ctn-principal" id="ctn-principal">
    <h1 id="title">Are you serching For a Beer</title>
    <img src="./br1.jpg" alt="Beer !!!"/>
    <button id="valider">SUBMIT</button>
    </div>
    
    sans passer par html directement via la classe Conteneur
    et pour les attributs tels que src alt meme le content des balises
    on utilisera les id en dûr 
    */
   export function remplirConteneur() {
       (new Conteneur("body", "div", "app-container", "ctn-principal")).noeudCreation();
       (new Conteneur(document.querySelector('div[id="ctn-principal"]'), 'h1', "", "title")).noeudCreation();
       (new Conteneur(document.querySelector('div[id="ctn-principal"]'), 'img', "", "image")).noeudCreation();
       (new Conteneur(document.querySelector('div[id="ctn-principal"]'), 'a', "", "valider")).noeudCreation();
       
       document.getElementById("title").innerHTML = "Are you serching For a Beer";
       document.getElementById("image").src = "../Image/br1.jpg";
       document.getElementById("image").alt = "Beer !!!";
       const valider = document.getElementById("valider");
       valider.setAttribute("href", "http://127.0.0.1:5500/Navigation/content.html");
       valider.appendChild(document.createTextNode("SUBMIT"));
       
       
       //si le lien est clické on prend pas de risque de rajouter des doublons 
       //on nétoie la table brewery pui on réinsère les données
       //cas ou un utilisateur tente plusieurs clicks
       
       valider.addEventListener("click", async (event) => { 
           event.preventDefault();
           valider.innerHTML = "WAIT";
           try {
               await deleteAllBreweries();
               await insertionBase();
            } catch (error) {
                console.error("Erreur : ", error);
            }
            
            //Cette méthode ouvre l'URL dans une nouvelle fenêtre ou un nouvel onglet.
            //window.open(`${valider.getAttribute("href")}`);
            
            //__________________________________________________
            
            //_________________________________________________
            
            //La méthode replace() ou window.location.href = "url"
            //remplace la page actuelle dans l'historique de navigation, 
            //ce qui empêche l'utilisateur de revenir à la page précédente
            // en utilisant le bouton "Retour" du navigateur.
            

            
            //window.location.replace(`${valider.getAttribute("href")}`);

            // Redirection juste après le remplissage de la table
            window.open(`${valider.getAttribute("href")}`);
            
            //setTimeout(() => window.location.replace(`${valider.getAttribute("href")}`), 1000);
            valider.innerHTML = "SUBMIT";
        });
    }
    
    
    remplirConteneur();
    
    
    
    //console.log(document.querySelector('div[id="ctn-principal"]').childNodes[0].attributes);
    



//---------------------------------------------------------------------------//
/*
    production d'une requête sur l'api afin de recupérer les données 
*/
async function fetchData() {
    const response = await fetch(api);
    const data = await response.json();
    listBreweries = data;
}


//---------------------------------------------------------------------------//
//permet de supprimer tous les record (s) de la table locale  brewery

async function deleteAllBreweries() {
    const response = await fetch("http://localhost:3000/brewery");
    const breweries = await response.json();

    for(let brewery of breweries) {
        await fetch(`http://localhost:3000/brewery/${brewery.id}`, {method: "DELETE"});
    }
}



//---------------------------------------------------------------------------//
//permet d'insérer des record (s) la table locale  brewery à l'issue de la récupération 
//des données dans un tableau myBreweries puis on itère sur se dernier
async function insertionBase() {
    await fetchData();
    listBreweries.forEach(async (br) => { 
        
         let param =  {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                brewery_name : br.name,
                brewery_adrs : br.address1,
                brewery_city : br.city,
                brewery_country : br.country,
                brewery_phone : br.phone,
                brewery_postal_code : br.postal_code,
                brewery_state : br.state,
                brewery_website : br.website_url
            }),
            credentials: "same-origin"
        };

        await fetch("http://localhost:3000/brewery", param);
});
}













