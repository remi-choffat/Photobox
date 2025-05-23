import {API_ENDPOINT, WEBETU} from "./config.js";

/**
 * Charge une photo à partir de l'API
 * @param idPicture L'identifiant de la photo à charger
 * @returns {Promise<any>} Une promesse qui se résout avec les données de la photo
 */
export function loadPicture(idPicture) {
    return fetch(`${API_ENDPOINT}/${idPicture}`,
        {
            credentials: 'include',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement de la photo :', error);
        });
}


/**
 * Charge une ressource à partir de l'API
 * @param uri L'URI de la ressource à charger
 * @returns {Promise<any>} Une promesse qui se résout avec les données de la ressource
 */
export function loadResource(uri) {
    return fetch(`${WEBETU}${uri}`, {
        credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement de la ressource :', error);
        });
}