import { Link } from 'react-router-dom'
import { SvgIcon } from './util/SvgIcon'

export default function Logo() {
	return (
		<header className="logo-header">
			<Link to={'/'}>
				<SvgIcon iconName="logo" className="logo" alt="Eramorph logo" />
			</Link>
			<h1 className="signup-header">Eramorph</h1>
			<h5 className="sub-header">Evolve. Constantly.</h5>
		</header>
	)
}
