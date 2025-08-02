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

	const lightTheme = html.dataset.giscusLight || "light";
	const darkTheme = html.dataset.giscusDark || "dark";

	setGiscusTheme(isDark ? darkTheme : lightTheme);
	
	toggleButtons.forEach((btn) => {
		btn.textContent = isDark ? "☀︎" : "☾";

		btn.addEventListener("click", () => {
			const nowDark = html.classList.toggle(darkClass);
			localStorage.setItem("theme", nowDark ? darkClass : "light");

			toggleButtons.forEach((b) => {
				b.textContent = nowDark ? "☀︎" : "☾";
			});

		
			setGiscusTheme(nowDark ? darkTheme : lightTheme);
		});
	});
});



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