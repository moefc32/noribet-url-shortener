<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Notyf } from "notyf";
  import isValidEmail from "$lib/isValidEmail";

  import Header from "$lib/component/Header.svelte";
  import TableURL from "$lib/component/TableURL.svelte";
  import CreateURL from "$lib/component/CreateURL.svelte";

  let notyf;

  export let data;

  let { contents } = data;

  let search = {
    keyword: "",
    loading: false,
    results: [],
  };

  async function reloadURLList(page) {
    try {
      const response = await fetch(`/api/url?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error();

      const result = await response.json();
      contents = result.data;
    } catch (e) {
      console.error(e);
    }
  }

  async function doSearch() {
    search.loading = true;

    try {
      const response = await fetch(`/api/url?s=${search.keyword}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error();

      const result = await response.json();
      search.results = result.data;
      search.loading = false;
    } catch (e) {
      search.loading = false;

      console.error(e);
    }
  }

  onMount(async () => {
    notyf = new Notyf();
  });
</script>

<main class="container flex flex-1 flex-col gap-6 mx-auto p-6">
  <Header />
  {#if $page.data.access_token}
    <CreateURL {reloadURLList} />
    <TableURL {search} {doSearch} {contents} {reloadURLList} />
  {:else}
    <div
      class="flex flex-1 flex-col justify-center items-center gap-3 mx-auto pb-12 w-full max-w-screen-md"
    >
      <CreateURL {reloadURLList} />
    </div>
  {/if}
</main>
