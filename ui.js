import Handlebars from 'handlebars';
import {API_ENDPOINT, WEBETU} from "./config.js";
import {loadAllComments, loadPicture, loadResource} from "./photoloader";

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
Handlebars.registerHelper('sort-by-date-desc', function (comments) {
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
 * @param idPhoto L'identifiant de la photo associée
 */
export function displayComments(comments, idPhoto) {
    const commentsTemplate = document.querySelector('#commentsTemplate').innerHTML;
    const template = Handlebars.compile(commentsTemplate);
    document.querySelector("#les_commentaires").innerHTML = template({
        comments: comments,
        idPhoto: idPhoto,
    });
}


/**
 * Affiche la photo complète avec ses commentaires et sa catégorie
 * @param photo L'objet photo à afficher
 * @returns {Promise<void>} Une promesse qui se résout lorsque la photo est affichée
 */
export async function displayFullPhoto(photo) {

    // Affiche l'image
    displayPicture(photo);

    // Catégorie
    const category = await loadResource(photo.links.categorie.href);
    if (category) {
        displayCategory(category);
    } else {
        document.querySelector("#la_categorie").innerHTML = "<div class='notification is-danger'>Erreur lors du chargement de la catégorie</div>";
    }

    // Commentaires
    const comments = await loadAllComments(photo.links.comments.href);
    if (comments) {
        displayComments(comments, photo.photo.id);
    } else {
        document.querySelector("#les_commentaires").innerHTML = "<div class='notification is-danger'>Erreur lors du chargement des commentaires</div>";
    }

    // Gère l'affichage du formulaire de commentaire
    const form = document.getElementById('commentaires-form');
    if (!form) return;

    const boutonValider = document.getElementById('btnAjouterCommentaire');

    document.getElementById('btnAfficherForm').onclick = () => {
        form.style.display = 'block';
        document.getElementById('btnAfficherForm').style.display = 'none';
    }

    // À l'envoi du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        boutonValider.classList.add('is-loading');
        boutonValider.setAttribute('disabled', 'disabled');

        // Récupère les valeurs des champs du formulaire
        const photoId = form.dataset.photoid;
        const pseudo = document.getElementById('nom').value;
        const titre = document.getElementById('titre').value;
        const contenu = document.getElementById('commentaire').value;

        // Vérifie que les champs ne contiennent pas de caractères non valides
        const regex = /[^\x20-\x7E]/;
        if (regex.test(pseudo) || regex.test(titre) || regex.test(contenu)) {
            alert('Un des champs contient un caractère non valide (emoji, caractères spéciaux...)');
            boutonValider.classList.remove('is-loading');
            boutonValider.removeAttribute('disabled');
            return;
        }

        // Construit le corps de la requête
        const body = {
            pseudo: pseudo,
            titre: titre,
            content: contenu,
        };

        // Envoie la requête POST pour ajouter le commentaire
        const response = await fetch(`${API_ENDPOINT}/${photoId}/comments`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(body)
        });

        // Vérifie la réponse
        if (response.ok) {
            const photoCourante = await loadPicture(photoId);
            await displayFullPhoto(photoCourante);
            alert('Commentaire ajouté !');
            form.reset();
        } else {
            alert('Erreur lors de l\'ajout du commentaire');
        }

        boutonValider.classList.remove('is-loading');
        boutonValider.removeAttribute('disabled');
    });
}


/**
 * Affiche la lightbox avec la photo sélectionnée
 * @param photo L'objet photo à afficher
 * @param onPrev Action à exécuter lorsque l'utilisateur clique sur le bouton Précédent
 * @param onNext Action à exécuter lorsque l'utilisateur clique sur le bouton Suivant
 */
export function openLightbox(photo, onPrev, onNext) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImage');
    img.src = `${WEBETU}/${photo.photo.url.href}`;
    img.alt = photo.photo.titre;

    lightbox.classList.add('is-active')

    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';

    document.getElementById('closeLightbox').onclick = () => lightbox.classList.remove('is-active');
    document.getElementById('prevLightbox').onclick = onPrev;
    document.getElementById('nextLightbox').onclick = onNext;

    // Ferme la fenêtre modale si on clique sur le fond
    lightbox.querySelector('.modal-background').onclick = () => lightbox.classList.remove('is-active');
}
