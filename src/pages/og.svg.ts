import { toRoman } from "@tammergard/roman"
import { LATIN_MONTHS } from "../lib/roman"
import { getStockholmToday } from "../lib/today"

function escapeXml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}

export async function GET() {
	const { year, month, day } = getStockholmToday()
	const dayRoman = toRoman(day)
	const monthLatin = LATIN_MONTHS[month - 1] ?? ""
	const yearRoman = toRoman(year)

	const headline = escapeXml(`${dayRoman} · ${monthLatin} · ${yearRoman}`)

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<defs>
		<linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#ece2c9"/>
			<stop offset="100%" stop-color="#d8c9a3"/>
		</linearGradient>
	</defs>
	<rect width="1200" height="630" fill="url(#stone)"/>
	<rect x="40" y="40" width="1120" height="550" fill="none" stroke="#1f1812" stroke-width="3"/>
	<rect x="56" y="56" width="1088" height="518" fill="none" stroke="#1f1812" stroke-width="1"/>
	<text x="600" y="160" font-family="Cinzel, Georgia, serif" font-size="22" fill="#5d4a36" text-anchor="middle" letter-spacing="14" font-weight="600">S · P · Q · R</text>
	<line x1="500" y1="200" x2="700" y2="200" stroke="#1f1812" stroke-width="1"/>
	<text x="600" y="320" font-family="Cinzel, Georgia, serif" font-size="160" font-weight="800" fill="#1f1812" text-anchor="middle" letter-spacing="12">NUMERI</text>
	<text x="600" y="400" font-family="Cinzel, Georgia, serif" font-size="34" fill="#5d4a36" text-anchor="middle" letter-spacing="18" font-weight="600">ROMANORUM</text>
	<line x1="400" y1="450" x2="800" y2="450" stroke="#1f1812" stroke-width="1"/>
	<text x="600" y="510" font-family="Cinzel, Georgia, serif" font-size="32" fill="#1f1812" text-anchor="middle" letter-spacing="8" font-weight="600">${headline}</text>
	<text x="600" y="565" font-family="Cinzel, Georgia, serif" font-size="20" fill="#5d4a36" text-anchor="middle" letter-spacing="6">roman.tammergard.se</text>
</svg>`

	return new Response(svg, {
		headers: {
			"Content-Type": "image/svg+xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	})
}
