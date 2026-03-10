export const convertImage = (img: HTMLImageElement, name: string, square: boolean, size = 1000): Promise<File> | undefined => {
	URL.revokeObjectURL(img.src)

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	canvas.width = square ? size : img.naturalWidth > img.naturalHeight ? size : img.naturalWidth * (size / img.naturalHeight)
	canvas.height = square ? canvas.width : img.naturalHeight > img.naturalWidth ? size : img.naturalHeight * (size / img.naturalWidth)

	const imgWidth = img.naturalWidth
	const imgHeight = img.naturalHeight

	const scale = Math.min(size / imgWidth, size / imgHeight)

	const scaledWidth = imgWidth * scale
	const scaledHeight = imgHeight * scale

	if (context) {
		context.drawImage(img, square ? (size - scaledWidth) / 2 : 0, square ? (size - scaledHeight) / 2 : 0, square ? scaledWidth : canvas.width, square ? scaledHeight : canvas.height)
		
		context.globalCompositeOperation = 'destination-over'
		context.fillStyle = '#ffffff'
		context.fillRect(0, 0, canvas.width, canvas.width)

		return new Promise((res, rej) => {
			canvas.toBlob(blob => {
				if (blob) {
					const newThumb = new File([blob], name)

					res(newThumb)
				}

				rej('Error to convert')
			}, 'image/jpeg', 0.6)
		})
	}

	return undefined
}

export const imageURL = (uuid: string) => {
	return `/api/images/${uuid}`
}