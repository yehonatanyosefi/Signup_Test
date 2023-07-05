import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './assets/scss/main.scss'
import { YOGA, SIGN_UP, SUCCESS, ERROR, HOME } from './services/routes.service'
// import { useDispatch } from 'react-redux'
const Home = lazy(() => import('./views/Home'))
const Signup = lazy(() => import('./views/Signup'))
const Yoga = lazy(() => import('./views/Yoga'))
const Success = lazy(() => import('./views/Success'))
const Error = lazy(() => import('./views/Error'))
const NotFound = lazy(() => import('./views/NotFound'))

export default function App() {
	// const dispatch = useDispatch()

	// 	useEffect(() => {
	// 		dispatch(doLogin('test@gmail.com', 'test12'))
	// 	}, [])
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<Router>
				<section className="main-app">
					{/* <AppHeader /> */}
					{/* <main className="container"> */}
					<Routes>
						{/* <Route path={LOGIN} element={<Login />} />
                            <Route path={SIGN_UP} element={<Signup />} />
                            <Route path={PROFILE} element={<Profile />} /> */}
						<Route path={SUCCESS} element={<Success />} />
						<Route path={ERROR} element={<Error />} />
						<Route path={YOGA} element={<Yoga />} />
						<Route path={HOME} element={<Home />} />
						<Route path={SIGN_UP} element={<Signup />} />
						<Route path={'/404'} element={<NotFound />} />
						<Route path="*" element={<Navigate to="/404" replace />} />
					</Routes>
					{/* </main> */}
				</section>
			</Router>
		</Suspense>
	)
}
