import {API_ENDPOINT} from "./config";
import {loadResource} from "./photoloader";

export let galerie;

// Renvoie la liste de toutes les photos
export async function load(link) {
    galerie = await loadResource(link);
    return galerie;
}