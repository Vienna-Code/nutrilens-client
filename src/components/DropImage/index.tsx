import { useRef, type ChangeEvent, type Dispatch, type DragEvent, type SetStateAction } from 'react'
import styles from './styles.module.scss'
import { PiImages, PiXBold } from 'react-icons/pi'
import { convertImage, imageURL } from '../../utils/images'
import { Reorder } from 'framer-motion'

type FileType = File
type FileType2 = File|string

const DropImage = <ImageType extends FileType|FileType2>({ images, setImages, type, label, alt = false, square = true, limit, disabled = false }: { images: Images<ImageType>, setImages: Dispatch<SetStateAction<Images<ImageType>>>, type: string, label: string, alt?: boolean, square?: boolean, limit?: number, disabled?: boolean }) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.add(styles.active)
	}

	const handleMouseLeave = (e: DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove(styles.active)
	}

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.currentTarget.classList.remove(styles.active)

		if (!(e.dataTransfer.files && e.dataTransfer.files[0])) return
		
		const file = e.dataTransfer.files[0]

		const img = new Image()
		img.src = URL.createObjectURL(file)
		img.addEventListener('load', async () => {
			const newThumb = await convertImage(img, file.name, square)

			if (newThumb) {
				if (limit) {
					const isLimit = images.length === limit
					console.log(isLimit)
					
					if (isLimit) return setImages(prev => [{ id: images.length + 1, image: newThumb }, ...prev.filter((_x, i) => i !== 0)] as Images<ImageType>)
				}
				
				setImages(prev => [{id: images.length + 1, image: newThumb}, ...prev] as Images<ImageType>)
			}
		})
	}
	
	const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.currentTarget

		if (!files) return

		const file = files[0]

		const img = new Image()
		img.src = URL.createObjectURL(file)
		img.addEventListener('load', async () => {
			const newThumb = await convertImage(img, file.name, square)

			if (newThumb) {
				if (limit) {
					const isLimit = images.length === limit
					console.log(isLimit)
					
					if (isLimit) return setImages(prev => [{ id: images.length + 1, image: newThumb }, ...prev.filter((_x, i) => i !== 0)] as Images<ImageType>)
				}
				
				setImages(prev => [{id: images.length + 1, image: newThumb}, ...prev] as Images<ImageType>)
			}
		})

		e.currentTarget.value = ''
	}

	const deleteImage = (id: number) => () => {
		setImages(prev => prev.filter(x => x.id !== id))
	}
	
	return (
		<div className={`${styles.dropImage} ${disabled ? styles.disabled : ''}`}>
			<div className={styles.dropArea} onClick={() => inputRef.current?.click()} onDragEnter={handleDragEnter}
			onDragLeave={handleMouseLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
				<label htmlFor="file">{label}</label>
				<div className={styles.icon}>
					<PiImages />
				</div>
				<div className={styles.info}>
					<p>Arrastra y suelta imágenes {alt ? 'para el' : 'del'} {type}</p>
					<span>O haz click para subirlas desde tu dispositivo</span>
				</div>
				<input type="file" onChange={handleFile} ref={inputRef} accept='image/*' id='file' disabled={disabled} />
			</div>
			{images.length > 0 &&
				<Reorder.Group axis='x' values={images} onReorder={setImages} as='div' className={styles.imageList}>
					{images.map((image) => {
						return (
							<Reorder.Item key={image.id} value={image} as='div' layout='position' className={styles.image}>
								<button type='button' onClick={deleteImage(image.id)}>
									<PiXBold />
								</button>
								<img src={typeof image.image === 'string' ? imageURL(image.image) : URL.createObjectURL(image.image)} alt="" />
							</Reorder.Item>
						)
					})}
				</Reorder.Group>
			}
		</div>
	)
}

export default DropImage