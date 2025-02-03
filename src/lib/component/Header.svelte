<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Menu, ChevronDown, Eye, EyeOff } from "lucide-svelte";
  import { toast } from "svoast";
  import isValidEmail from "$lib/isValidEmail";

  export let doLogout;

  let profile = {
    email: $page.data.user_email,
    password: "",
  };
  let showPassword = false;

  async function updateProfile() {
    try {
      if (!isValidEmail(profile.email)) throw new Error();

      const response = await fetch("/api/auth", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error();

      toast.success("Profile info updated successfully.");
      setTimeout(() => (window.location.href = "/"), 500);
    } catch (e) {
      console.error(e);
      toast.error("Update profile info failed, please try again!");
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_missing_attribute -->
<header class="navbar bg-primary/75 text-white px-3">
  <div class="flex-1">
    <button
      class="px-3 text-2xl font-bold cursor-pointer"
      on:click={async () => goto("/")}
    >
      {import.meta.env.VITE_APP_NAME}
    </button>
  </div>
  <div class="navbar-end">
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="flex items-center gap-1 cursor-pointer"
      >
        <div class="bg-white w-10 rounded-full overflow-hidden">
          <img
            src="https://gravatar.com/avatar/{$page.data.hashed_email}?s=40"
          />
        </div>
        <ChevronDown size={16} />
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content mt-3 p-2 bg-base-100 text-black w-32 rounded-box z-[1] shadow-lg"
      >
        <li>
          <button on:click={() => edit_profile.showModal()}>Edit Profile</button
          >
        </li>
        <li>
          <button on:click={() => doLogout()}>Logout</button>
        </li>
      </ul>
    </div>
  </div>
</header>

<!-- svelte-ignore a11y_missing_attribute -->
<dialog id="edit_profile" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Edit Profile</h3>
    <div
      class="mx-auto bg-white w-36 rounded-full overflow-hidden border-2 border-gray-200"
    >
      <img src="https://gravatar.com/avatar/{$page.data.hashed_email}?s=150" />
    </div>
    <p class="my-3 text-center text-gray-500">
      You can change the picture on
      <a href="https://gravatar.com/" class="link" target="_blank">Gravatar</a>
    </p>
    <div class="flex flex-col gap-2">
      <input
        type="email"
        class="input input-bordered w-full"
        placeholder="Type to update email"
        bind:value={profile.email}
      />
      <label class="input input-bordered w-full flex items-center gap-2">
        {#if !showPassword}
          <input
            type="password"
            class="grow"
            placeholder="Type to update password"
            bind:value={profile.password}
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
            placeholder="Type to update password"
            bind:value={profile.password}
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
    </div>
    <div class="modal-action mt-6">
      <form method="dialog">
        <button class="btn">Cancel</button>
        <button
          class="btn btn-success"
          disabled={!profile.email || !isValidEmail(profile.email)}
          on:click={() => updateProfile()}
        >
          Save
        </button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
