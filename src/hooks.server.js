import { redirect } from '@sveltejs/kit';
import { validateToken } from '$lib/server/token';
import model from '$lib/server/db/model/auth';
import setSchema from '$lib/server/db/init';

setSchema();

const PUBLIC_ROUTES = [];
const UNAUTH_ROUTES = ['/login'];
const INIT_ROUTE = '/init';
const API_ROUTE = '/api';

export const handle = async ({ event, resolve }) => {
    const { cookies, url } = event;
    const currentPath = url.pathname;
    const isTokenValid = validateToken(cookies);

    const lang = cookies.get('lang');
    const validLang = lang && ['en', 'id'].includes(lang);

    if (!validLang) {
        cookies.set('lang', 'en', {
            path: '/',
            httpOnly: true,
        });
    }

    event.locals.lang = validLang ? lang : 'en';

    let user = null;
    let isAuthenticated = false;

    if (isTokenValid) {
        user = await model.getData(isTokenValid.id);
        isAuthenticated = !!user;
    }

    if (!isAuthenticated) {
        cookies.delete('access_token', { path: '/' });

        if (!user) {
            const isApiRoute = currentPath.startsWith(API_ROUTE);
            const isInitRoute = currentPath === INIT_ROUTE;

            if (!isApiRoute && !isInitRoute) {
                throw redirect(303, INIT_ROUTE);
            }

            return resolve(event);
        }

        if (
            PUBLIC_ROUTES.includes(currentPath) ||
            UNAUTH_ROUTES.includes(currentPath)
        ) {
            return resolve(event);
        }

        throw redirect(303, '/login');
    }

    if (UNAUTH_ROUTES.includes(currentPath)) {
        throw redirect(303, '/');
    }

    return resolve(event);
};
