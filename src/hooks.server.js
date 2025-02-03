import { VITE_APP_NAME } from '$env/static/private';
import { json, redirect } from '@sveltejs/kit';
import { validateToken } from '$lib/server/token';
import { schema } from '$lib/server/schema';

export const handle = async ({ event, resolve }) => {
    await schema();

    const currentPath = event.url.pathname;
    const cookies = event.cookies;

    const isTokenValid = await validateToken(cookies);

    if (!isTokenValid) {
        cookies.delete('access_token', { path: '/' });
    }

    const publicPaths = ['/', '/api', '/api/auth'];

    if (publicPaths.some(path => currentPath.startsWith(path))) {
        return await resolve(event);
    }

    return json({
        application: VITE_APP_NAME,
        message: 'Unauthorized access, please login!',
    }, {
        status: 401,
    });
}
