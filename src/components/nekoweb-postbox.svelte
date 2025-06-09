<script lang="ts">
    let { 
        postUrl = 'https://jbcarreon123.nekoweb.org',
        postAuthor = 'jbcarreon123',
        postTitle = 'Post title',
        postDesc = `We're starting to formalize flexible opinions around our foundations at the end of
the day highlights, and locked and loaded, but organic growth hammer out have
bandwidth. The horse is out of the barn how much bandwidth do you have highlights.
Corporate synergy we've bootstrapped the model.`,
        postDate = new Date(Date.now())
    }: {
        postUrl: string,
        postAuthor: string,
        postTitle: string,
        postDesc: string,
        postDate: Date
    } = $props();
</script>

<div class="pre-pre-post noreset">
    <div class="pre-post noreset" style="">
        <a
            href={postUrl}
            class="noreset post-link"
            target="_blank"
            id="NOTUSEDINNEKOWEB_posturl"
            rel="noopener ugc"
            style="position:relative!important"
        >
            <div
                class="noreset post-box t-classic"
                style="width:100%!important;max-height:400px!important;position:relative!important"
            >
                <div class="noreset post-box-inner">
                    <span class="noreset post-top-dot"></span>
                    <span
                        class="noreset post-author"
                        style="position:relative!important"
                        id="NOTUSEDINNEKOWEB_siteusername">{postAuthor}</span
                    >
                    <span class="noreset post-dot" style="position:relative!important">·</span>
                    <span
                        class="noreset post-date"
                        style="position:relative!important"
                        id="NOTUSEDINNEKOWEB_feeddate">{postDate.toLocaleDateString()}</span
                    >
                    <h4
                        class="noreset post-title"
                        style="position:relative!important"
                        id="NOTUSEDINNEKOWEB_feedtitle"
                    >
                        {postTitle}
                    </h4>

                    <p
                        class="noreset post-description"
                        style="position:relative!important"
                        id="NOTUSEDINNEKOWEB_feeddesc"
                    >
                        {postDesc}
                    </p>

                    <span class="noreset post-bottom-dot"></span>
                </div>
            </div>
        </a>
    </div>
</div>