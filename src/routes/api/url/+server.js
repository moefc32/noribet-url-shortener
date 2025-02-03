import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import model from '$lib/server/model/url';
import trimText from '$lib/trimText';

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    const search = url.searchParams.get('s');

    try {
        const result = search
            ? await model.searchData(search)
            : await model.getData(id);

        return json({
            application: VITE_APP_NAME,
            message: !result.length
                ? 'No data found.'
                : `Get ${id ? 'data' : 'all data'} success.`,
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
        long_url = '',
        short_url = '',
    } = await request.json() || {};

    try {
        const result = await model.createData({
            long_url: trimText(long_url),
            short_url: trimText(short_url)
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
        long_url = '',
        short_url = '',
    } = await request.json() || {};

    try {
        const result = await model.editData({
            long_url: trimText(long_url),
            short_url: trimText(short_url)
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
