import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './assets/scss/main.scss'
// import { LOGIN, NOT_FOUND, SIGN_UP, HOME, PROFILE, PIC_CLASH, CREATE } from './routes'
// import { useDispatch } from 'react-redux'
const Home = lazy(() => import('./views/Home'))
const Signup = lazy(() => import('./views/Signup'))
const NotFound = lazy(() => import('./views/NotFound'))

export default function App() {
	// const dispatch = useDispatch()

	// 	useEffect(() => {
	// 		dispatch(doLogin('test@gmail.com', 'test12'))
	// 	}, [])
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<BrowserRouter>
				<section className="main-app">
					{/* <AppHeader /> */}
					<main className="container">
						<Routes>
							<Route path="/signup" element={<Signup />} />
                            {/* <Route path={LOGIN} element={<Login />} />
                            <Route path={SIGN_UP} element={<Signup />} />
                            <Route path={PROFILE} element={<Profile />} /> */}
                            <Route path="/" element={<Home />} />
                            <Route path={'/404'} element={<NotFound />} />
                            <Route path="*" element={<Navigate to="/404" replace />} />
						</Routes>
					</main>
				</section>
			</BrowserRouter>
		</Suspense>
	)
}
