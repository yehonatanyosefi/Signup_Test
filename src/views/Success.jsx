import { useEffect } from 'react'

export default function Success() {
	useEffect(() => {
		document.title = 'Eramorph - Success'
	}, [])

	return (
		<div className="success">
			Signup succeeded, please download the app here:
			<a href="https://play.google.com/store/apps/details?id=com.scopely.monopolygo">
				<button>
					<img
						src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
						alt="Get it on Google Play"
					/>
				</button>
			</a>
		</div>
	)
}
