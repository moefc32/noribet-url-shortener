import { createHash } from "crypto";
import { decodeToken } from '$lib/server/token';
import modelAuth from '$lib/server/model/auth';
import modelEnv from '$lib/server/model/env';

export async function load({ cookies, url }) {
    const env = url.searchParams.get('env');
    const access_token = await cookies.get('access_token');
    const decoded_token = await decodeToken(access_token);
    const isUserPresent = await modelAuth.getData(decoded_token?.id);

    if (!access_token)
        return {
            access_token,
            is_registered: !!isUserPresent,
        };

    const hashed_email = !!isUserPresent
        ? createHash("sha256")
            .update(isUserPresent?.email)
            .digest("hex")
        : null;

    const all_contents = await modelEnv.getData();
    const opened_contents = env ? await modelEnv.getData(env) : {};

    return {
        access_token,
        is_registered: !!isUserPresent,
        user_email: isUserPresent?.email,
        hashed_email,
        contents: {
            all_contents,
            opened_contents,
        },
    };
}
