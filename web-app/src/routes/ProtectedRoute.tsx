import { Route } from 'react-router-dom'
import React from 'react'
interface ProtectedRouteProps {
  path?: string
  component: React.FC | React.Component | any
  exact?: boolean
}

export default function ProtectedRoute({
  path,
  component,
  exact,
}: ProtectedRouteProps) {
  return <Route path={path} exact={exact} component={component} />
}
