import type { APIRoute } from "astro"
import { toRoman } from "@tammergard/roman"
import { json, preflight } from "../../../lib/api"
import { LATIN_MONTHS } from "../../../lib/roman"
import { getStockholmToday } from "../../../lib/today"

export const GET: APIRoute = () => {
	const { year, month, day } = getStockholmToday()
	return json(
		{
			date: {
				year,
				month,
				day,
				latinMonth: LATIN_MONTHS[month - 1],
			},
			arabic: { year, month, day },
			roman: {
				year: toRoman(year),
				month: toRoman(month),
				day: toRoman(day),
			},
			formatted: {
				latin: `${toRoman(day)} ${LATIN_MONTHS[month - 1]} ${toRoman(year)}`,
				compact: `${toRoman(day)} · ${toRoman(month)} · ${toRoman(year)}`,
			},
			timeZone: "Europe/Stockholm",
		},
		{ cache: "today" },
	)
}

export const OPTIONS: APIRoute = () => preflight()
