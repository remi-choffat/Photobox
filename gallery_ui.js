import Handlebars from 'handlebars';
import {PHOTOBOX_URL, WEBETU} from "./config";
import {load} from "./gallery";
import {loadPicture} from "./photoloader";
import {displayFullPhoto, openLightbox} from "./ui";


/**
 * Affiche la galerie de photos
 * @param link {string} L'URL de la galerie à afficher
 * @returns {Promise<void>} Une promesse qui se résout lorsque la galerie est affichée
 */
export async function display_gallery(link = PHOTOBOX_URL + "/?page=1&size=10") {

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
            const photoId = parseInt(figure.getAttribute("data-photoid"));
            const photos = galerie.photos;
            let idx = photos.findIndex(p => p.photo.id === photoId);

            async function show(idx) {
                // Récupère la photo
                const photo = await loadPicture(photos[idx].photo.id);
                if (photo) {
                    // Affiche la photo dans la lightbox
                    openLightbox(photo,
                        () => {
                            if (idx > 0) show(idx - 1); else show(photos.length - 1);
                        },
                        () => {
                            if (idx < photos.length - 1) show(idx + 1); else show(0);
                        }
                    );
                    // Affiche la photo dans la page
                    await displayFullPhoto(photo);
                } else {
                    document.querySelector("#la_photo").innerHTML = "<div class='notification is-danger'>Erreur lors du chargement de la photo " + photoId + "</div>";
                }
            }

            await show(idx);
        });
    });

    // Définit un handler sur les boutons Précédent et Suivant
    const previous = document.querySelector("#previous");
    const next = document.querySelector("#next");
    if (!previous.dataset.liengalerie || previous.dataset.liengalerie === link) {
        previous.style.visibility = "hidden";
    }
    if (!next.dataset.liengalerie || next.dataset.liengalerie === link) {
        next.style.visibility = "hidden";
    }
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