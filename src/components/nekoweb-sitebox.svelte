<script>
    let { 
        siteUrl = 'jbcarreon123.nekoweb.org',
        siteTitle = 'site title',
        siteImage = 'https://nekoweb.org/screenshots/jbcarreon123/index_large.jpg'
    } = $props();
</script>

<div class="pre-pre-site nekoweb-colors">
    <div class="pre-site" style="">
        <div
            id="site"
            class="noreset site-box t-classic"
            style="width:275px!important;height:190px!important;position:relative!important"
        >
            <span class="noreset top-dot"></span>
            <a
                href={'//' + siteUrl}
                target="_blank"
                id="NOTUSEDINNEKOWEB_url"
                rel="noopener ugc"
                style="position:relative!important"
            >
                <div class="noreset sitefeature" style="position:relative!important">
                    <img
                        src={siteImage}
                        class="screenshot"
                        id="NOTUSEDINNEKOWEB_screenshot"
                        style="position:relative!important"
                        alt="nekoweb sitebox screenshot"
                    />
                </div>
                <p class="noreset" style="position:relative!important">
                    <span id="NOTUSEDINNEKOWEB_siteurl">{siteUrl}</span>

                    <span style="position:relative!important" class="noreset follow" title="Follow"
                        >[+]</span
                    >
                </p>
                <span
                    class="noreset"
                    style="position:relative!important"
                    id="NOTUSEDINNEKOWEB_sitetitle">{siteTitle}</span
                >
                <br />
            </a>
            <span class="noreset bottom-dot"></span>
        </div>
    </div>
</div>