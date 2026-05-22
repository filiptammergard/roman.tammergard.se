import type { APIRoute } from "astro"
import { toRoman } from "@tammergard/roman"
import { apiError, json, parseArabic, preflight } from "../../../../lib/api"

export const GET: APIRoute = ({ params }) => {
	const parsed = parseArabic(params.n)
	if (!parsed.ok) return apiError(parsed.status, parsed.message)
	const roman = toRoman(parsed.value)
	return json({ arabic: parsed.value, roman })
}

export const OPTIONS: APIRoute = () => preflight()
