import { fromRoman, pattern, toRoman } from "@tammergard/roman"

export const MIN = 1
export const MAX = 3999

export const LATIN_MONTHS = [
	"Ianuarius",
	"Februarius",
	"Martius",
	"Aprilis",
	"Maius",
	"Iunius",
	"Iulius",
	"Augustus",
	"September",
	"October",
	"November",
	"December",
] as const

export const ENGLISH_MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const

export function safeToRoman(arabic: number): string | null {
	try {
		return toRoman(arabic)
	} catch {
		return null
	}
}

export function safeFromRoman(roman: string): number | null {
	try {
		return fromRoman(roman)
	} catch {
		return null
	}
}

export function isValidRoman(roman: string): boolean {
	return pattern.test(roman)
}

export function normalizeRoman(input: string): string {
	return input.trim().toUpperCase()
}

export type Detected =
	| { kind: "arabic"; value: number }
	| { kind: "roman"; value: string }
	| { kind: "invalid"; reason: string }

export function detect(raw: string): Detected {
	const trimmed = raw.trim()
	if (trimmed === "") return { kind: "invalid", reason: "Empty input." }
	if (/^-?\d+$/.test(trimmed)) {
		return { kind: "arabic", value: Number(trimmed) }
	}
	const upper = trimmed.toUpperCase()
	if (/^[IVXLCDM]+$/.test(upper)) {
		return { kind: "roman", value: upper }
	}
	return {
		kind: "invalid",
		reason: `"${raw}" is neither an integer nor a roman numeral.`,
	}
}

export function latinDate(month: number, day: number, year: number): string {
	const m = LATIN_MONTHS[month - 1] ?? ""
	return `${toRoman(day)} ${m} ${toRoman(year)}`
}

export function englishDate(month: number, day: number, year: number): string {
	const m = ENGLISH_MONTHS[month - 1] ?? ""
	return `${m} ${day}, ${year}`
}
