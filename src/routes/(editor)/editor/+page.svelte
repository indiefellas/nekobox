<script lang="ts">

	import CodeMirror from 'svelte-codemirror-editor';
	import { css } from '@codemirror/lang-css';
	import { gruvboxDark } from '@fsegurai/codemirror-theme-bundle';
	import { onMount } from 'svelte';
	import { linter, lintGutter, type Diagnostic } from '@codemirror/lint';
	import { syntaxTree } from '@codemirror/language';
	import NekowebSitebox from '../../../components/nekoweb-sitebox.svelte';
	import NekowebPostbox from '../../../components/nekoweb-postbox.svelte';

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

	onMount(() => {
		if (navigator.storage && navigator.storage.persist) {
			navigator.storage.persist().then((persistent) => {
				if (persistent) {
					console.log('Storage will not be cleared except by explicit user action');
				} else {
					console.log('Storage may be cleared by the UA under storage pressure.');
				}
			});
		}

		document.querySelectorAll('#editor-controls .rightside button').forEach(el => {
			el.addEventListener('click', () => {
				document.querySelectorAll('#editor-top > div > div').forEach((e) => {
					if (e.id == el.dataset.id) {
						e.style.display = null
					} else {
						e.style.display = 'none'
					}
				})
				document.querySelectorAll('#editor-controls .rightside button').forEach(e => {
					e.classList.remove('active');
				}) 
				el.classList.add('active');
			})
			
		})

		document.querySelectorAll('#nb-settings aside button').forEach(el => {
			el.addEventListener('click', () => {
				document.querySelectorAll('#nb-settings > div > div').forEach((e) => {
					if (e.id == el.dataset.id) {
						e.style.display = null
					} else {
						e.style.display = 'none'
					}
				})
				document.querySelectorAll('#nb-settings aside button').forEach(e => {
					e.classList.remove('active');
				}) 
				el.classList.add('active');
			})
			
		})
	})
</script>

<div id="editor-container">
	<header id="editor-controls">
		<div class="leftside">
			<button>File</button>
			<button>Edit</button>
			<button>Help</button>
		</div>
		<div class="rightside">
			<button class="active" data-id="nb-sitebox">Sitebox</button>
			<button data-id="nb-postbox">Postbox</button>
			<button data-id="nb-followbtn">Follow Button</button>
			<button data-id="nb-settings">Settings</button>
		</div>
	</header>
	<section id="editor-top">
		<div>
			<div id="nb-sitebox">
				<NekowebSitebox/>
			</div>
			<div id="nb-postbox" style="display: none;">
				<NekowebPostbox/>
			</div>
			<div id="nb-followbtn" style="display: none;">
				<button class="follow follow-3926" title="Follow">Follow <span class="on-nekoweb"> on Nekoweb</span></button>
			</div>
			<div id="nb-settings" style="display: none;">
				<aside>
					<button class="active" data-id="nbs-general">
						General
					</button>
					<button data-id="nbs-elements">
						Elements
					</button>
					<button data-id="nbs-danger">
						Danger Zone
					</button>
					<button data-id="nbs-about">
						About Nekobox
					</button>
				</aside>
				<div>
					<div id="nbs-general">

					</div>
					<div id="nbs-elements" style="display: none;">
						
					</div>
					<div id="nbs-danger" style="display: none;">
						
					</div>
					<div id="nbs-about" style="display: none;">
						<h2>Nekobox2 <span style="font-size: 1rem">2.0.0-alpha1</span></h2>
						<p>by jbcarreon123 & indiefellas</p>
						<p>An online Nekoweb elements.css previewer/editor </p>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section id="editor-codemirror">
		<CodeMirror
			bind:value
			lang={css()}
			theme={gruvboxDark}
			on:change={() => editValue()}
			extensions={[lintGutter(), regexpLinter, langLinter]}
		/>
	</section>
</div>
