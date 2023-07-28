import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './assets/scss/main.scss'
import { YOGA, SIGN_UP, SUCCESS, ERROR, HOME, NOT_FOUND } from './services/routes.service'
const Home = lazy(() => import('./views/Home'))
const Signup = lazy(() => import('./views/Signup'))
const Yoga = lazy(() => import('./views/Yoga'))
const Success = lazy(() => import('./views/Success'))
const Error = lazy(() => import('./views/Error'))
const NotFound = lazy(() => import('./views/NotFound'))

export default function App() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<Router>
				<Routes>
					<Route path={SUCCESS} element={<Success />} />
					<Route path={ERROR} element={<Error />} />
					<Route path={YOGA} element={<Yoga />} />
					<Route path={HOME} element={<Home />} />
					<Route path={SIGN_UP} element={<Signup />} />
					<Route path={NOT_FOUND} element={<NotFound />} />
					<Route path="*" element={<Navigate to={NOT_FOUND} replace />} />
				</Routes>
			</Router>
		</Suspense>
	)
}
