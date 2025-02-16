<script>
    import '../app.css';
    import 'notyf/notyf.min.css';
</script>

<svelte:head>
    <title>
        {import.meta.env.VITE_APP_NAME}
    </title>
</svelte:head>

<slot />
