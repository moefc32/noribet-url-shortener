<script>
    import { goto } from '$app/navigation';
    import {
        ChartColumn,
        Pen,
        Trash2,
        CircleAlert,
        Link,
        Check,
    } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import ky from 'ky';
    import datePrettier from '$lib/datePrettier';

    export let search;
    export let doSearch;
    export let contents = [];
    export let reloadURLList;

    let formData = {
        id: '',
        shortUrl: '',
        longUrl: '',
    };
    let searchTimeout;
    let currentPage = 1;
    let totalPage;

    function previous() {
        const newPage = currentPage - 1 < 1 ? 1 : currentPage - 1;

        if (newPage !== currentPage) {
            currentPage = newPage;
            reloadURLList(currentPage);
        }
    }

    function next() {
        const newPage =
            currentPage + 1 > totalPage ? totalPage : currentPage + 1;

        if (newPage !== currentPage) {
            currentPage = newPage;
            reloadURLList(currentPage);
        }
    }

    async function handleKeydown() {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            doSearch();
        }, 200);
    }

    function openEditModal(data) {
        url_update.showModal();
        formData.id = data.id;
        formData.shortUrl = data.shortUrl;
        formData.longUrl = data.longUrl;
    }

    function openDeleteModal(id) {
        url_delete.showModal();
        formData.id = id;
    }

    async function editEntry() {
        try {
            await ky.patch('/api/url', {
                searchParams: { id: formData.id },
                json: formData,
            });
            await reloadURLList();

            toast.success('Data saved successfully.');
        } catch (e) {
            console.error(e);
            toast.error('Save data failed, please try again!');
        }
    }

    async function deleteEntry() {
        try {
            await ky.delete('/api/url', {
                searchParams: { id: formData.id },
            });
            await reloadURLList();

            toast.success('Data deleted successfully.');
        } catch (e) {
            console.error(e);
            toast.error('Delete data failed, please try again!');
        }
    }

    $: {
        const totalItemCount = Number(contents[0]?.urls) || 0;
        const calculated = Math.ceil(totalItemCount / 10);
        totalPage = Math.max(1, isNaN(calculated) ? 1 : calculated);
    }
</script>

<div class="card bg-gray-700 shadow-xl overflow-hidden">
    <div class="p-4 md:max-w-80">
        <input
            type="text"
            class="input input-bordered w-full"
            placeholder="Search..."
            bind:value={search.keyword}
            on:input={handleKeydown}
        />
    </div>
    <div class="overflow-x-auto">
        <table class="table table-zebra">
            <thead>
                <tr>
                    <th>Short</th>
                    <th>Destination URL</th>
                    <th>Clicks</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#if (search.keyword && !search.results.length) || !contents.length}
                    <tr>
                        <td colspan="5" class="text-center py-6 opacity-60">
                            {search.keyword
                                ? '- No data found -'
                                : '- There is currently no data to show -'}
                        </td>
                    </tr>
                {/if}

                {#each search.keyword ? search.results : contents as item}
                    <tr>
                        <td>
                            <a
                                href="/{item.shortUrl}"
                                target="_blank"
                                class="link link-hover"
                            >
                                {item.shortUrl}
                            </a>
                        </td>
                        <td>
                            <a
                                href={item.longUrl}
                                target="_blank"
                                title={item.longUrl}
                                class="link link-hover"
                            >
                                {item.longUrl}
                            </a>
                        </td>
                        <td>{item.clicks}</td>
                        <td class="align-middle w-[1%] whitespace-nowrap">
                            {datePrettier(item.timestamp, {
                                date: true,
                                time: true,
                            })}
                        </td>
                        <td class="align-middle w-[1%] whitespace-nowrap">
                            <div class="flex gap-1">
                                <button
                                    class="btn btn-sm btn-info"
                                    on:click={() => goto(`/${item.shortUrl}~`)}
                                >
                                    <ChartColumn size={12} /> Stats
                                </button>
                                <button
                                    class="btn btn-sm btn-warning"
                                    on:click={() => openEditModal(item)}
                                >
                                    <Pen size={12} /> Edit
                                </button>
                                <button
                                    class="btn btn-sm btn-error"
                                    on:click={() => openDeleteModal(item.id)}
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
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

<dialog id="url_update" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box max-w-100">
        <h3 class="text-lg font-bold">Edit URL</h3>
        <div class="flex flex-col gap-2 pt-4">
            <input
                type="text"
                class="input input-bordered w-full"
                placeholder="New destination URL"
                bind:value={formData.longUrl}
                on:keydown={handleKeydown}
            />

            <input
                type="text"
                class="input input-bordered w-full"
                placeholder="New short URL"
                bind:value={formData.shortUrl}
                on:keydown={handleKeydown}
            />
        </div>
        <div class="modal-action mt-6">
            <form method="dialog">
                <button class="btn">Cancel</button>
                <button
                    class="btn btn-success"
                    disabled={!formData.longUrl || !formData.shortUrl}
                    on:click={() => editEntry()}
                >
                    <Check size={14} /> Save
                </button>
            </form>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<dialog id="url_delete" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Delete URL</h3>
        <p class="py-4">Are you sure you want to delete this entry?</p>
        <div class="modal-action mt-3">
            <form method="dialog">
                <button class="btn">Cancel</button>
                <button
                    class="btn btn-error text-white"
                    on:click={() => deleteEntry()}
                >
                    Delete
                </button>
            </form>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
