import { error } from '@sveltejs/kit';
import model from '$lib/server/model/auth';

export async function load() {
    const isUserPresent = await model.getData();
    if (isUserPresent) throw error(404, 'Not Found');

    return;
}
