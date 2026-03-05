<script>
    import datePrettier from '$lib/datePrettier';

    export let contents = [];
    export let reloadHistoryList;

    let currentPage = 1;

    function previous() {
        const newPage = currentPage - 1 < 1 ? 1 : currentPage - 1;

        if (newPage !== currentPage) {
            currentPage = newPage;
            reloadHistoryList(currentPage);
        }
    }

    function next() {
        const newPage =
            currentPage + 1 > totalPage ? totalPage : currentPage + 1;

        if (newPage !== currentPage) {
            currentPage = newPage;
            reloadHistoryList(currentPage);
        }
    }

    $: totalPage = Math.max(1, Math.ceil(contents[0]?.clicks / 10));
</script>

<div class="card bg-gray-700 shadow-xl overflow-hidden">
    <div class="overflow-x-auto">
        <table class="table table-zebra">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">Accessed At</th>
                    <th class="whitespace-nowrap">Referrer</th>
                    <th class="whitespace-nowrap">User Agent</th>
                </tr>
            </thead>
            <tbody>
                {#if !contents[0]?.history_timestamp}
                    <tr>
                        <td colspan="3" class="text-center py-6 opacity-60">
                            - Currently no data to show -
                        </td>
                    </tr>
                {:else}
                    {#each contents as item}
                        <tr>
                            <td class="whitespace-nowrap">
                                {datePrettier(item.history_timestamp, {
                                    date: true,
                                    time: true,
                                })}
                            </td>
                            <td>
                                <a
                                    href={item.ref}
                                    target="_blank"
                                    class="link link-hover"
                                >
                                    {item.ref}
                                </a>
                            </td>
                            <td>{item.agent}</td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
    <div class="p-4">
        <div class="join border-1 border-gray-500 rounded-sm">
            <button
                class="join-item btn btn-sm"
                on:click={() => previous()}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span class="join-item flex items-center px-3 text-sm">
                {currentPage} of {totalPage || 1}
            </span>
            <button
                class="join-item btn btn-sm"
                on:click={() => next()}
                disabled={currentPage === totalPage}
            >
                Next
            </button>
        </div>
    </div>
</div>
