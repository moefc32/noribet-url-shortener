import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { randomBytes } from "crypto";
import model from '$lib/server/model/url';
import trimText from '$lib/trimText';
import isValidShortURL from "$lib/isValidShortURL";

function generateShortKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(randomBytes(8), (b) => chars[b % chars.length]).join("");
}

export async function GET({ url }) {
    const search = url.searchParams.get('s');

    try {
        const result = search
            ? await model.searchData(search)
            : await model.getData();

        return json({
            application: VITE_APP_NAME,
            message: !result.length
                ? 'No data found.'
                : `Get all data success.`,
            data: result,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function POST({ request }) {
    const {
        short_url = '',
        long_url = '',
    } = await request.json() || {};

    if (!isValidShortURL(short_url)) {
        return json({
            application: VITE_APP_NAME,
            message: 'Invalid short URL!',
        }, {
            status: 400,
        });
    }

    if (!long_url) {
        return json({
            application: VITE_APP_NAME,
            message: 'Destination URL must be provided!',
        }, {
            status: 400,
        });
    }

    try {
        const result = await model.createData({
            short_url: short_url ? trimText(short_url) : generateShortKey(),
            long_url: trimText(long_url)
        });

        return json({
            application: VITE_APP_NAME,
            message: 'Create new data success.',
            data: result,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function PATCH({ url, request }) {
    const id = url.searchParams.get('id');
    const {
        short_url = '',
        long_url = '',
    } = await request.json() || {};

    if (!isValidShortURL(short_url)) {
        return json({
            application: VITE_APP_NAME,
            message: 'Invalid short URL!',
        }, {
            status: 400,
        });
    }

    try {
        const result = await model.editData({
            short_url: trimText(short_url),
            long_url: trimText(long_url)
        }, id);

        return json({
            application: VITE_APP_NAME,
            message: 'Edit data success.',
            data: result,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function DELETE({ url }) {
    const id = url.searchParams.get('id');

    try {
        const result = await model.deleteData(id);

        return json({
            application: VITE_APP_NAME,
            message: 'Delete data success.',
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}
