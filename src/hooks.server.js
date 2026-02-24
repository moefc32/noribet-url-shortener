import { redirect } from '@sveltejs/kit';
import { validateToken } from '$lib/server/token';
import model from '$lib/server/db/model/auth';
import setSchema from '$lib/server/db/init';

setSchema();

const UNAUTH_ROUTES = ['/login'];
const INIT_ROUTE = '/init';

export const handle = async ({ event, resolve }) => {
    const { cookies, url } = event;
    const currentPath = url.pathname;

    const isTokenValid = validateToken(cookies);
    const isUserExists = await model.getData(isTokenValid?.id);
    const isAuthenticated = !!(isTokenValid && isUserExists);

    if (!isTokenValid || !isUserExists) {
        cookies.delete('access_token', { path: '/' });
    }

    if (isUserExists === false) {
        const isApiRoute = currentPath.startsWith('/api');
        const isInitRoute = currentPath === INIT_ROUTE;

        if (!isApiRoute && !isInitRoute) {
            throw redirect(303, INIT_ROUTE);
        }

        return resolve(event);
    }

    const isUnauthRoute = UNAUTH_ROUTES.includes(currentPath);

    if (isAuthenticated && isUnauthRoute) {
        throw redirect(303, '/');
    }

    if (!isAuthenticated && currentPath === '/') {
        throw redirect(303, '/login');
    }

    return resolve(event);
};
