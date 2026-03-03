<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Modal, Button } from 'flowbite-svelte';
    import { Key, LogOut, LogIn } from 'lucide-svelte';
    import notyf from '$lib/notyf';
    import isValidEmail from '$lib/isValidEmail';

    import Login from './Login.svelte';
    import EditAccount from './EditAccount.svelte';

    let modalProfile = false;

    let profile = {
        email: $page.data.user_email,
        password: '',
    };
    let showPassword = false;

    async function updateProfile() {
        try {
            if (!isValidEmail(profile.email)) throw new Error();

            const response = await fetch('/api/auth', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) throw new Error();

            profile.password = '';

            notyf.success('Account info updated successfully.');
            await goto('/', { invalidateAll: true });
            modalProfile = false;
        } catch (e) {
            console.error(e);
            notyf.error('Update login account info failed, please try again!');
        }
    }

    async function doLogout() {
        try {
            const response = await fetch('/api/auth', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error();

            notyf.success('You are now logged out.');
            await goto('/login', { invalidateAll: true });
        } catch (e) {
            console.error(e);
            notyf.error('Logout failed, please try again!');
        }
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_missing_attribute -->
<header
    class="flex items-center gap-1 bg-white dark:bg-gray-700 dark:text-white px-3 h-[60px] rounded-md shadow-xl"
>
    <div class="flex-1">
        <button
            class="flex items-center gap-1 ps-10 pe-3 bg-[url('/favicon.svg')] bg-left bg-no-repeat bg-contain text-xl font-semibold h-[32px] cursor-pointer"
            on:click={() => goto('/')}
        >
            {import.meta.env.VITE_APP_NAME}
        </button>
    </div>
    <div class="flex gap-1 ms-auto text-[16px]">
        <Button
            outline
            color="dark"
            class="flex gap-1 px-4 py-2 cursor-pointer"
            title="Edit login account"
            on:click={() => (modalProfile = true)}
        >
            <Key size={14} />
            <span class="hidden md:inline">Edit Account</span>
        </Button>
        <Button
            color="purple"
            class="flex gap-1 px-4 py-2 cursor-pointer"
            title="Logout from application"
            on:click={() => doLogout()}
        >
            <LogOut size={14} />
            <span class="hidden md:inline">Logout</span>
        </Button>
    </div>
</header>

<Modal
    size="xs"
    backdropClass={'bg-black/75 fixed inset-0 z-50'}
    bind:open={modalProfile}
    autoclose
    outsideclose
>
    <EditAccount {profile} {updateProfile} />
</Modal>
