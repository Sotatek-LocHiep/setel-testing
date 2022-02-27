import './index.css'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from 'features/store'
import { I18nextProvider } from 'react-i18next'
import i18n from './shared/assets/i18n/translation'
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </ChakraProvider>
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
