import { toRoman } from "@tammergard/roman"
import { LATIN_MONTHS } from "../lib/roman"
import { getStockholmToday } from "../lib/today"

export async function GET() {
	const { year, month, day } = getStockholmToday()
	return Response.json(
		{
			arabic: { year, month, day },
			roman: {
				year: toRoman(year),
				month: toRoman(month),
				day: toRoman(day),
			},
			latin: `${toRoman(day)} ${LATIN_MONTHS[month - 1]} ${toRoman(year)}`,
		},
		{
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
			},
		},
	)
}
