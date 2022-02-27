import { Route, Router, Switch } from 'react-router-dom'
import history from 'shared/services/router-history'
import ProtectedRoute from './ProtectedRoute'
import Auth from 'features/auth/Auth'
import ProtectedNavigator from './ProtectedNavigator'

export default function AppRoutes() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/auth" exact={false} component={Auth} />
        <ProtectedRoute path="/" component={ProtectedNavigator} />
      </Switch>
    </Router>
  )
}
