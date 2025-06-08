<script lang="ts">

	import CodeMirror from 'svelte-codemirror-editor';
	import { css } from '@codemirror/lang-css';
	import { gruvboxDark } from '@fsegurai/codemirror-theme-bundle';
	import { onMount } from 'svelte';
	import { linter, lintGutter, type Diagnostic } from '@codemirror/lint';
	import { syntaxTree } from '@codemirror/language';

	if (navigator.storage && navigator.storage.persist) {
		navigator.storage.persist().then((persistent) => {
			if (persistent) {
				console.log('Storage will not be cleared except by explicit user action');
			} else {
				console.log('Storage may be cleared by the UA under storage pressure.');
			}
		});
	}

	let value = /*css*/ `/* 
    Don't use this file to edit your site style! Create a different CSS file for that.
    This file defines how custom elements (like sitebox) will look like.
    Setting CSS that breaks main nekoweb site on purpose is prohibited and may result in ban and site deletion! 
*/

/* Must start with ".site-box". Change how your website will appear on main nekoweb site: https://lune.dimden.dev/405a44b7e5.png */
.site-box {
    text-align: center;
    background-image: url(/static/assets/cookiebox.png); /* Only nekoweb URLs allowed, use full url to your site like https://example.nekoweb.org/images/coolbg.png */
    background-repeat: no-repeat;
    color: #b08271;
    font-size: 12px;
}
.site-box > a > p {
    color: var(--darkbrown);
    font-weight: bold;
}
.site-box > a > span {
    color: var(--darkbrown);
}

/* Style for your 'Follow on Nekoweb' button (<iframe src="https://nekoweb.org/frame/follow" frameborder="0" width="170" height="28"></iframe>) */
.follow {

}

/* Style for your post box (must start with ".post-box") */
.post-box {
    background-color: #fff2cc;
    border: 4px solid #ecbfa6;
    padding: 15px;
    border-radius: 5px;
    color: #634c53;
    font-weight: normal;
}

.post-box .post-title {
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 0px;
}`;

	onMount(() => editValue());

	function editValue() {
		const userStyle = document.querySelector('#nekobox_user_style');
		if (!userStyle) return;

		userStyle.innerHTML = replaceInvalidCSS(value);
	}

	const regexpLinter = linter((view) => {
		let diagnostics: Diagnostic[] = [];
		const regex = /^(?!\.site-box|\.follow|\.post-box).*{/gm;
        const linkRegex = /(^.+url)\((?!["']?(?:(?:https?:)?\/\/([a-z0-9A-Z\-]+\.)?nekoweb\.org)|(?:\/)).+(\);?)/gm;
        let clines = value.split("\n");
        clines.forEach((s, i) => {
            const line = i;
            const column = s.length - 1;
			const lineStart = view.state.doc.line(line + 1).from;
            const from = lineStart;
            const to = Math.min(from + column, view.state.doc.length);

            if (regex.test(s)) {
                if (/{ ?$/.test(s)) {
                    //@ts-ignore
                    let str = (()=>{if (s.match(regex)[0].startsWith("@")) {
                        //@ts-ignore
                        return `nekobox: Unrecognized selector: ${s.match(regex)[0].replace(/ { ?$/, "")}. Nekoweb does not support @at-rules as of now.`;
                    } else {
                        //@ts-ignore
                        return `nekobox: Unrecognized selector: ${s.match(regex)[0].replace(/ { ?$/, "")}. Please make sure that every entry on the elements.css starts with '.site-box' for the sitebox and '.post-box' for the postbox.`;
                    }})()
                    diagnostics.push({
                        from: from,
                        to: to,
                        message: str,
                        severity:'error'
                    });
                }
            } else if (linkRegex.test(s)) {
                if (!/^\//.test(s.replace(linkRegex, '$1'))) {
                    console.log(s.match(linkRegex));
                    diagnostics.push({
                        from: from,
                        to: to,
                        message: `nekobox: URL not allowed: ${s.match(linkRegex)[0]}. Nekoweb elements.css does not support anything beyond [sitename].nekoweb.org.`,
                        severity: 'error'
                    });
                }
            }
        });
        console.log(diagnostics);
		return diagnostics;
	});

    const langLinter = linter(async (view) => {
		let diagnostics: Diagnostic[] = [];
		//@ts-ignore
		let output = await stylelint.lint({
			config: {
				rules: {
					'block-no-empty': true
				}
			},
			code: value
		});
		var messages = output.results[0].warnings;
		for (const message of messages) {
            const line = message.line - 1;
            const column = message.column - 1;
			const lineStart = view.state.doc.line(line + 1).from;
            const from = lineStart + column;
            const to = Math.min(from + (message.endColumn ? message.endColumn - message.column : 1), view.state.doc.length);

			diagnostics.push({
				from: from,
				to: to,
				message: 'css: ' + message.text,
				severity: message.severity
			});
		}
		return diagnostics;
	});

    function replaceInvalidCSS(cssString: string | null | undefined) {
        if (!cssString) return "";
        const urlRegex1 = /((?:https:)?\/\/)([\S\-]+).nekoweb.org([\S]+)(\);)/gm;
        const urlRegex2 = '$1nekoweb.org/site/$2/files$3?original=1$4';
        const regex = /^(?!\.site-box|\.follow|\.post-box).*{/gm;
        const linkRegex = /(^.+url)\((?!["']?(?:(?:https?:)?\/\/([a-z0-9A-Z]+\.)?nekoweb\.org)|(?:\/)).+(\);?)/gm;
        let c = cssString.replace(
            regex,
            "/* This will not work in Nekoweb, unfortunately. */\n#WILL-NOT-WORK {",
        );
        c = c.replace(urlRegex1, urlRegex2).replaceAll('"', '').replaceAll("'", '');
        let clines = c.split("\n");
        clines.forEach((s, i) => {
            if (linkRegex.test(s)) {
                if (!/^\//.test(s.replace(linkRegex, '$2'))) {
                    clines[i] = s.replace(linkRegex, '$1);')
                }
            }
        });
        return clines.join('\n');
    }
</script>

<section class="editor-top">
	<div data-display="flex" id="nb-sitebox" class="tabLayout active">
		<div class="pre-pre-site nekoweb-colors">
			<div class="pre-site" style="">
				<div
					id="site"
					class="noreset site-box t-classic"
					style="width:275px!important;height:190px!important;position:relative!important"
				>
					<span class="noreset top-dot"></span>
					<a
						href="//jbcarreon123.nekoweb.org/"
						target="_blank"
						id="NOTUSEDINNEKOWEB_url"
						rel="noopener ugc"
						style="position:relative!important"
					>
						<div class="noreset sitefeature" style="position:relative!important">
							<img
								src="//nekoweb.org/screenshots/jbcarreon123/index_large.jpg"
								class="screenshot"
								id="NOTUSEDINNEKOWEB_screenshot"
								style="position:relative!important"
								alt="nekoweb sitebox screenshot"
							/>
						</div>
						<p class="noreset" style="position:relative!important">
							<span id="NOTUSEDINNEKOWEB_siteurl"> jbcarreon123.nekoweb.org </span>

							<span style="position:relative!important" class="noreset follow" title="Follow"
								>[+]</span
							>
						</p>
						<span
							class="noreset"
							style="position:relative!important"
							id="NOTUSEDINNEKOWEB_sitetitle">site title</span
						>
						<br />
					</a>
					<span class="noreset bottom-dot"></span>
				</div>
			</div>
		</div>
	</div>
	<div data-display="flex" id="nb-postbox" class="tabLayout">
		<div class="pre-pre-post noreset">
			<div class="pre-post noreset" style="">
				<a
					href="/"
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
								id="NOTUSEDINNEKOWEB_siteusername">jbcarreon123</span
							>
							<span class="noreset post-dot" style="position:relative!important">·</span>
							<span
								class="noreset post-date"
								style="position:relative!important"
								id="NOTUSEDINNEKOWEB_feeddate">5/2/2025</span
							>
							<h4
								class="noreset post-title"
								style="position:relative!important"
								id="NOTUSEDINNEKOWEB_feedtitle"
							>
								Example post
							</h4>

							<p
								class="noreset post-description"
								style="position:relative!important"
								id="NOTUSEDINNEKOWEB_feeddesc"
							>
								We're starting to formalize flexible opinions around our foundations at the end of
								the day highlights, and locked and loaded, but organic growth hammer out have
								bandwidth. The horse is out of the barn how much bandwidth do you have highlights.
								Corporate synergy we've bootstrapped the model.
							</p>

							<span class="noreset post-bottom-dot"></span>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
</section>
<section>
	<CodeMirror
		bind:value
		lang={css()}
		theme={gruvboxDark}
		on:change={() => editValue()}
		extensions={[lintGutter(), regexpLinter, langLinter]}
	/>
</section>
