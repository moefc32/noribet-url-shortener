<script>
    import ky from 'ky';

    import Header from '$lib/component/Header.svelte';
    import Summary from '$lib/component/Summary.svelte';
    import TableHistory from '$lib/component/TableHistory.svelte';

    export let data;

    let { short_url, contents } = data?.contents;

    async function reloadHistoryList(page) {
        try {
            const result = await ky
                .get('/api/url', {
                    searchParams: {
                        page,
                        short_url,
                    },
                })
                .json();

            contents = result.data;
        } catch (e) {
            console.error(e);
        }
    }
</script>

<main class="container flex flex-1 flex-col gap-6 mx-auto p-6">
    <Header />
    <Summary {contents} />
    <TableHistory {short_url} {contents} {reloadHistoryList} />
</main>
