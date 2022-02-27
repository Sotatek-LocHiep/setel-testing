import React from 'react'
export function useSpinner() {
  const [isSpin, setSpin] = React.useState<boolean>(false)
  const activeSpinner = () => setSpin(true)
  const inactiveSpinner = () => setSpin(false)
  return { isSpin, activeSpinner, inactiveSpinner }
}
