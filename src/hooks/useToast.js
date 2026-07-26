import { useDispatch } from 'react-redux'
import { toast } from '../store/slices/toastSlice'

export function useToast() {
  const dispatch = useDispatch()
  return {
    success: msg => dispatch(toast.success(msg)),
    error: msg => dispatch(toast.error(msg)),
    info: msg => dispatch(toast.info(msg)),
    warn: msg => dispatch(toast.warn(msg)),
  }
}
