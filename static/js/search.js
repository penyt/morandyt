const searchInput = document.getElementById("searchBox");
const resultsList = document.getElementById("searchResults");

let documents = [];
let fuse = null;

function highlightMatch(text, match) {
	if (!match || !match.indices || match.indices.length === 0) {
		return escapeHtml(text);
	}

	let result = "";
	let lastIndex = 0;

	match.indices.forEach(([start, end]) => {
		result += escapeHtml(text.slice(lastIndex, start));
		result += `<mark>${escapeHtml(text.slice(start, end + 1))}</mark>`;
		lastIndex = end + 1;
	});

	result += escapeHtml(text.slice(lastIndex));
	return result;
}

function escapeHtml(str) {
	return str.replace(/[&<>"']/g, (m) => {
		return {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#039;",
		}[m];
	});
}

fetch("/index.json")
	.then((res) => res.json())
	.then((data) => {
		documents = data;

		fuse = new Fuse(documents, {
			keys: [
				{ name: "title", weight: 0.4 },
				{ name: "content", weight: 0.4 },
				{ name: "description", weight: 0.1 },
				{ name: "tags", weight: 0.1 },
				{ name: "categories", weight: 0.1 },
			],
			includeScore: true,
			// threshold: 0.1,
			includeMatches: true,
			useExtendedSearch: true,
			ignoreLocation: true,
			isCaseSensitive: false,
		});
	});

searchInput.addEventListener("input", function () {
	const query = this.value.trim();
	resultsList.innerHTML = "";

	if (query.length < 2 || !fuse) return;

	// const results = fuse.search(query);
	// const results = fuse.search(`'${query}`); // 注意這裡是 `'` 單引號字串搜尋
	const results = fuse.search({
	$or: [
		{ title: `'${query}` },
		{ content: `'${query}` },
		{ description: `'${query}` },
		{ tags: `'${query}` },
		{ categories: `'${query}` }, // ⚠️ 這行才是讓陣列比對成立的關鍵
	]
	});

	if (results.length === 0) {
		resultsList.innerHTML = "<li>no matches</li>";
		return;
	}

results.forEach((result) => {
	const item = document.createElement("li");

	// 標題 highlight
	const titleMatch = result.matches?.find((m) => m.key === "title");
	const title = highlightMatch(result.item.title, titleMatch);

	// 摘要 highlight（從 content 或 description）
	const contentMatch = result.matches?.find(
		(m) => m.key === "content" || m.key === "description"
	);

	let rawText =
		result.item.content?.slice(0, 200) ||
		result.item.description ||
		"";

	let snippet = highlightMatch(rawText, contentMatch);

	item.innerHTML = `
		<a href="${result.item.uri}">${title}</a>
		<p>${snippet}</p>
	`;
	resultsList.appendChild(item);
});
});
