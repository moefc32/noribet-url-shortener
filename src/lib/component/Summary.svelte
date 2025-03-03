<script>
    import { onMount } from 'svelte';
    import QRCode from 'qrcode';
    import datePrettier from '$lib/datePrettier';

    export let contents;

    const summary = contents[0];
    let siteAddress = null;
    let qrSrc = '';

    onMount(async () => {
        siteAddress = window.location.href.replace('~', '');
        qrSrc = await QRCode.toDataURL(siteAddress, {
            margin: 2,
        });
    });
</script>

<div
    class="card flex flex-row justify-start items-stretch bg-white dark:bg-gray-700 dark:text-white p-3 w-full rounded-md shadow-xl"
>
    <div class="flex flex-1 flex-col justify-start items-stretch gap-1">
        <div class="flex">
            <div class="w-[125px]">Short URL</div>
            <div class="flex-1">
                : <a href="/{summary.short_url}" target="_blank">
                    {summary.short_url}
                </a>
            </div>
        </div>
        <div class="flex">
            <div class="w-[125px]">Destination URL</div>
            <div class="flex-1">
                :
                <a
                    href={summary.long_url}
                    target="_blank"
                    title={summary.long_url}
                >
                    {summary.long_url}
                </a>
            </div>
        </div>
        <div class="flex">
            <div class="w-[125px]">Total Clicks</div>
            <div class="flex-1">: {summary.clicks}</div>
        </div>
        <div class="flex">
            <div class="w-[125px]">Created At</div>
            <div class="flex-1">: {datePrettier(summary.timestamp)}</div>
        </div>
    </div>
    <div class="w-[120px] h-[120px] bg-gray-300 rounded-sm overflow-hidden">
        <img src={qrSrc} class="w-full" alt="Short URL's QR code" />
    </div>
</div>
