import { useEffect } from 'react'

export default function Home() {
	useEffect(() => {
		document.title = 'Eramorph - Home'
	}, [])

	return <div className="home">Home</div>
}
