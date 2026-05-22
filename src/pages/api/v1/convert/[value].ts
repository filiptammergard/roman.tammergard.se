import type { APIRoute } from "astro"
import { fromRoman, toRoman } from "@tammergard/roman"
import { apiError, json, preflight } from "../../../../lib/api"
import { MAX, MIN, detect } from "../../../../lib/roman"

export const GET: APIRoute = ({ params }) => {
	const raw = params.value
	if (!raw) return apiError(400, "Missing value.")
	const detected = detect(raw)
	if (detected.kind === "invalid") {
		return apiError(400, detected.reason)
	}
	if (detected.kind === "arabic") {
		if (detected.value < MIN || detected.value > MAX) {
			return apiError(
				422,
				`Invalid number ${detected.value}. Must be between ${MIN} and ${MAX}.`,
			)
		}
		return json({
			kind: "arabic",
			input: raw,
			arabic: detected.value,
			roman: toRoman(detected.value),
		})
	}
	const VALID =
		/^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/
	if (!VALID.test(detected.value)) {
		return apiError(
			422,
			`"${detected.value}" is not a well-formed roman numeral.`,
		)
	}
	return json({
		kind: "roman",
		input: raw,
		roman: detected.value,
		arabic: fromRoman(detected.value),
	})
}

export const OPTIONS: APIRoute = () => preflight()
