export const parseHour = (date: string) => {
	const newDate = new Date(date)
	const withoutTimezone = new Date(newDate.toISOString().slice(0, -1))

	return withoutTimezone
}