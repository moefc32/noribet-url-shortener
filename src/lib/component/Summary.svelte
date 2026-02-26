<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
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
    class="card flex flex-col md:flex-row justify-start items-stretch bg-white dark:bg-gray-700 dark:text-white p-3 w-full rounded-md shadow-xl"
>
    <div class="flex flex-1 flex-col justify-start items-stretch gap-1">
        <div class="flex flex-col sm:flex-row mt-2 sm:mt-0">
            <div class="flex sm:w-[135px] pe-1">
                <span class="sm:flex-1 me-1">Short URL</span>
                <span>:</span>
            </div>
            <span class="flex-1">
                <a href="/{summary.short_url}" target="_blank">
                    {summary.short_url}
                </a>
            </span>
        </div>
        <div class="flex flex-col sm:flex-row mt-2 sm:mt-0">
            <div class="flex sm:w-[135px] pe-1">
                <span class="sm:flex-1 me-1">Destination URL</span>
                <span>:</span>
            </div>
            <span class="flex-1">
                <a
                    href={summary.long_url}
                    target="_blank"
                    title={summary.long_url}
                >
                    {summary.long_url}
                </a>
            </span>
        </div>
        <div class="flex flex-col sm:flex-row mt-2 sm:mt-0">
            <div class="flex sm:w-[135px] pe-1">
                <span class="sm:flex-1 me-1">Total Clicks</span>
                <span>:</span>
            </div>
            <span class="flex-1">{summary.clicks}</span>
        </div>
        <div class="flex flex-col sm:flex-row mt-2 sm:mt-0">
            <div class="flex sm:w-[135px] pe-1">
                <span class="sm:flex-1 me-1">Created At</span>
                <span>:</span>
            </div>
            <span class="flex-1">
                {datePrettier(summary.timestamp, {
                    date: true,
                    time: true,
                })}
            </span>
        </div>
    </div>
    <div
        class="w-[120px] h-[120px] mt-6 md:mt-0 bg-gray-300 rounded-sm overflow-hidden"
    >
        <img src={qrSrc} class="w-full" alt="Short URL's QR code" />
    </div>
</div>
