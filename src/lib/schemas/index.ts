/** Schemas reutilizables (auth, formularios, etc.) */

export {
  createPasswordSchema,
  passwordSchema,
  PASSWORD_RULES,
  getPasswordRuleChecks,
  getNextPasswordRule,
  type PasswordSchemaOptions,
  type PasswordRuleId,
  type PasswordSchemaType,
} from './password.schema';

export { registerFormSchema, type RegisterFormData } from './register.schema';

export { loginFormSchema, type LoginFormData } from './login.schema';

export {
  createConsumerEmailSchema,
  consumerEmailSchema,
  type ConsumerEmailSchemaOptions,
} from './email.schema';
