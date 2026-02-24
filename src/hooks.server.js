import { VITE_APP_NAME } from '$env/static/private';
import { json, redirect } from '@sveltejs/kit';
import { validateToken } from '$lib/server/token';
import { checkIsUserExists } from '$lib/server/sqlite';
import setSchema from '$lib/server/schema';

setSchema();

export const handle = async ({ event, resolve }) => {
    const { cookies, url } = event;
    const currentPath = url.pathname;

    const isTokenValid = validateToken(cookies);
    const isUserExists = isTokenValid
        && checkIsUserExists(isTokenValid.id);

    if (!isTokenValid || !isUserExists) {
        cookies.delete('access_token', { path: '/' });
    }

    return resolve(event);
}
