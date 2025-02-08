<script>
  import { page } from "$app/stores";
  import { Input, ButtonGroup, Button, Spinner } from "flowbite-svelte";
  import { Eye, EyeOff, LogIn } from "lucide-svelte";
  import isValidEmail from "$lib/isValidEmail";

  export let login;
  export let doLogin;

  let showPassword = false;

  async function handleKeydown(event) {
    if (event.key === "Enter" && login.email && login.password) {
      doLogin();
    }
  }
</script>

<div class="flex flex-col gap-2 dark:text-white">
  <h1 class="mb-2 text-3xl text-center">{import.meta.env.VITE_APP_NAME}</h1>
  <Input
    type="email"
    class="input input-bordered dark:bg-gray-800 w-full"
    placeholder="Email"
    bind:value={login.email}
    on:keydown={handleKeydown}
  />
  <Input class="input input-bordered flex items-center gap-2 dark:bg-gray-800 w-full">
    {#if !showPassword}
      <ButtonGroup class="w-full">
        <Input
          type="password"
          class="grow dark:bg-gray-800"
          placeholder="Password"
          bind:value={login.password}
          on:keydown={handleKeydown}
        />
        <button
          class="p-3 border-2 border-s-0 dark:border-gray-600 rounded-r-lg"
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
          placeholder="Password"
          bind:value={login.password}
          on:keydown={handleKeydown}
        />
        <button
          class="p-3 border-2 border-s-0 dark:border-gray-600 rounded-r-lg"
          title="Click to hide password"
          on:click={() => (showPassword = !showPassword)}
        >
          <EyeOff size={18} />
        </button>
      </ButtonGroup>
    {/if}
  </Input>
  <Button
    color="blue"
    class="flex gap-1 mt-2"
    title="Login to application"
    disabled={!login.email ||
      !isValidEmail(login.email) ||
      !login.password ||
      login.loading}
    on:click={() => doLogin()}
  >
    {#if login.loading}
      <Spinner size="3" color="white" /> Loading...
    {:else}
      <LogIn size={14} /> Login
    {/if}
  </Button>
</div>
