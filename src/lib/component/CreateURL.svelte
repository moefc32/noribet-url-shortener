<script>
    import { onMount } from 'svelte';
    import {
        Input,
        ButtonGroup,
        InputAddon,
        Button,
        Spinner,
    } from 'flowbite-svelte';
    import { Check } from 'lucide-svelte';
    import { Notyf } from 'notyf';
    import isValidShortURL from '$lib/isValidShortURL';

    let notyf;

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
            await notyf.success('New short URL created successfully.');
        } catch (e) {
            formData.loading = false;

            console.error(e);
            notyf.error('Cannot create short URL, please try again!');
        }
    }

    onMount(async () => {
        notyf = new Notyf();
        siteAddress = window.location.href;
    });
</script>

<div
    class="card flex flex-col justify-center items-center gap-3 bg-white dark:bg-gray-700 p-3 w-full rounded-md shadow-xl"
>
    <Input
        class="dark:bg-gray-800"
        placeholder="Enter destination URL"
        disabled={!siteAddress}
        bind:value={formData.long_url}
        on:keydown={handleKeydown}
    />
    <div class="flex flex-col-reverse md:flex-row gap-3 w-full">
        <Button
            color="green"
            class="flex gap-1 w-48"
            disabled={!siteAddress ||
                !formData.long_url ||
                !isValidShortURL(formData.short_url)}
            on:click={() => doShorten()}
        >
            {#if formData.loading}
                <Spinner size="3" color="white" /> Loading...
            {:else}
                <Check size={14} /> Shorten URL
            {/if}
        </Button>
        <ButtonGroup class="w-full">
            <InputAddon>
                {siteAddress ?? 'Loading...'}
            </InputAddon>
            <Input
                class="dark:bg-gray-800"
                placeholder="Enter custom short URL (optional, only alphanumeric)"
                disabled={!siteAddress}
                bind:value={formData.short_url}
                on:keydown={handleKeydown}
            />
        </ButtonGroup>
    </div>
</div>
