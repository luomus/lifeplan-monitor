import { ChangeEvent, useState } from 'react'

export interface useFieldType {
  type: string,
  value: string,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  reset: () => void
}

const useField = (type: string): useFieldType => {
  const [ value, setValue ] = useState('')

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export default useField