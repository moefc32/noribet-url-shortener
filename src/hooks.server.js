import { redirect } from '@sveltejs/kit';
import setSchema from '$lib/server/db/init';
import model from '$lib/server/db/model/auth';
import token from '$lib/server/token';

setSchema();

const PUBLIC_ROUTES = [];
const UNAUTH_ROUTES = ['/login'];
const PUBLIC_API_ROUTES = ['/api/auth'];
const INIT_ROUTE = '/init';

function isRouteMatch(routes, path) {
    return routes.some((route) => path.startsWith(route));
}

export const handle = async ({ event, resolve }) => {
    const { cookies, url } = event;
    const currentPath = url.pathname;
    const isTokenValid = token.validate(cookies);

    const lang = cookies.get('lang');
    const validLang = lang && ['en', 'id'].includes(lang);

    if (!validLang) {
        cookies.set('lang', 'en', {
            path: '/',
            httpOnly: true,
        });
    }

    event.locals.lang = validLang ? lang : 'en';

    let user = await model.getData(isTokenValid.id);
    let isAuthenticated = false;

    if (isTokenValid) {
        isAuthenticated = !!user;
    }

    if (!isAuthenticated) {
        token.purge(cookies, [
            'access_token',
            'refresh_token',
        ]);

        if (!user) {
            const isApiRoute =
                isRouteMatch(PUBLIC_API_ROUTES, currentPath);
            const isInitRoute = (currentPath === INIT_ROUTE);

            if (!isApiRoute && !isInitRoute) {
                throw redirect(303, INIT_ROUTE);
            }

            return resolve(event);
        }

        if (
            isRouteMatch(PUBLIC_ROUTES, currentPath) ||
            isRouteMatch(UNAUTH_ROUTES, currentPath) ||
            isRouteMatch(PUBLIC_API_ROUTES, currentPath)
        ) {
            return resolve(event);
        }

        throw redirect(303, '/login');
    }

    if (isRouteMatch(UNAUTH_ROUTES, currentPath)) {
        throw redirect(303, '/');
    }

    return resolve(event);
};
