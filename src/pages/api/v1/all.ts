import type { APIRoute } from "astro"
import { toRoman } from "@tammergard/roman"
import { MAX, MIN } from "../../../lib/roman"
import { json, preflight } from "../../../lib/api"

export const GET: APIRoute = () => {
	const items: Array<{ arabic: number; roman: string }> = []
	for (let n = MIN; n <= MAX; n++) {
		items.push({ arabic: n, roman: toRoman(n) })
	}
	return json(items)
}

export const OPTIONS: APIRoute = () => preflight()
