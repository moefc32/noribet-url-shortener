<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Input, ButtonGroup, Button, Spinner } from "flowbite-svelte";
  import { Eye, EyeOff, Check } from "lucide-svelte";
  import { Notyf } from "notyf";
  import isValidEmail from "$lib/isValidEmail";

  let notyf;

  let register = {
    email: "",
    password: "",
    loading: false,
  };

  let showPassword = false;

  async function handleKeydown(event) {
    if (event.key === "Enter" && register.email && register.password) {
      doRegister();
    }
  }

  async function doRegister() {
    try {
      register.loading = true;
      if (!isValidEmail(register.email)) throw new Error();

      const response = await fetch("/api/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
      });

      if (!response.ok) throw new Error();
      window.location.href = "/";
    } catch (e) {
      register.loading = false;

      console.error(e);
      notyf.error("Register failed, please check all data and try again!");
    }
  }

  onMount(async () => {
    notyf = new Notyf();
  });
</script>

<main
  class="container flex flex-1 flex-col justify-center items-center mx-auto p-6"
>
  <div
    class="card flex flex-col gap-2 my-auto p-6 bg-white dark:bg-gray-700 dark:text-white w-full max-w-[320px] shadow-xl rounded-md"
  >
    <h1 class="mt-2 text-3xl text-center">{import.meta.env.VITE_APP_NAME}</h1>
    <p class="mb-2 text-center text-gray-500">
      Please register an account before you can use this application
    </p>
    <Input
      type="email"
      class="input input-bordered dark:bg-gray-800 w-full"
      placeholder="Email"
      bind:value={register.email}
      on:keydown={handleKeydown}
    />
    <Input class="input input-bordered flex items-center gap-2 dark:bg-gray-800">
      {#if !showPassword}
        <ButtonGroup class="w-full">
          <Input
            type="password"
            class="grow dark:bg-gray-800"
            placeholder="Password"
            bind:value={register.password}
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
            bind:value={register.password}
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
      title="Register new account"
      disabled={!register.email ||
        !isValidEmail(register.email) ||
        !register.password ||
        register.loading}
      on:click={() => doRegister()}
    >
      {#if register.loading}
        <Spinner size="3" color="white" /> Loading...
      {:else}
        <Check size={14} /> Register
      {/if}
    </Button>
  </div>
</main>
