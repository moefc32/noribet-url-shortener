<script>
  import Header from "$lib/component/Header.svelte";
  import Summary from "$lib/component/Summary.svelte";
  import TableHistory from "$lib/component/TableHistory.svelte";

  export let data;

  let { contents } = data;
</script>

<main class="container flex flex-1 flex-col gap-6 mx-auto p-6">
  <Header />
  <Summary {contents} />
  <TableHistory {contents} />
</main>
