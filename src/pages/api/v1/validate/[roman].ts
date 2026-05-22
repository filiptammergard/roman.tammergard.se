import type { APIRoute } from "astro"
import { pattern } from "@tammergard/roman"
import { apiError, json, preflight } from "../../../../lib/api"
import { normalizeRoman } from "../../../../lib/roman"

export const GET: APIRoute = ({ params }) => {
	const raw = params.roman
	if (!raw) return apiError(400, "Missing roman numeral.")
	const normalized = normalizeRoman(raw)
	const valid = pattern.test(normalized)
	return json({ input: raw, normalized, valid })
}

export const OPTIONS: APIRoute = () => preflight()
