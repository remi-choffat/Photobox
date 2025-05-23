import Handlebars from 'handlebars';
import {WEBETU} from "./config.js";

// Enregistrement d'un helper Handlebars pour formater les dates
Handlebars.registerHelper('formatDate', function (dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
});

// Enregistrement d'un helper Handlebars pour trier les commentaires par date décroissante
Handlebars.registerHelper('sort-by-date-desc', function(comments) {
    return comments.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
});


/**
 * Affiche une photo dans la page
 * @param image L'objet image à afficher
 */
export function displayPicture(image) {
    const imageTemplate = document.querySelector('#photoTemplate').innerHTML;
    const template = Handlebars.compile(imageTemplate);
    document.querySelector("#la_photo").innerHTML = template({
        image: image,
        img_basepath: WEBETU + "/",
    });
}


/**
 * Affiche une catégorie dans la page
 * @param category L'objet catégorie à afficher
 */
export function displayCategory(category) {
    const categoryTemplate = document.querySelector('#categoryTemplate').innerHTML;
    const template = Handlebars.compile(categoryTemplate);
    document.querySelector("#la_categorie").innerHTML = template({
        category: category,
    });
}


/**
 * Affiche une liste de commentaires dans la page
 * @param comments L'objet commentaires à afficher
 */
export function displayComments(comments) {
    const commentsTemplate = document.querySelector('#commentsTemplate').innerHTML;
    const template = Handlebars.compile(commentsTemplate);
    document.querySelector("#les_commentaires").innerHTML = template({
        comments: comments,
    });
}