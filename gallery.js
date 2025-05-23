import {loadResource} from "./photoloader";

export let galerie;

/**
 * Charge la galerie de photos
 * @returns {Promise<*>} Une promesse qui se résout avec les données de la galerie
 */
export async function load(link) {
    galerie = await loadResource(link);
    return galerie;
}