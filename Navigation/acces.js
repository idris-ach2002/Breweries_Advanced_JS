
import { Conteneur, listBreweries } from "../Collection_information/index.js";


const fonctionnalite = {
    setContent: function() {
        document.querySelector('body').innerHTML = "";
        (new Conteneur("body", "div", "container", "principal")).noeudCreation();
        (new Conteneur(document.querySelector('div[id="principal"]'), 'h1', "", "title")).noeudCreation();
        (new Conteneur(document.querySelector('div[id="principal"]'), 'div', "", "list-container")).noeudCreation(); 
        document.getElementById("title").innerHTML = "Breweries";

        lobby.options();
    }
};


//récupérer tous les enregistrements pour les afficher

async function getData() {
    const response = await fetch("http://localhost:3000/brewery", {method:"GET"});
    const promise = await response.json();
    listBreweries.length = 0;
    promise.forEach(brewery => listBreweries.push(brewery));
}

const lobby = {
    options : async () => {
        await getData();

        let myContent = "";
        listBreweries.map((brewery) => {
            myContent += "<ul>\n";
            for(const key in brewery) {
                if(key === "brewery_website")
                    myContent += `<li>${key} : <a href="${brewery[key]}">Link to ${brewery["brewery_name"]}</a></li>\n`;
                else
                    myContent += `<li>${key} : ${brewery[key]}</li>\n`;
            }
            myContent += "</ul>\n";
        })

        document.getElementById('list-container').innerHTML = myContent;
    }
}


fonctionnalite.setContent();