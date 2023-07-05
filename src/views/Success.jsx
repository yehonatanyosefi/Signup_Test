import { useEffect } from 'react'
import MainWrapper from '../cmps/MainWrapper'
import Logo from '../cmps/Logo'

export default function Success() {
	useEffect(() => {
		document.title = 'Eramorph - Success'
	}, [])

	return (
		<MainWrapper>
			<div className="success">
				<Logo />
				<h1>Welcome to Eramorph!</h1>
				<p>We are happy and excited to have you join our community 👏</p>
				<a href="https://play.google.com/store/apps/details?id=com.scopely.monopolygo">
					<button className="img-btn">
						<img
							className="success-img"
							src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
							alt="Get it on Google Play"
						/>
					</button>
				</a>
			</div>
		</MainWrapper>
	)
}
