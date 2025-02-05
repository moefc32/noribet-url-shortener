<script>
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Button,
    Pagination,
    PaginationItem,
  } from "flowbite-svelte";
  import datePrettier from "$lib/datePrettier";

  export let contents = [];
</script>

<div class="bg-white dark:bg-gray-700 overflow-hidden rounded-md shadow-xl">
  <Table striped={true} hoverable={true}>
    <TableHead>
      <TableHeadCell class="whitespace-nowrap">Accessed At</TableHeadCell>
      <TableHeadCell class="whitespace-nowrap">Referrer</TableHeadCell>
      <TableHeadCell class="whitespace-nowrap">User Agent</TableHeadCell>
      <TableHeadCell class="whitespace-nowrap">IP Address</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#if !contents[0].history_timestamp}
        <TableBodyRow>
          <TableBodyCell colspan="4" class="p-6 text-center text-gray-500">
            - Currently no data to show -
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        {#each contents as item, i}
          <TableBodyRow>
            <TableBodyCell class="w-[1%] whitespace-nowrap">
              {datePrettier(item.history_timestamp)}
            </TableBodyCell>
            <TableBodyCell>
              <a href={item.ref} target="_blank">{item.ref}</a>
            </TableBodyCell>
            <TableBodyCell>{item.agent}</TableBodyCell>
            <TableBodyCell>{item.address}</TableBodyCell>
          </TableBodyRow>
        {/each}
      {/if}
    </TableBody>
  </Table>
  <div class="flex p-3 w-full">
    <Pagination />
  </div>
</div>
