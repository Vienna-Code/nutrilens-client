import styles from './styles.module.scss'
import MiniPost from '../MiniPost'

const Posts = ({ posts }: { posts: Post[] }) => {
	return (
		<div className={styles.posts}>
			{posts && posts.map(post => <MiniPost key={post.id} post={post} />)}
		</div>
	)
}

export default Posts