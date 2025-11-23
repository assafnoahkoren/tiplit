export const enTranslation = {
  // App
  app_title: "Tiplit",
  app_description: "shadcn/ui components with RTL support",

  // Common
  common_loading: "Loading...",
  common_error: "Error",
  common_success: "Success",
  common_continue: "Continue",
  common_skip: "Skip",
  common_submit: "Submit",
  common_cancel: "Cancel",

  // Auth - Common
  auth_email: "Email",
  auth_emailPlaceholder: "Enter your email",
  auth_password: "Password",
  auth_passwordPlaceholder: "Enter your password",
  auth_name: "Name",
  auth_namePlaceholder: "Enter your name",
  auth_phone: "Phone Number",
  auth_phonePlaceholder: "+1234567890 (E.164 format)",
  auth_phoneFormat: "Use international format (e.g., +1234567890)",
  auth_otp: "Verification Code",
  auth_otpPlaceholder: "Enter 4-digit code",
  auth_otpInfo: "Check your phone for the verification code",

  // Login Page
  login_title: "Welcome Back",
  login_description: "Sign in to your account",
  login_button: "Sign In",
  login_noAccount: "Don't have an account?",
  login_registerLink: "Register",
  login_phoneLoginLink: "Sign in with phone",

  // Register Page
  register_title: "Create Account",
  register_description: "Enter your information to create a new account",
  register_button: "Create Account",
  register_hasAccount: "Already have an account?",
  register_loginLink: "Sign in",
  register_phoneRegisterLink: "Sign up with phone",
  register_nameOptional: "Name (optional)",
  register_confirmPassword: "Confirm Password",
  register_confirmPasswordPlaceholder: "Confirm your password",
  register_creating: "Creating...",
  register_errorPasswordMismatch: "Passwords do not match",

  // Phone Login Page
  phoneLogin_title: "Login with Phone",
  phoneLogin_descriptionPhone: "Enter your phone number to receive a verification code",
  phoneLogin_descriptionOtp: "Enter the 4-digit code sent to your phone",
  phoneLogin_requestCode: "Send Verification Code",
  phoneLogin_sending: "Sending...",
  phoneLogin_verify: "Login",
  phoneLogin_verifying: "Verifying...",
  phoneLogin_resend: "Resend Code",
  phoneLogin_codeSentTo: "Code sent to:",
  phoneLogin_change: "Change",
  phoneLogin_noAccount: "Don't have an account?",
  phoneLogin_registerPhoneLink: "Register with phone",
  phoneLogin_or: "or",
  phoneLogin_registerEmailLink: "Register with email",
  phoneLogin_emailLoginLink: "Sign in with email",

  // Phone Register Page
  phoneRegister_title: "Register with Phone",
  phoneRegister_descriptionPhone: "Enter your phone number to get started",
  phoneRegister_descriptionOtp: "Enter the 4-digit code sent to your phone",
  phoneRegister_requestCode: "Send Verification Code",
  phoneRegister_sending: "Sending...",
  phoneRegister_verify: "Create Account",
  phoneRegister_verifying: "Verifying...",
  phoneRegister_resend: "Resend Code",
  phoneRegister_codeSentTo: "Code sent to:",
  phoneRegister_change: "Change",
  phoneRegister_hasAccount: "Already have an account?",
  phoneRegister_loginPhoneLink: "Login with phone",
  phoneRegister_or: "or",
  phoneRegister_loginEmailLink: "Login with email",
  phoneRegister_emailRegisterLink: "Sign up with email",

  // Home Page
  home_welcome: "Welcome to Tiplit",
  home_description: "Your dashboard",
  home_logout: "Logout",
  home_loggingOut: "Logging out...",

  // About Page
  about_title: "About",
  about_description: "Learn more about Tiplit",

  // Onboarding
  onboarding_stepOf: "Step {{current}} of {{total}}",

  // Onboarding - Name Slide
  onboarding_name_title: "What should we call you?",
  onboarding_name_description: "Help us personalize your experience",
  onboarding_name_label: "Your Name",
  onboarding_name_placeholder: "Enter your name",

  // Onboarding - Avatar Slide
  onboarding_avatar_title: "Add a profile picture",
  onboarding_avatar_description: "Upload an image to personalize your profile",
  onboarding_avatar_uploadText: "Click the avatar to upload an image",
  onboarding_avatar_fileInfo: "PNG, JPG, GIF up to 5MB",
  onboarding_avatar_errorType: "Please select an image file",
  onboarding_avatar_errorSize: "Image size should be less than 5MB",
  onboarding_avatar_errorRead: "Failed to read image file",
  onboarding_avatar_errorSelect: "Please select an image",

  // Onboarding - Phone Slide
  onboarding_phone_title: "Add your phone number",
  onboarding_phone_description: "Enable phone-based authentication",
  onboarding_phone_label: "Phone Number",
  onboarding_phone_otpLabel: "Verification Code",
  onboarding_phone_otpPlaceholder: "Enter 4-digit code",
  onboarding_phone_otpInfo: "Check your phone for the verification code",

  // Profile Menu
  profile_menu_profile: "Profile",
  profile_menu_logout: "Logout",
  profile_menu_loggingOut: "Logging out...",

  // Errors
  error_generic: "Something went wrong",
  error_network: "Network error. Please try again.",
  error_unauthorized: "You are not authorized to access this resource",
}

export type Translation = typeof enTranslation
export type TranslationKey = keyof Translation
