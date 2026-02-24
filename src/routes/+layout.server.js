import model from '$lib/server/db/model/auth';
import decodeToken from '$lib/server/token';

export async function load({ cookies }) {
    const access_token = cookies.get('access_token');
    const decoded_token = decodeToken(access_token);
    if (!decoded_token) return;

    const userData = await model.getData(decoded_token?.id);

    if (userData) delete userData.password;

    return {
        userData,
    };
}
