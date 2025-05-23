import Handlebars from 'handlebars';
import {WEBETU} from "./config";
import {load} from "./gallery";

export async function display_gallery(link = "/www/canals5/phox/api/photos") {
    console.log("Chargement de " + link);
    const galerie = await load(link);
    const galleryTemplate = document.querySelector('#galleryTemplate').innerHTML;
    const template = Handlebars.compile(galleryTemplate);
    document.querySelector("#galerie").innerHTML = template({
        galerie: galerie,
        basepath: WEBETU.endsWith('/') ? WEBETU : WEBETU + '/',
    });
    // Définit un handler sur toutes les photos
    const photos = document.querySelectorAll(".image");
    photos.forEach(photo => {
        photo.addEventListener("click", function () {
            window.location.hash = photo.dataset.photoid;
            window.location.reload();
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