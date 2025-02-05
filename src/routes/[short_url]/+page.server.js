import { error, redirect } from '@sveltejs/kit';
import { decodeToken } from '$lib/server/token';
import modelAuth from '$lib/server/model/auth';
import modelURL from '$lib/server/model/url';

export async function load({ cookies, params, request, getClientAddress }) {
    const { short_url } = params;
    const stats = short_url.endsWith('~');

    if (!stats) {
        const response = await modelURL.getLongURL({
            short_url,
            ref: request.headers.get('referer'),
            agent: request.headers.get('user-agent'),
            address: getClientAddress(),
        })
        const long_url = response[0]?.long_url;

        if (long_url) throw redirect(302, long_url);
    } else {
        const access_token = await cookies.get('access_token');
        const decoded_token = await decodeToken(access_token);
        const isUserPresent = await modelAuth.getData(decoded_token?.id);

        if (!access_token && !isUserPresent) throw redirect(302, '/init');
        if (!access_token) throw error(404, 'Not Found');

        const response = await modelURL.getData(short_url.replace(/~$/, ''));

        return {
            access_token,
            user_email: isUserPresent?.email,
            contents: {
                short_url: short_url.replace(/~$/, ""),
                contents: response,
            },
        };
    }
}
