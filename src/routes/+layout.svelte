<script>
    import '../app.css';
    import 'notyf/notyf.min.css';
    import { onMount } from 'svelte';

    export let data;

    onMount(() => {
        function handleBfcache(event) {
            if (!event.persisted) return;

            const hasSession = document.cookie.includes('__session_active=1');
            const path = window.location.pathname;

            const isAuth = data.unauthRoutes.some(r => path.startsWith(r));
            const isPublic = data.publicRoutes.some(r => path.startsWith(r));
            const isProtected = !isAuth && !isPublic;

            if ((isProtected && !hasSession) || (isAuth && hasSession)) {
                window.location.reload();
            }
        }

        window.addEventListener('pageshow', handleBfcache);

        return function () {
            window.removeEventListener('pageshow', handleBfcache);
        };
    });
</script>

<svelte:head>
    <title>
        {import.meta.env.VITE_APP_NAME}
    </title>
</svelte:head>

<slot />
