import Logo from './Logo'
export default function MainWrapper({ children }) {
	return (
		<main className="main-wrapper">
			<Logo />
			{children}
		</main>
	)
}
