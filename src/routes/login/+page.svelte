<script>
    import { goto } from '$app/navigation';
    import { Eye, EyeOff, LogIn } from 'lucide-svelte';
    import notyf from '$lib/notyf';
    import isValidEmail from '$lib/isValidEmail';

    let login = {
        email: '',
        password: '',
        loading: false,
    };

    let showPassword = false;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && login.email && login.password) {
            doLogin();
        }
    }

    async function doLogin() {
        try {
            login.loading = true;
            if (!isValidEmail(login.email)) throw new Error();

            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(login),
            });

            if (!response.ok) throw new Error();

            notyf.success('You have successfully logged in.');
            await goto('/', { invalidateAll: true });
        } catch (e) {
            login.loading = false;
            console.error(e);
            notyf.error('Login failed, please check all data and try again!');
        }
    }
</script>

<main class="flex flex-1 justify-center items-center p-6">
    <div class="card bg-gray-700 shadow-xl w-full max-w-[320px]">
        <div class="card-body flex flex-col gap-3">
            <h1 class="text-3xl text-center">
                {import.meta.env.VITE_APP_NAME}
            </h1>

            <input
                type="email"
                class="input input-bordered w-full"
                placeholder="Email"
                bind:value={login.email}
                on:keydown={handleKeydown}
            />

            <div class="join w-full">
                <input
                    type={showPassword ? 'text' : 'password'}
                    class="join-item input input-bordered w-full"
                    placeholder="Password"
                    bind:value={login.password}
                    on:keydown={handleKeydown}
                />
                <button
                    type="button"
                    class="join-item btn btn-outline border-gray-500"
                    title={showPassword
                        ? 'Click to hide password'
                        : 'Click to show password'}
                    on:click={() => (showPassword = !showPassword)}
                >
                    {#if showPassword}
                        <EyeOff size={18} />
                    {:else}
                        <Eye size={18} />
                    {/if}
                </button>
            </div>

            <button
                class="btn btn-primary mt-2 flex gap-2"
                title="Login to application"
                disabled={!login.email ||
                    !isValidEmail(login.email) ||
                    !login.password ||
                    login.loading}
                on:click={() => doLogin()}
            >
                {#if login.loading}
                    <span class="loading loading-spinner loading-sm"></span>
                    Loading...
                {:else}
                    <LogIn size={14} /> Login
                {/if}
            </button>
        </div>
    </div>
</main>
