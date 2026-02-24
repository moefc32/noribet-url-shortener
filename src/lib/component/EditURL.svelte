<script>
    import { Input, Button } from 'flowbite-svelte';
    import { Link, Check } from 'lucide-svelte';
    import isValidEmail from '$lib/isValidEmail';

    export let formData;
    export let editEntry;

    let showPassword = false;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && formData.long_url && formData.short_url) {
            editEntry();
        }
    }
</script>

<div class="flex flex-col gap-2 dark:text-white">
    <Link size={50} class="mx-auto my-3" />
    <Input
        class="mb-3 dark:bg-gray-800"
        placeholder="New destination URL"
        bind:value={formData.long_url}
        on:keydown={handleKeydown}
    />
    <Input
        class="mb-3 dark:bg-gray-800"
        placeholder="New short URL"
        bind:value={formData.short_url}
        on:keydown={handleKeydown}
    />
    <div class="flex gap-3 mt-2">
        <Button class="flex flex-1 gap-1" color="alternative">Cancel</Button>
        <Button
            color="green"
            class="flex flex-1 gap-1"
            on:click={() => editEntry()}
        >
            <Check size={14} /> Save
        </Button>
    </div>
</div>
