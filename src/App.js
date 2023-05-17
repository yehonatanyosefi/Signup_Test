import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import './assets/scss/main.scss'
import { Home } from './views/Home'
import Signup from './views/Signup'

export default function App() {
    return (
        <Router>
            <section className="main-app">
                {/* <AppHeader /> */}
                <main className="container">
                    <Switch>
                        <Route path="/" component={Signup} />
                        {/* <Route path="/" component={Home} /> */}
                    </Switch>
                </main>
            </section>
        </Router>
    )
}