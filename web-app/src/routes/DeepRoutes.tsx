import { Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { DeepRoutesComponentsType } from './type'

export type DeepRoutesProps = {
  components: DeepRoutesComponentsType[]
}

export default function DeepRoutes(props: DeepRoutesProps) {
  const { components } = props
  return (
    <>
      {components.map((item, index) =>
        item.isProtect ? (
          <ProtectedRoute
            key={index}
            path={item.path}
            component={item.component}
            exact={item.exact}
          />
        ) : (
          <Route
            key={index}
            path={item.path}
            component={item.component}
            exact={item.exact}
          />
        )
      )}
    </>
  )
}
