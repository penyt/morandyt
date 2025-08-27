const searchInput = document.getElementById("searchBox");
const resultsList = document.getElementById("searchResults");
let documents = [];
let fuse = null;

function escapeHtml(str) {
	return String(str).replace(/[&<>"']/g, (m) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	})[m]);
}

function highlightMatch(text, matchLike) {
	const textSafe = String(text ?? "");
	const indices = (matchLike && matchLike.indices) ? matchLike.indices : [];

	if (!indices.length) return escapeHtml(textSafe);

	const merged = [];
	indices
		.slice()
		.sort((a, b) => a[0] - b[0])
		.forEach(([s, e]) => {
		if (!merged.length || s > merged[merged.length - 1][1] + 1) {
			merged.push([s, e]);
		} else {
			merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
		}
		});

	let out = "";
	let last = 0;
	merged.forEach(([s, e]) => {
		out += escapeHtml(textSafe.slice(last, s));
		out += "<mark>" + escapeHtml(textSafe.slice(s, e + 1)) + "</mark>";
		last = e + 1;
	});
	out += escapeHtml(textSafe.slice(last));
	return out;
}

/**
 * Extracts a snippet from the full text centered around the first match,
 * and converts the indices within this snippet into local indices.
 * @param {string} fullText The original text
 * @param {Array<[number,number]>} indices The match intervals in the full text (can be multiple ranges)
 * @param {number} radius The snippet radius
 * @returns {{ snippet: string, localMatch:{indices:Array<[number,number]>} }}
 */
function sliceAroundFirstHit(fullText, indices, radius = 80) {
	const raw = String(fullText ?? "");
	if (!indices || !indices.length) {
		const cut = raw.slice(0, 200);
		return {
		snippet: escapeHtml(cut) + (raw.length > 200 ? "…" : ""),
		localMatch: { indices: [] },
		};
	}

	const [start, end] = indices[0];
	let from = Math.max(0, start - radius);
	let to = Math.min(raw.length, end + 1 + radius);

	const softStart = raw.lastIndexOf(" ", from + 5);
	const softEnd = raw.indexOf(" ", to - 5);
	from = softStart > 0 ? softStart : from;
	to = softEnd > 0 ? softEnd : to;

	const slice = raw.slice(from, to);

	const local = [];
	for (const [s, e] of indices) {
		const S = Math.max(s, from);
		const E = Math.min(e, to - 1);
		if (S <= E) {
		local.push([S - from, E - from]);
		}
	}

	const headEllip = from > 0 ? "…" : "";
	const tailEllip = to < raw.length ? "…" : "";

	return {
		snippet: headEllip + highlightMatch(slice, { indices: local }) + tailEllip,
		localMatch: { indices: local },
	};
}

// Fuse
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
		includeMatches: true,
		useExtendedSearch: true,
		ignoreLocation: true,
		isCaseSensitive: false,
		// threshold: 0.1,
		findAllMatches: true,
		minMatchCharLength: 2,
		});
	});

	searchInput.addEventListener("input", function () {
	const query = this.value.trim();
	resultsList.innerHTML = "";
	if (query.length < 2 || !fuse) return;
	const results = fuse.search({
		$or: [
		{ title: `'${query}` },
		{ content: `'${query}` },
		{ description: `'${query}` },
		{ tags: `'${query}` },
		{ categories: `'${query}` },
		],
	});

	if (results.length === 0) {
		resultsList.innerHTML = "<li>no matches</li>";
		return;
	}

	results.forEach((result) => {
		const li = document.createElement("li");

		const titleMatch = result.matches?.find((m) => m.key === "title");
		const titleHTML = highlightMatch(result.item.title || "", titleMatch);

		const contentMatches = (result.matches || []).filter(
		(m) => m.key === "content" || m.key === "description"
		);

		let rawText = "";
		let indices = [];
		if (contentMatches.length) {
		const chosen = contentMatches[0];
		rawText = (chosen.key === "content" ? result.item.content : result.item.description) || "";
		indices = chosen.indices || [];
		} else {

		rawText = result.item.content || result.item.description || "";
		indices = [];
		}

		const { snippet } = sliceAroundFirstHit(rawText, indices, 80);

		li.innerHTML = `
		<a href="${result.item.uri}">${titleHTML}</a>
		<p>${snippet}</p>
		`;
		resultsList.appendChild(li);
	});
});