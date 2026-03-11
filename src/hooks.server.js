import { redirect } from '@sveltejs/kit';
import setSchema from '$lib/server/db/init';
import modelAuth from '$lib/server/db/model/auth';
import modelURL from '$lib/server/db/model/url';
import token from '$lib/server/token';

setSchema();

const PRIVATE_ROUTES = ['/api/auth'];
const UNAUTH_ROUTES = ['/login'];
const INIT_ROUTE = '/init';

function isRouteMatch(routes, path) {
    return routes.some((route) => path.startsWith(route));
}

export const handle = async ({ event, resolve }) => {
    const { cookies, url } = event;
    const currentPath = url.pathname;

    try {
        const isTokenValid = token.validate(cookies);

        const isShortUrl =
            await modelURL.validateShortUrl(currentPath.slice(1));
        if (isShortUrl.length) return resolve(event);

        const lang = cookies.get('lang');
        const validLang = lang && ['en', 'id'].includes(lang);

        if (!validLang) {
            cookies.set('lang', 'en', {
                path: '/',
                httpOnly: true,
            });
        }

        event.locals.lang = validLang ? lang : 'en';
        event.locals.unauthRoutes = UNAUTH_ROUTES;

        if (isTokenValid) {
            cookies.set('__session_active', '1', {
                path: '/',
                httpOnly: false,
            });
        } else {
            cookies.delete('__session_active', {
                path: '/',
            });
        }

        let user = await modelAuth.getData(isTokenValid.id);
        let isAuthenticated = false;

        if (isTokenValid) {
            isAuthenticated = !!user;
        }

        if (!isAuthenticated) {
            token.purge(cookies, [
                'access_token',
                'refresh_token',
            ]);

            if (!user && !(currentPath === INIT_ROUTE)) {
                throw redirect(303, INIT_ROUTE);
            }

            if (
                currentPath !== '/' ||
                isRouteMatch(PRIVATE_ROUTES, currentPath)
            ) {
                return resolve(event);
            }

            throw redirect(303, '/login');
        }

        if (isRouteMatch(UNAUTH_ROUTES, currentPath)) {
            throw redirect(303, '/');
        }

        return resolve(event);
    } catch (e) {
        if (e.status && e.status >= 300 && e.status < 400) {
            throw e;
        }

        console.error('\n--- CRITICAL HOOK ERROR ---\n');
        console.error(e);

        return await resolve(event);
    }
};
