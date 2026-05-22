import type { APIRoute } from "astro"
import { fromRoman } from "@tammergard/roman"
import { apiError, json, parseRoman, preflight } from "../../../../lib/api"

export const GET: APIRoute = ({ params }) => {
	const parsed = parseRoman(params.roman)
	if (!parsed.ok) return apiError(parsed.status, parsed.message)
	const arabic = fromRoman(parsed.value)
	return json({ roman: parsed.value, arabic })
}

export const OPTIONS: APIRoute = () => preflight()
