import { Link, useLocation, useSearchParams } from 'wouter'
import styles from './styles.module.scss'
import { PiCaretLeftBold, PiPlusBold } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Api from '../../utils/api'
import LoadingPage from '../../components/LoadingPage'
import Posts from '../../components/Posts'

const Community = () => {
	const [searchParams] = useSearchParams()
	const page = searchParams.get('page')
	const [, navigate] = useLocation()
	const [posts, setPosts] = useState<Post[]>()

	useEffect(() => {
		Api.getPosts(page).then(setPosts)
	}, [page])

	return (
		<div className={styles.community}>
			<button className={styles.add} onClick={() => navigate('/add')}>
				<PiPlusBold />
			</button>
			{posts === undefined && <LoadingPage absolute />}
			<Link to='~/'>
				<div className={styles.icon}>
					<PiCaretLeftBold />
				</div>
				Atrás
			</Link>
			<h3>Posts de la comunidad</h3>
			{posts && <Posts posts={posts} />}
		</div>
	)
}

export default Community