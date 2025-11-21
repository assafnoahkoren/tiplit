export const enTranslation = {
  app_title: "Tiplit",
  app_description: "shadcn/ui components with RTL support",
  form_email: "Email",
  form_emailPlaceholder: "Enter your email",
  form_password: "Password",
  form_passwordPlaceholder: "Enter your password",
  form_cancel: "Cancel",
  form_submit: "Submit",
} as const

type Stringify<T> = {
  [K in keyof T]: string
}

export type Translation = Stringify<typeof enTranslation>
export type TranslationKeys = keyof Translation
