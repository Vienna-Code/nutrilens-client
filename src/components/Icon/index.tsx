const Icon = ({ color }: { color: string }) => {
	return (
		<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		style={{
			fillRule: "evenodd",
			clipRule: "evenodd",
			strokeLinejoin: "round",
			strokeMiterlimit: 2,
		}}
		viewBox="0 0 260 260">
			<path
			d="M0 0h259.2v259.2H0z"
			style={{
				fill: "none",
			}} />
			<path
			d="m87.355 205.488-47.47 39.487-20.118-20.118 31.393-51.333-22.36-53.983 30.846-74.47 74.47-30.846 74.47 30.846 30.847 74.47-30.847 74.47-74.47 30.846-46.761-19.369Zm46.761-104.308-26.088-25.169-24.324 23.466v29.012l50.412 48.635 50.412-48.635V99.477l-24.324-23.466-26.088 25.169Z"
			style={{
				fill: color,
			}} />
		</svg>
	)
}

export default Icon