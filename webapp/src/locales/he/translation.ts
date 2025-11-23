import type { Translation } from '../en/translation'

export const heTranslation: Translation = {
  // App
  app_title: "טיפליט",
  app_description: "רכיבי shadcn/ui עם תמיכה ב-RTL",

  // Common
  common_loading: "טוען...",
  common_error: "שגיאה",
  common_success: "הצלחה",
  common_continue: "המשך",
  common_skip: "דלג",
  common_submit: "שלח",
  common_cancel: "ביטול",

  // Auth - Common
  auth_email: "אימייל",
  auth_emailPlaceholder: "הזן את האימייל שלך",
  auth_password: "סיסמה",
  auth_passwordPlaceholder: "הזן את הסיסמה שלך",
  auth_name: "שם",
  auth_namePlaceholder: "הזן את שמך",
  auth_phone: "מספר טלפון",
  auth_phonePlaceholder: "+972501234567",
  auth_phoneFormat: "השתמש בפורמט בינלאומי (לדוגמה, +972501234567)",
  auth_otp: "קוד אימות",
  auth_otpPlaceholder: "הזן קוד בן 4 ספרות",
  auth_otpInfo: "בדוק את הטלפון שלך עבור קוד האימות",

  // Login Page
  login_title: "ברוך שובך",
  login_description: "התחבר לחשבון שלך",
  login_button: "התחבר",
  login_noAccount: "אין לך חשבון?",
  login_registerLink: "הירשם",
  login_phoneLoginLink: "התחבר עם טלפון",

  // Register Page
  register_title: "צור חשבון",
  register_description: "הזן את הפרטים שלך כדי ליצור חשבון חדש",
  register_button: "צור חשבון",
  register_hasAccount: "כבר יש לך חשבון?",
  register_loginLink: "התחבר",
  register_phoneRegisterLink: "הירשם עם טלפון",
  register_nameOptional: "שם (אופציונלי)",
  register_confirmPassword: "אימות סיסמה",
  register_confirmPasswordPlaceholder: "אמת את הסיסמה שלך",
  register_creating: "יוצר...",
  register_errorPasswordMismatch: "הסיסמאות אינן תואמות",

  // Phone Login Page
  phoneLogin_title: "התחברות עם טלפון",
  phoneLogin_descriptionPhone: "הזן את מספר הטלפון שלך כדי לקבל קוד אימות",
  phoneLogin_descriptionOtp: "הזן את הקוד בן 4 הספרות שנשלח לטלפון שלך",
  phoneLogin_requestCode: "שלח קוד אימות",
  phoneLogin_sending: "שולח...",
  phoneLogin_verify: "התחבר",
  phoneLogin_verifying: "מאמת...",
  phoneLogin_resend: "שלח קוד שוב",
  phoneLogin_codeSentTo: "קוד נשלח ל:",
  phoneLogin_change: "שנה",
  phoneLogin_noAccount: "אין לך חשבון?",
  phoneLogin_registerPhoneLink: "הירשם עם טלפון",
  phoneLogin_or: "או",
  phoneLogin_registerEmailLink: "הירשם עם אימייל",
  phoneLogin_emailLoginLink: "התחבר עם אימייל",

  // Phone Register Page
  phoneRegister_title: "יצירת חשבון עם טלפון",
  phoneRegister_descriptionPhone: "הזן את מספר הטלפון שלך כדי לקבל קוד אימות",
  phoneRegister_descriptionOtp: "הזן את הקוד בן 4 הספרות שנשלח לטלפון שלך",
  phoneRegister_name: "שם מלא",
  phoneRegister_namePlaceholder: "ישראל ישראלי",
  phoneRegister_requestCode: "שלח קוד אימות",
  phoneRegister_sending: "שולח...",
  phoneRegister_createAccount: "צור חשבון",
  phoneRegister_verifying: "מאמת...",
  phoneRegister_resend: "שלח קוד שוב",
  phoneRegister_codeSentTo: "קוד נשלח ל:",
  phoneRegister_change: "שנה",
  phoneRegister_hasAccount: "כבר יש לך חשבון?",
  phoneRegister_loginLink: "התחבר",
  phoneRegister_loginPhoneLink: "התחבר עם טלפון",
  phoneRegister_or: "או",
  phoneRegister_loginEmailLink: "התחבר עם אימייל",
  phoneRegister_emailRegisterLink: "הירשם עם אימייל",

  // Home Page
  home_welcome: "ברוכים הבאים לטיפליט",
  home_description: "לוח הבקרה שלך",
  home_logout: "התנתק",
  home_loggingOut: "מתנתק...",

  // About Page
  about_title: "אודות",
  about_description: "למד עוד על טיפליט",

  // Onboarding
  onboarding_stepOf: "שלב {{current}} מתוך {{total}}",

  // Onboarding - Name Slide
  onboarding_name_title: "איך לקרוא לך?",
  onboarding_name_description: "עזור לנו להתאים אישית את החוויה שלך",
  onboarding_name_label: "השם שלך",
  onboarding_name_placeholder: "הזן את שמך",

  // Onboarding - Avatar Slide
  onboarding_avatar_title: "הוסף תמונת פרופיל",
  onboarding_avatar_description: "העלה תמונה כדי להתאים אישית את הפרופיל שלך",
  onboarding_avatar_uploadText: "לחץ על האווטאר כדי להעלות תמונה",
  onboarding_avatar_fileInfo: "PNG, JPG, GIF עד 5MB",
  onboarding_avatar_errorType: "אנא בחר קובץ תמונה",
  onboarding_avatar_errorSize: "גודל התמונה צריך להיות פחות מ-5MB",
  onboarding_avatar_errorRead: "נכשל בקריאת קובץ התמונה",
  onboarding_avatar_errorSelect: "אנא בחר תמונה",

  // Onboarding - Phone Slide
  onboarding_phone_title: "הוסף את מספר הטלפון שלך",
  onboarding_phone_description: "אפשר אימות מבוסס טלפון",
  onboarding_phone_label: "מספר טלפון",
  onboarding_phone_otpLabel: "קוד אימות",
  onboarding_phone_otpPlaceholder: "הזן קוד בן 4 ספרות",
  onboarding_phone_otpInfo: "בדוק את הטלפון שלך עבור קוד האימות",

  // Profile Menu
  profile_menu_profile: "פרופיל",
  profile_menu_logout: "התנתק",
  profile_menu_loggingOut: "מתנתק...",

  // Errors
  error_generic: "משהו השתבש",
  error_network: "שגיאת רשת. אנא נסה שוב.",
  error_unauthorized: "אינך מורשה לגשת למשאב זה",
}
