import {loadPicture, loadResource} from "./photoloader.js";
import {displayFullPhoto} from "./ui.js";
import {display_gallery} from "./gallery_ui";

(async () => {

    console.info("Rémi Choffat - TP Photobox");

    // Récupère la photo dont l'ID est passé dans l'URL
    const idPicture = window.location.hash ? window.location.hash.substr(1) : 105;
    const photo = await loadPicture(idPicture);

    await display_gallery();

    if (photo) {
        // Si une photo a été chargée, on l'affiche
        await displayFullPhoto(photo);
    } else {
        // Si la photo n'a pas pu être chargée, on affiche un message d'erreur
        document.querySelector("#la_photo").innerHTML = "<div class='notification is-danger'>Erreur lors du chargement de la photo " + idPicture + "</div>";
    }


    /**
     * Charge la catégorie d'une photo
     * @param photo L'objet photo dont on veut charger la catégorie
     * @returns {Promise<*>} Une promesse qui se résout avec les données de la catégorie
     */
    function getCategorie(photo) {
        return loadResource(photo.links.categorie.href);
    }


    /**
     * Charge les commentaires d'une photo
     * @param photo L'objet photo dont on veut charger les commentaires
     * @returns {Promise<*>} Une promesse qui se résout avec les données des commentaires
     */
    function getComments(photo) {
        return loadResource(photo.links.comments.href);
    }

})();

// Galerie de photo : si on est à la photo 1 et qu'on fait précédent, doit afficher la dernière photo. Pareil pour la dernière qui va à la première