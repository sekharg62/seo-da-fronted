"use client"

import PhoneInput from 'react-phone-input-2'

type Props = {
  value: string
  onChange: (value: string) => void
  /** ISO2 country code used when user starts typing (e.g. "BD") */
  defaultCountry?: 'BD' | 'IN' | 'US' | 'GB' | 'AE' | 'SA'
  disabled?: boolean
  required?: boolean
  name?: string
  autoComplete?: string
  inputClassName?: string
  wrapperClassName?: string
  placeholder?: string
}

export function MobilePhoneInput({
  value,
  onChange,
  defaultCountry = 'BD',
  disabled,
  required,
  name,
  autoComplete = 'tel',
  inputClassName = '',
  wrapperClassName = 'w-full max-w-[22rem]',
  placeholder,
}: Props) {
  const normalizedValue = value.trim().startsWith('+') ? value.trim().slice(1) : value.trim()

  return (
    <div className={wrapperClassName}>
      <PhoneInput
        country={defaultCountry.toLowerCase()}
        enableSearch
        value={normalizedValue}
        onChange={(next) => onChange(next ? `+${next}` : '')}
        inputProps={{
          name,
          autoComplete,
          disabled,
          required,
          placeholder,
        }}
        disabled={disabled}
        containerClass="da-phone-input"
        inputClass={['da-phone-input__control', inputClassName].filter(Boolean).join(' ')}
        buttonClass="da-phone-input__button"
        dropdownClass="da-phone-input__dropdown"
        searchClass="da-phone-input__search"
      />
    </div>
  )
}
