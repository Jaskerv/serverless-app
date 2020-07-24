export interface RegistrationForm {
  name: string;
  email: string;
  birthdate: string;
  password: string;
  passwordConfirm: string;
}

export interface SignInForm {
  email: string;
  password: string;
}
