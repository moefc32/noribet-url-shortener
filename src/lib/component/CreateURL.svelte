<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Check } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import ky from 'ky';
    import isValidShortURL from '$lib/isValidShortURL';

    export let reloadURLList;

    let siteAddress = null;
    let formData = {
        longUrl: '',
        shortUrl: '',
        loading: false,
    };
    let finalResult = {
        longUrl: '',
        shortUrl: '',
    };

    async function handleKeydown(event) {
        if (event.key === 'Enter' && formData.longUrl) {
            doShorten();
        }
    }

    async function doShorten() {
        try {
            formData.loading = true;

            await ky.post('/api/url', {
                json: formData,
            });

            await reloadURLList();

            formData.longUrl = '';
            formData.shortUrl = '';

            toast.success('New short URL created successfully.');
        } catch (e) {
            console.error(e);
            toast.error('Cannot create short URL, please try again!');
        } finally {
            formData.loading = false;
        }
    }

    onMount(async () => {
        siteAddress = window.location.href;
    });
</script>

<div
    class="card flex flex-col md:flex-row justify-start items-stretch bg-gray-700 p-4 w-full shadow-xl"
>
    <div class="flex flex-col items-center gap-3 w-full">
        <input
            type="text"
            class="input input-bordered w-full"
            placeholder="Enter destination URL"
            disabled={!siteAddress}
            bind:value={formData.longUrl}
            on:keydown={handleKeydown}
        />

        <div class="flex flex-col-reverse md:flex-row gap-3 w-full">
            <button
                class="btn btn-success w-48 flex gap-2"
                disabled={!siteAddress ||
                    !formData.longUrl ||
                    !isValidShortURL(formData.shortUrl)}
                on:click={() => doShorten()}
            >
                {#if formData.loading}
                    <span class="loading loading-spinner loading-xs"></span>
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
                    bind:value={formData.shortUrl}
                    on:keydown={handleKeydown}
                />
            </div>
        </div>
    </div>
</div>
