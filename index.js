const api = "https://api.openbrewerydb.org/breweries";

// on tableau pour le stockage des informations liées aux brasseries 
let myBreweries = [];


//---------------------------------------------------------------------------//
/*cette classe permet de creer un element html avec ou sans (une classe
et un identifiant) et permet de l'injecter à un autre élément appellé
pere tout en prenant on considération la dynamicité des éléments
*/

class Conteneur {
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
function remplirConteneur() {
    (new Conteneur("body", "div", "app-container", "ctn-principal")).noeudCreation();
    (new Conteneur(document.querySelector('div[id="ctn-principal"]'), 'h1', "", "title")).noeudCreation();
    (new Conteneur(document.querySelector('div[id="ctn-principal"]'), 'img', "", "image")).noeudCreation();
    (new Conteneur(document.querySelector('div[id="ctn-principal"]'), 'button', "", "valider")).noeudCreation();

    title.innerHTML = "Are you serching For a Beer"
    image.src = "./Image/br1.jpg";
    image.alt = "Beer !!!";
    valider.innerHTML = "SUBMIT";


}

remplirConteneur();



//---------------------------------------------------------------------------//
/*
    production d'une requête sur l'api afin de recupérer les données 
*/
async function fetchData() {
    const response = await fetch(api);
    const data = await response.json();
    myBreweries = data;
}


//---------------------------------------------------------------------------//
//permet de supprimer tous les record (s) de la table locale  brewery

async function deleteAllBreweries() {
    const response = await fetch("http://localhost:3000/brewery");
    const breweries = await response.json();

    for(brewery of breweries) {
        await fetch(`http://localhost:3000/brewery/${brewery.id}`, {method: "DELETE"});
    }
}



//---------------------------------------------------------------------------//
//permet d'insérer des record (s) la table locale  brewery à l'issue de la récupération 
//des données dans un tableau myBreweries puis on itère sur se dernier
async function insertionBase() {
    await fetchData();
    myBreweries.forEach(async (br) => { 
        
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

//si le bouton est clické on prend pas de risque de rajouter des doublons 
//on nétoie la table brewery pui on réinsère les données
//cas ou un utilisateur tente plusieurs clicks

valider.addEventListener("click", async () => { 

    // Appelle la fonction pour supprimer tous les enregistrements
    await deleteAllBreweries();  // Assure-toi que la suppression est terminée
    // Ensuite, appelle la fonction pour insérer les nouveaux enregistrements
    await insertionBase();  // Ne commence l'insertion qu'après la suppression
});



