<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Notyf } from 'notyf';
    import {
        Input,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Button,
        Pagination,
        PaginationItem,
        Modal,
    } from 'flowbite-svelte';
    import {
        ChartColumn,
        Pen,
        Trash2,
        Link,
        CircleAlert,
        Check,
    } from 'lucide-svelte';
    import datePrettier from '$lib/datePrettier';

    let notyf;

    export let search;
    export let doSearch;
    export let contents = [];
    export let reloadURLList;

    let itemEdit = false;
    let itemDelete = false;
    let formData = {
        id: '',
        short_url: '',
        long_url: '',
    };
    let searchTimeout;
    let currentPage = 1;

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
        itemEdit = true;
        formData.id = data.id;
        formData.short_url = data.short_url;
        formData.long_url = data.long_url;
    }

    function openDeleteModal(id) {
        itemDelete = true;
        formData.id = id;
    }

    async function editEntry() {
        try {
            const response = await fetch(`/api/url?id=${formData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error();

            notyf.success('Data saved successfully.');

            const result = await response.json();
            delete contents.is_new;

            await reloadURLList();
        } catch (e) {
            console.error(e);
            notyf.error('Save data failed, please try again!');
        }
    }

    async function deleteEntry() {
        try {
            const response = await fetch(`/api/url?id=${formData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error();

            notyf.success('Data deleted successfully.');
            await reloadURLList();
        } catch (e) {
            console.error(e);
            notyf.error('Delete data failed, please try again!');
        }
    }

    onMount(async () => {
        notyf = new Notyf();
    });

    $: totalPage = Math.max(1, Math.ceil(contents[0]?.urls / 10));
</script>

<div class="bg-white dark:bg-gray-700 overflow-hidden rounded-md shadow-xl">
    <div class="flex px-3 pt-3 w-full md:max-w-80">
        <Input
            class="mb-3 dark:bg-gray-800"
            placeholder="Search..."
            on:input={handleKeydown}
            bind:value={search.keyword}
        />
    </div>
    <Table striped={true} hoverable={true}>
        <TableHead>
            <TableHeadCell class="whitespace-nowrap">Short</TableHeadCell>
            <TableHeadCell class="whitespace-nowrap"
                >Destination URL</TableHeadCell
            >
            <TableHeadCell class="whitespace-nowrap">Total Clicks</TableHeadCell
            >
            <TableHeadCell class="whitespace-nowrap">Created At</TableHeadCell>
            <TableHeadCell class="whitespace-nowrap">Actions</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#if !contents.length}
                <TableBodyRow>
                    <TableBodyCell
                        colspan="5"
                        class="p-6 text-center text-gray-400!"
                    >
                        - Currently no data to show -
                    </TableBodyCell>
                </TableBodyRow>
            {/if}
            {#each search.keyword ? search.results : contents as item, i}
                <TableBodyRow>
                    <TableBodyCell>
                        <a href="/{item.short_url}" target="_blank"
                            >{item.short_url}</a
                        >
                    </TableBodyCell>
                    <TableBodyCell>
                        <a
                            href={item.long_url}
                            target="_blank"
                            title={item.long_url}
                        >
                            {item.long_url}
                        </a>
                    </TableBodyCell>
                    <TableBodyCell>{item.clicks}</TableBodyCell>
                    <TableBodyCell class="w-[1%] whitespace-nowrap">
                        {datePrettier(item.timestamp)}
                    </TableBodyCell>
                    <TableBodyCell class="w-[1%] whitespace-nowrap">
                        <div class="flex gap-1">
                            <Button
                                size="sm"
                                color="blue"
                                class="flex gap-1"
                                title="View click statistics"
                                on:click={() => goto(`/${item.short_url}~`)}
                            >
                                <ChartColumn size={12} />
                                <span class="hidden md:inline">Stats</span>
                            </Button>
                            <Button
                                size="sm"
                                color="yellow"
                                class="flex gap-1 text-black"
                                title="Edit this entry"
                                on:click={() => openEditModal(item)}
                            >
                                <Pen size={12} />
                                <span class="hidden md:inline">Edit</span>
                            </Button>
                            <Button
                                size="sm"
                                color="red"
                                class="flex gap-1"
                                title="Delete this entry"
                                on:click={() => openDeleteModal(item.id)}
                            >
                                <Trash2 size={12} />
                                <span class="hidden md:inline">Delete</span>
                            </Button>
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    <div class="flex p-3 w-full">
        <Pagination
            pages={[
                {
                    name: `${currentPage} of ${totalPage}`,
                },
            ]}
            on:previous={previous}
            on:next={next}
        />
    </div>
</div>

<Modal size="xs" bind:open={itemEdit} autoclose outsideclose>
    <div class="flex flex-col gap-2">
        <Link size={50} class="mx-auto mb-3" />
        <Input
            class="mb-3 dark:bg-gray-800"
            placeholder="New destination URL"
            bind:value={formData.long_url}
        />
        <Input
            class="mb-3 dark:bg-gray-800"
            placeholder="New short URL"
            bind:value={formData.short_url}
        />
        <div class="flex gap-1 mt-2">
            <Button class="flex flex-1 gap-1" color="alternative">Cancel</Button
            >
            <Button
                color="green"
                class="flex flex-1 gap-1"
                on:click={() => editEntry()}
            >
                <Check size={14} /> Save
            </Button>
        </div>
    </div>
</Modal>

<Modal size="xs" bind:open={itemDelete} autoclose outsideclose>
    <div class="flex flex-col gap-2">
        <CircleAlert size={50} class="mx-auto mb-3" />
        <h3 class="mb-5 text-lg text-center">
            Are you sure you want to delete this entry?
        </h3>
        <div class="flex gap-1 mt-2">
            <Button class="flex flex-1 gap-1" color="alternative">Cancel</Button
            >
            <Button
                color="red"
                class="flex flex-1 gap-1"
                on:click={() => deleteEntry()}
            >
                <Trash2 size={14} /> Delete
            </Button>
        </div>
    </div>
</Modal>
