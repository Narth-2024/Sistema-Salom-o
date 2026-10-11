import { forwardRef } from 'react'
import Input from './Input'

// Campo de valor monetário que aceita vírgula ("12,50") e ponto ("12.50").
// Guarda o texto exatamente como digitado; normalize o valor no submit
// com toNumberString() de @/lib/decimal antes de enviar ao backend.
// type="text" + inputMode="decimal" dá o teclado numérico no celular e
// evita que o browser rejeite a vírgula (como faz type="number").
const MoneyInput = forwardRef(({ label = 'Valor (R$)', error, ...props }, ref) => {
    return (
        <Input
            ref={ref}
            label={label}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            error={error}
            placeholder="0,00"
            {...props}
        />
    )
})

MoneyInput.displayName = 'MoneyInput'
export default MoneyInput
