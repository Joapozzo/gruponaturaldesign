/**
 * Centraliza el formateo de errores de Firebase Auth y del backend a mensajes amigables en español.
 */

type ErrorLike = unknown;

function hasCode(err: ErrorLike): err is { code: string; message?: string } {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code: string }).code === 'string';
}

const FIREBASE_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Credenciales inválidas. Revisá tu email y contraseña.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
  'auth/user-not-found': 'No existe una cuenta con este email.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá un momento e intentá de nuevo.',
  'auth/email-already-in-use': 'Este email ya está registrado.',
  'auth/weak-password': 'La contraseña es muy débil. Usá al menos 6 caracteres.',
  'auth/operation-not-allowed': 'Esta operación no está permitida.',
  'auth/network-request-failed': 'Error de conexión. Revisá tu internet.',
  'auth/popup-closed-by-user': 'Cerraste la ventana. Intentá de nuevo si querés continuar con Google.',
  'auth/cancelled-popup-request': 'Inicio con Google cancelado.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permití ventanas emergentes.',
  'auth/requires-recent-login': 'Por seguridad, volvé a iniciar sesión e intentá de nuevo.',
  'auth/expired-action-code': 'El enlace expiró. Solicitá uno nuevo.',
  'auth/invalid-action-code': 'El enlace no es válido o ya fue usado.',
};

/** Mensajes del backend que ya son amigables; se devuelven tal cual. */
const BACKEND_FRIENDLY = [
  'Credenciales inválidas',
  'Ya existe un usuario con ese email',
  'Token inválido o expirado',
  'Usuario registrado',
  'Email y contraseña requeridos',
  'La contraseña debe tener al menos',
  'Las contraseñas no coinciden',
];

function isBackendFriendly(msg: string): boolean {
  const lower = msg.toLowerCase();
  return BACKEND_FRIENDLY.some((f) => lower.includes(f.toLowerCase()));
}

/**
 * Convierte un error (Firebase o backend) en un mensaje amigable en español.
 * Usar en catch de login, register, forgot-password, onboarding, etc.
 */
export function formatAuthError(err: ErrorLike): string {
  if (hasCode(err) && err.code && FIREBASE_MESSAGES[err.code]) {
    return FIREBASE_MESSAGES[err.code];
  }
  const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : '';
  if (msg && isBackendFriendly(msg)) return msg;
  if (msg && msg.length < 120) return msg;
  return 'Ocurrió un error. Intentá de nuevo.';
}
