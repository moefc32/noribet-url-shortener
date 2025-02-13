import { redirect } from '@sveltejs/kit';
import decodeToken from '$lib/server/token';
import modelAuth from '$lib/server/model/auth';
import modelURL from '$lib/server/model/url';

export async function load({ cookies }) {
    const access_token = await cookies.get('access_token');
    const decoded_token = decodeToken(access_token);
    const isUserPresent = await modelAuth.getData(decoded_token?.id);

    if (!decoded_token && !isUserPresent)
        throw redirect(303, '/init');
    if (!access_token) return;

    const response = await modelURL.getData();

    return {
        access_token,
        user_email: isUserPresent?.email,
        contents: response,
    };
}
