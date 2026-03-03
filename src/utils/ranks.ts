const POINTS_BRONZE = 100
const POINTS_SILVER = 400
const POINTS_GOLD = 1000
const POINTS_PLATINUM = 2500

export const parseRank = [POINTS_BRONZE, POINTS_SILVER, POINTS_GOLD, POINTS_PLATINUM].flatMap(x => {
	const rank = x == 100 ? 'bronze' : x == 400 ? 'silver' : x == 1000 ? 'gold' : 'platinum'
	const rankText = {
		'bronze': 'Bronce',
		'silver': 'Plata',
		'gold': 'Oro',
		'platinum': 'Platino'
	}

	return Array(3).fill(null).map((_x, i) => ({
		rank,
		points: i == 0 ? x / 3 : i == 1 ? (x / 3) * 2 : x,
		text: `${rankText[rank]} ${i + 1}`,
		badge: `/${rank}${i + 1}.svg`
	}))
})