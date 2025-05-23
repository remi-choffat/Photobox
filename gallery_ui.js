import Handlebars from 'handlebars';
import {PHOTOBOX_URL, WEBETU} from "./config";
import {load} from "./gallery";
import {loadPicture} from "./photoloader";
import {displayFullPhoto} from "./ui";


/**
 * Affiche la galerie de photos
 * @param link {string} L'URL de la galerie à afficher
 * @returns {Promise<void>} Une promesse qui se résout lorsque la galerie est affichée
 */
export async function display_gallery(link = PHOTOBOX_URL) {

    const galerie = await load(link);
    const galleryTemplate = document.querySelector('#galleryTemplate').innerHTML;
    const template = Handlebars.compile(galleryTemplate);
    document.querySelector("#galerie").innerHTML = template({
        galerie: galerie,
        basepath: WEBETU.endsWith('/') ? WEBETU : WEBETU + '/',
    });

    // Ajoute un handler sur chaque vignette (figure)
    document.querySelectorAll("figure[data-photoid]").forEach(figure => {
        figure.addEventListener("click", async function () {
            const photoId = figure.getAttribute("data-photoid");
            const photo = await loadPicture(photoId);
            if (photo) {
                await displayFullPhoto(photo);
            } else {
                document.querySelector("#la_photo").innerHTML = "<div class='notification is-danger'>Erreur lors du chargement de la photo " + photoId + "</div>";
            }
        });
    });

    // Définit un handler sur les boutons Précédent et Suivant
    const previous = document.querySelector("#previous");
    const next = document.querySelector("#next");
    previous.addEventListener("click", function () {
        const link = previous.dataset.liengalerie;
        if (link) {
            display_gallery(link);
        }
    });
    next.addEventListener("click", function () {
        const link = next.dataset.liengalerie;
        if (link) {
            display_gallery(link);
        }
    });

}