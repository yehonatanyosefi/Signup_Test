import { useEffect } from 'react'
import MainWrapper from '../cmps/MainWrapper'
import Logo from '../cmps/Logo'
export default function Error() {
	useEffect(() => {
		document.title = 'Eramorph - Error'
	}, [])
	return (
		<MainWrapper>
			<div className="error">
				<Logo />
				<p>Signup Failed, please try again.</p>
			</div>
		</MainWrapper>
	)
}
