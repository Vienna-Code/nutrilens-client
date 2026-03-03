import styles from './styles.module.scss'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi'

type Props = {
	viewImages?: number,
	setViewImages: Dispatch<SetStateAction<number | undefined>>,
	images: string[]
}

const ImageVisualizer = ({ viewImages, setViewImages, images }: Props) => {
	const [startImages, setStartImages] = useState(0)
	const [bullet, setBullet] = useState<number>()
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: startImages })

	const handleBullets = useCallback((emblaApi: EmblaCarouselType) => {
		setBullet(emblaApi.selectedScrollSnap())
	}, [])

	useEffect(() => {
		setBullet(viewImages)

		if (viewImages === undefined) return
		setStartImages(viewImages)
	}, [viewImages])

	useEffect(() => {
		if (emblaApi) emblaApi.on('select', handleBullets)
	}, [emblaApi, handleBullets])

	const prevImage = () => {
		if (emblaApi) emblaApi.scrollPrev()
	}

	const nextImage = () => {
		if (emblaApi) emblaApi.scrollNext()
	}

	const handleBullet = (index: number) => () => {
		if (emblaApi) emblaApi.scrollTo(index)
	}
	
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.viewImagesWrapper}>
			<div ref={emblaRef} className={`${styles.viewImages} embla`}>
				<div className={`${styles.images} embla__container`} style={{ width: `${images.length * 100}%` }}>
					{images.map(uuid => {
						const url = `${import.meta.env.VITE_API_URL}/images/${uuid}`
						
						return (
							<div className={`${styles.image} embla__slide`} key={url} onClick={() => setViewImages(undefined)}>
								<div className={styles.pic} onClick={e => e.stopPropagation()}>
									<picture>
										<img src={url} alt="" />
									</picture>
								</div>
							</div>
						)
					})}
				</div>
				{images.length > 1 &&
					<>
						<button onClick={prevImage} className={styles.left}><PiCaretLeftBold /></button>
						<button onClick={nextImage} className={styles.right}><PiCaretRightBold /></button>
					</>
				}
				<div className={styles.bullets}>
					{images.map((_, i) => (
						<div key={i} className={`${styles.bullet} ${i == bullet ? styles.active : ''}`} onClick={handleBullet(i)}></div>
					))}
				</div>
			</div>
		</motion.div>
	)
}

export default ImageVisualizer