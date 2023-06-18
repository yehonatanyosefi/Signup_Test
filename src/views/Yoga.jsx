import { useState } from 'react'
import Pose from '../cmps/Pose'

export default function Yoga() {
	const [target, setTarget] = useState('')
	const [video, setVideo] = useState('')
	return (
		<div>
			<h1>Yoga</h1>
			<div>
				<Pose />
			</div>
		</div>
	)
}
