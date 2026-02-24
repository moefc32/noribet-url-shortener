import { redirect } from '@sveltejs/kit';
import decodeToken from '$lib/server/token';
import modelAuth from '$lib/server/db/model/auth';
import modelURL from '$lib/server/db/model/url';

export async function load({ cookies }) {
    const access_token = await cookies.get('access_token');
    if (!access_token) return;

    const decoded_token = decodeToken(access_token);
    const isUserPresent = await modelAuth.getData(decoded_token?.id);
    const response = await modelURL.getData();

    return {
        access_token,
        user_email: isUserPresent?.email,
        contents: response,
    };
}
