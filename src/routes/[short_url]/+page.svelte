<script>
    import Header from '$lib/component/Header.svelte';
    import Summary from '$lib/component/Summary.svelte';
    import TableHistory from '$lib/component/TableHistory.svelte';

    export let data;

    let { short_url, contents } = data?.contents;

    async function reloadHistoryList(page) {
        try {
            const response = await fetch(
                `/api/url?page=${page}&short_url=${short_url}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) throw new Error();

            const result = await response.json();

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
