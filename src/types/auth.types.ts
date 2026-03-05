export interface SessionUserState {
  uid: string;
  email: string;
  emailVerified: boolean;
  needsEmailVerification: boolean;
  needsOnboarding: boolean;
  onboardingCompleted: boolean;
  nombre: string | null;
  apellido: string | null;
  role: string;
  empresaId: number | null;
  usuarioId: number;
}
