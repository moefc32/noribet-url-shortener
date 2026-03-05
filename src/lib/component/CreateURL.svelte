<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Check } from 'lucide-svelte';
    import notyf from '$lib/notyf';
    import isValidShortURL from '$lib/isValidShortURL';

    export let reloadURLList;

    let siteAddress = null;
    let formData = {
        long_url: '',
        short_url: '',
        loading: false,
    };
    let finalResult = {
        long_url: '',
        short_url: '',
    };

    async function handleKeydown(event) {
        if (event.key === 'Enter' && formData.long_url) {
            doShorten();
        }
    }

    async function doShorten() {
        try {
            formData.loading = true;

            const response = await fetch('/api/url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error();

            await reloadURLList();
            formData.long_url = '';
            formData.short_url = '';
            formData.loading = false;

            notyf.success('New short URL created successfully.');
        } catch (e) {
            formData.loading = false;

            console.error(e);
            notyf.error('Cannot create short URL, please try again!');
        }
    }

    onMount(async () => {
        siteAddress = window.location.href;
    });
</script>

<div
    class="card flex flex-col md:flex-row justify-start items-stretch bg-gray-700 p-4 w-full rounded-md shadow-xl"
>
    <div class="flex flex-col items-center gap-3 w-full">
        <input
            type="text"
            class="input input-bordered w-full"
            placeholder="Enter destination URL"
            disabled={!siteAddress}
            bind:value={formData.long_url}
            on:keydown={handleKeydown}
        />

        <div class="flex flex-col-reverse md:flex-row gap-3 w-full">
            <button
                class="btn btn-success w-48 flex gap-2"
                disabled={!siteAddress ||
                    !formData.long_url ||
                    !isValidShortURL(formData.short_url)}
                on:click={() => doShorten()}
            >
                {#if formData.loading}
                    <span class="loading loading-spinner loading-sm"></span>
                    Loading...
                {:else}
                    <Check size={14} /> Shorten URL
                {/if}
            </button>

            <div class="join w-full">
                <span
                    class="join-item flex items-center px-3 border border-gray-500 text-sm"
                >
                    {siteAddress ?? 'Loading...'}
                </span>
                <input
                    type="text"
                    class="join-item input input-bordered w-full"
                    placeholder="Enter custom short URL (optional, only alphanumeric)"
                    disabled={!siteAddress}
                    bind:value={formData.short_url}
                    on:keydown={handleKeydown}
                />
            </div>
        </div>
    </div>
</div>
