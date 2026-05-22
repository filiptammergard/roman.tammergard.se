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
			<stop offset="0%" stop-color="#e8dcc0"/>
			<stop offset="100%" stop-color="#cdb888"/>
		</linearGradient>
		<radialGradient id="vignette" cx="50%" cy="50%" r="65%">
			<stop offset="60%" stop-color="rgba(0,0,0,0)"/>
			<stop offset="100%" stop-color="rgba(0,0,0,0.18)"/>
		</radialGradient>
	</defs>
	<rect width="1200" height="630" fill="url(#stone)"/>
	<rect width="1200" height="630" fill="url(#vignette)"/>
	<rect x="36" y="36" width="1128" height="558" fill="none" stroke="#1a130c" stroke-width="3"/>
	<rect x="52" y="52" width="1096" height="526" fill="none" stroke="#1a130c" stroke-width="1"/>
	<text x="600" y="130" font-family="Cinzel, Georgia, serif" font-size="22" fill="#5a4528" text-anchor="middle" letter-spacing="20" font-weight="600">S · P · Q · R</text>
	<line x1="500" y1="160" x2="700" y2="160" stroke="#1a130c" stroke-width="1"/>
	<text x="600" y="270" font-family="Cinzel, Georgia, serif" font-size="110" font-weight="800" fill="#1a130c" text-anchor="middle" letter-spacing="14">ROMAN</text>
	<text x="600" y="370" font-family="Cinzel, Georgia, serif" font-size="80" font-weight="800" fill="#1a130c" text-anchor="middle" letter-spacing="14">NUMERALS</text>
	<!-- Tabula ansata for date -->
	<g transform="translate(600, 480)">
		<rect x="-280" y="-30" width="560" height="60" fill="#d4c399" stroke="#1a130c" stroke-width="2"/>
		<rect x="-275" y="-25" width="550" height="50" fill="none" stroke="#1a130c" stroke-width="1"/>
		<polygon points="-280,-25 -305,-15 -305,15 -280,25" fill="#d4c399" stroke="#1a130c" stroke-width="2"/>
		<polygon points="280,-25 305,-15 305,15 280,25" fill="#d4c399" stroke="#1a130c" stroke-width="2"/>
		<text x="0" y="11" font-family="Cinzel, Georgia, serif" font-size="32" fill="#1a130c" text-anchor="middle" letter-spacing="10" font-weight="600">${headline}</text>
	</g>
	<text x="600" y="570" font-family="Cinzel, Georgia, serif" font-size="18" fill="#5a4528" text-anchor="middle" letter-spacing="8">roman.tammergard.se</text>
</svg>`

	return new Response(svg, {
		headers: {
			"Content-Type": "image/svg+xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	})
}
