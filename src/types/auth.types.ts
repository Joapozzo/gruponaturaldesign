export interface SessionUserState {
  uid: string;
  email: string;
  emailVerified: boolean;
  needsEmailVerification: boolean;
  needsOnboarding: boolean;
  onboardingCompleted: boolean;
  nombre: string | null;
  apellido: string | null;
  /** YYYY-MM-DD desde el perfil (API); null si no hay fecha */
  fechaNacimiento: string | null;
  role: string;
  empresaId: number | null;
  usuarioId: number;
}
