// Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
	const menuToggle = document.querySelector(".menu-toggle");
	const menu = document.querySelector(".menu");

	menuToggle.addEventListener("click", () => {
		menuToggle.classList.toggle("open");
		menu.classList.toggle("open");
		menuToggle.textContent = menuToggle.classList.contains("open")
			? "✕"
			: "☰";
	});
});


// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
	const toggleButtons = document.querySelectorAll(".toggle");
	const html = document.documentElement;
	const darkClass = "dark";

	const defaultColor = html.dataset.defaultColor || "light";
	const userPref = localStorage.getItem("theme");

	const isDark = userPref
		? userPref === darkClass
		: defaultColor === darkClass;
	html.classList.toggle(darkClass, isDark);

	// Chroma
	const lightLink = document.getElementById("chromaLight");
	const darkLink  = document.getElementById("chromaDark");
	if (lightLink && darkLink) {
		lightLink.disabled = isDark;
		darkLink.disabled  = !isDark;
	} // Chroma

	const lightTheme = html.dataset.giscusLight || "light";
	const darkTheme = html.dataset.giscusDark || "dark";

	setGiscusTheme(isDark ? darkTheme : lightTheme);
	
	toggleButtons.forEach((btn) => {
		btn.textContent = isDark ? "✸" : "☾";

		btn.addEventListener("click", () => {
			const nowDark = html.classList.toggle(darkClass);
			localStorage.setItem("theme", nowDark ? darkClass : "light");

			toggleButtons.forEach((b) => {
				b.textContent = nowDark ? "✸" : "☾";
			});

			// Chroma
			if (lightLink && darkLink) {
				lightLink.disabled = nowDark;
				darkLink.disabled  = !nowDark;
			} // Chroma
		
			setGiscusTheme(nowDark ? darkTheme : lightTheme);
		});
	});
});


// Set giscus' theme
function setGiscusTheme(themeName) {
	const iframe = document.querySelector("iframe.giscus-frame");
	if (!iframe) return;
	iframe.contentWindow.postMessage(
		{
			giscus: {
				setConfig: {
					theme: themeName,
				},
			},
		},
		"https://giscus.app"
	);
}

// Code block copy button
(function () {
	function getCodeEl(root) {
		const tableCode = root.querySelector('.lntable td:nth-child(2) code');
		if (tableCode) return tableCode;
		return root.querySelector('pre code') || root.querySelector('code');
	}

	function setBtnMsg(btn, msg) {
		const old = btn.textContent;
		btn.textContent = msg;
		btn.disabled = true;
		setTimeout(() => {
			btn.textContent = old;
			btn.disabled = false;
		}, 1200);
	}

	async function doCopy(btn) {
		const root = btn.closest('.codewrap, .chroma') || document;
		const code = getCodeEl(root);
		if (!code) return setBtnMsg(btn, 'No code');

		const text = code.innerText.replace(/\n+$/, '');
		try {
			await navigator.clipboard.writeText(text);
		setBtnMsg(btn, 'Copied');
		} catch (e) {
			setBtnMsg(btn, 'Failed');
		}
		}

	document.addEventListener('click', (e) => {
		const btn = e.target.closest('.code-copy');
		if (btn) doCopy(btn);
	}, true);
})();