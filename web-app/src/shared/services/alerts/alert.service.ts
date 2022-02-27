import Alert, { SweetAlertOptions } from 'sweetalert2'

export function alertSuccess(
  option: SweetAlertOptions,
  cb?: (result: any) => void
) {
  Alert.fire({
    icon: 'success',
    ...option,
  }).then(cb)
}
export function alertError(
  option: SweetAlertOptions,
  cb?: (result: any) => void
) {
  Alert.fire({
    icon: 'error',
    ...option,
  }).then(cb)
}
export function alertWarning(
  option: SweetAlertOptions,
  cb?: (result: any) => void
) {
  Alert.fire({
    icon: 'warning',
    ...option,
  }).then(cb)
}
export function alertInfo(
  option: SweetAlertOptions,
  cb?: (result: any) => void
) {
  Alert.fire({
    icon: 'info',
    ...option,
  }).then(cb)
}
export function alertQuestion(
  option: SweetAlertOptions,
  cb?: (result: any) => void
) {
  Alert.fire({
    icon: 'question',
    ...option,
  }).then(cb)
}
