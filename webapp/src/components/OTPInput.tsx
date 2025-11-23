import { OTPInput as BaseOTPInput, type SlotProps } from 'input-otp'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  id?: string
  maxLength?: number
}

export function OTPInput({ value, onChange, disabled, id, maxLength = 4 }: OTPInputProps) {
  return (
    <div id={id} dir="ltr" className="w-full flex justify-center">
      <BaseOTPInput
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
        containerClassName="group flex items-center has-[:disabled]:opacity-50"
        render={({ slots }) => (
          <>
            <div className="flex gap-2">
              {slots.map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>
          </>
        )}
      />
    </div>
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'relative w-12 h-14 text-2xl',
        'flex items-center justify-center',
        'transition-all duration-200',
        'border border-input rounded-md',
        'bg-background',
        'group-hover:border-primary/50',
        'group-focus-within:border-primary',
        {
          'border-primary ring-1 ring-primary': props.isActive,
          'opacity-50': !props.char && !props.isActive,
        }
      )}
    >
      {props.char !== null && <div className="font-medium">{props.char}</div>}
      {props.hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-6 bg-foreground animate-caret-blink" />
        </div>
      )}
    </div>
  )
}
