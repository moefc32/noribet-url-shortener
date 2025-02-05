<script>
  import datePrettier from "$lib/datePrettier";

  export let contents;

  const summary = contents[0];
</script>

<div
  class="card flex flex-col justify-center items-stretch gap-1 bg-white dark:bg-gray-700 dark:text-white p-3 w-full min-h-[120px] rounded-md shadow-xl"
>
  <div class="flex flex-1">
    <div class="w-[90px]">Short URL</div>
    <div class="flex-1">
      : <a href="/{summary.short_url}" target="_blank">{summary.short_url}</a>
    </div>
  </div>
  <div class="flex flex-1">
    <div class="w-[90px]">Long URL</div>
    <div class="flex-1">
      :
      <a href={summary.long_url} target="_blank" title={summary.long_url}>
        {summary.long_url}
      </a>
    </div>
  </div>
  <div class="flex flex-1">
    <div class="w-[90px]">Created At</div>
    <div class="flex-1">: {datePrettier(summary.timestamp)}</div>
  </div>
</div>
