import { SvgIcon } from './util/SvgIcon'
export default function MainWrapper({ children }) {
	return (
		<section className="main-wrapper">
			<SvgIcon iconName={'bg-mobile-rounded-svg'} className="bg-mobile-rounded-svg" />
			<div className="lines first-line"></div>
			<div className="lines second-line"></div>
			{children}
		</section>
	)
}
