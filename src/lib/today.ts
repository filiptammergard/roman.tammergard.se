export function getStockholmToday() {
	const parts = new Intl.DateTimeFormat("sv-SE", {
		timeZone: "Europe/Stockholm",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).formatToParts(new Date())
	const get = (type: string) =>
		Number(parts.find((part) => part.type === type)?.value)
	return { year: get("year"), month: get("month"), day: get("day") }
}
