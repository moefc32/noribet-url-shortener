<script>
  import { page } from "$app/stores";
  import { Eye, EyeOff, LogIn, Check } from "lucide-svelte";
  import isValidEmail from "$lib/isValidEmail";

  export let login;
  export let loginFormAction;

  let showPassword = false;

  async function handleKeydown(event) {
    if (event.key === "Enter" && login.email && login.password) {
      loginFormAction();
    }
  }
</script>

<main
  class="card flex flex-col gap-2 my-auto p-6 bg-white w-full max-w-[320px] shadow-2xl"
>
  {#if $page.data.is_registered}
    <h1 class="my-2 text-3xl text-center">{import.meta.env.VITE_APP_NAME}</h1>
  {:else}
    <h1 class="mt-2 text-3xl text-center">{import.meta.env.VITE_APP_NAME}</h1>
    <p class="mb-2 text-center text-gray-500">
      Please register an account before you can use this application
    </p>
  {/if}
  <input
    type="email"
    class="input input-bordered w-full max-w-xs"
    placeholder="Email"
    bind:value={login.email}
    on:keydown={handleKeydown}
  />
  <label class="input input-bordered flex items-center gap-2">
    {#if !showPassword}
      <input
        type="password"
        class="grow"
        placeholder="Password"
        bind:value={login.password}
        on:keydown={handleKeydown}
      />
      <button
        class="-ms-8 text-black z-[100] cursor-pointer"
        title="Click to show password"
        on:click={() => (showPassword = !showPassword)}
      >
        <Eye size={18} />
      </button>
    {:else}
      <input
        type="text"
        class="grow"
        placeholder="Password"
        bind:value={login.password}
        on:keydown={handleKeydown}
      />
      <button
        class="-ms-8 text-black z-[100] cursor-pointer"
        title="Click to hide password"
        on:click={() => (showPassword = !showPassword)}
      >
        <EyeOff size={18} />
      </button>
    {/if}
  </label>
  <button
    class="btn btn-primary mt-2"
    title={$page.data.is_registered
      ? "Login to application"
      : "Register new account"}
    disabled={!login.email ||
      !isValidEmail(login.email) ||
      !login.password ||
      login.loading}
    on:click={() => loginFormAction()}
  >
    {#if login.loading}
      <span class="loading loading-spinner loading-xs"></span> Loading...
    {:else if $page.data.is_registered}
      <LogIn size={16} /> Login
    {:else}
      <Check size={16} /> Register
    {/if}
  </button>
</main>
