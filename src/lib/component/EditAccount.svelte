<script>
    import { page } from '$app/stores';
    import { Input, ButtonGroup, Button, Spinner } from 'flowbite-svelte';
    import { Eye, EyeOff, Check } from 'lucide-svelte';
    import isValidEmail from '$lib/isValidEmail';

    export let profile;
    export let updateProfile;

    let showPassword = false;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && profile.email && profile.password) {
            updateProfile();
        }
    }
</script>

<div class="flex flex-col gap-2">
    <h1 class="mb-2 text-3xl text-center">Edit Account</h1>
    <Input
        type="email"
        class="input input-bordered dark:bg-gray-800 w-full"
        placeholder="New email"
        bind:value={profile.email}
        on:keydown={handleKeydown}
    />
    <Input
        class="input input-bordered flex items-center gap-2 dark:bg-gray-800 w-full"
    >
        {#if !showPassword}
            <ButtonGroup class="w-full">
                <Input
                    type="password"
                    class="grow dark:bg-gray-800"
                    placeholder="New password"
                    bind:value={profile.password}
                    on:keydown={handleKeydown}
                />
                <button
                    class="flex gap-1 p-3 border-2 border-s-0 dark:border-gray-600 rounded-r-lg"
                    title="Click to show password"
                    on:click={() => (showPassword = !showPassword)}
                >
                    <Eye size={18} />
                </button>
            </ButtonGroup>
        {:else}
            <ButtonGroup class="w-full">
                <Input
                    type="text"
                    class="grow dark:bg-gray-800"
                    placeholder="New password"
                    bind:value={profile.password}
                    on:keydown={handleKeydown}
                />
                <button
                    class="flex gap-1 p-3 border-2 border-s-0 dark:border-gray-600 rounded-r-lg"
                    title="Click to hide password"
                    on:click={() => (showPassword = !showPassword)}
                >
                    <EyeOff size={18} />
                </button>
            </ButtonGroup>
        {/if}
    </Input>
    <Button
        color="green"
        class="flex gap-1 mt-2"
        disabled={!profile.email || !isValidEmail(profile.email)}
        on:click={() => updateProfile()}
    >
        {#if profile.loading}
            <Spinner size="3" color="white" /> Loading...
        {:else}
            <Check size={14} /> Save
        {/if}
    </Button>
    <Button class="flex gap-1" color="alternative">Cancel</Button>
</div>
