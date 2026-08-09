import { MAX, MIN } from "./roman"

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
	"Access-Control-Max-Age": "86400",
}

export type CachePolicy = "static" | "today"

function cacheControl(policy: CachePolicy): string {
	switch (policy) {
		case "static":
			return "public, max-age=0, s-maxage=604800, stale-while-revalidate=86400"
		case "today":
			return `public, max-age=0, s-maxage=${secondsUntilStockholmMidnight()}, stale-while-revalidate=300`
	}
}

function secondsUntilStockholmMidnight(): number {
	const parts = new Intl.DateTimeFormat("sv-SE", {
		timeZone: "Europe/Stockholm",
		hourCycle: "h23",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).formatToParts(new Date())
	const get = (type: string) =>
		Number(parts.find((part) => part.type === type)?.value)
	const elapsed = get("hour") * 3600 + get("minute") * 60 + get("second")
	return 86400 - elapsed
}

export function json(
	data: unknown,
	{ cache = "static" }: { cache?: CachePolicy } = {},
) {
	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": cacheControl(cache),
			...CORS_HEADERS,
		},
	})
}

export function apiError(status: number, message: string, details?: unknown) {
	return new Response(
		JSON.stringify({
			error: { status, message, ...(details ? { details } : {}) },
		}),
		{
			status,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store",
				...CORS_HEADERS,
			},
		},
	)
}

export function preflight() {
	return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export type ParseResult<T> =
	{ ok: true; value: T } | { ok: false; status: 400 | 422; message: string }

export function parseArabic(value: string | undefined): ParseResult<number> {
	if (value == null || value === "") {
		return { ok: false, status: 400, message: "Missing number." }
	}
	if (!/^\d+$/.test(value)) {
		return {
			ok: false,
			status: 400,
			message: `Invalid number "${value}". Must be a positive integer.`,
		}
	}
	const n = Number(value)
	if (n < MIN || n > MAX) {
		return {
			ok: false,
			status: 422,
			message: `Invalid number "${value}". Must be between ${MIN} and ${MAX}.`,
		}
	}
	return { ok: true, value: n }
}

export function parseRoman(value: string | undefined): ParseResult<string> {
	if (value == null || value === "") {
		return { ok: false, status: 400, message: "Missing roman numeral." }
	}
	const upper = value.toUpperCase()
	if (!/^[IVXLCDM]+$/.test(upper)) {
		return {
			ok: false,
			status: 400,
			message: `Invalid roman numeral "${value}". Must consist of the letters I, V, X, L, C, D, M.`,
		}
	}
	const VALID = /^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/
	if (!VALID.test(upper)) {
		return {
			ok: false,
			status: 422,
			message: `"${value}" is not a well-formed roman numeral.`,
		}
	}
	return { ok: true, value: upper }
}
