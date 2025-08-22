// import winston from 'winston';

// // Configuración del logger para producción
// const securityLogger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.errors({ stack: true }),
//         winston.format.json()
//     ),
//     defaultMeta: { service: 'contact-form-security' },
//     transports: [
//         // Log de errores críticos
//         new winston.transports.File({
//             filename: 'logs/security-error.log',
//             level: 'error',
//             maxsize: 5242880, // 5MB
//             maxFiles: 5,
//         }),
//         // Log de todos los eventos de seguridad
//         new winston.transports.File({
//             filename: 'logs/security.log',
//             maxsize: 5242880, // 5MB
//             maxFiles: 10,
//         }),
//     ],
// });

// // En desarrollo, también log a consola
// if (process.env.NODE_ENV !== 'production') {
//     securityLogger.add(new winston.transports.Console({
//         format: winston.format.simple()
//     }));
// }

// export function logSecurityEvent(
//     type: 'BOT_DETECTED' | 'BLOCKED_EMAIL_DOMAIN' | 'SPAM_DETECTED' |
//         'SUSPICIOUS_CONTENT' | 'SMTP_ERROR' | 'FORM_ERROR' | 'RATE_LIMIT',
//     ip: string,
//     details: any,
//     severity: 'info' | 'warn' | 'error' = 'warn'
// ) {
//     const logData = {
//         type,
//         ip,
//         timestamp: new Date().toISOString(),
//         userAgent: details.userAgent || 'unknown',
//         details,
//         environment: process.env.NODE_ENV
//     };

//     switch (severity) {
//         case 'error':
//             securityLogger.error('Security Event', logData);
//             break;
//         case 'warn':
//             securityLogger.warn('Security Event', logData);
//             break;
//         default:
//             securityLogger.info('Security Event', logData);
//     }

//     // En producción, también enviar a Sentry si está configurado
//     if (process.env.NODE_ENV === 'production' && global.Sentry) {
//         global.Sentry.captureMessage(`Security event: ${type}`, severity, {
//             extra: logData
//         });
//     }
// }

// // Opcional: Configuración para Sentry
// export function initSentryLogging() {
//     if (process.env.SENTRY_DSN && process.env.NODE_ENV === 'production') {
//         const Sentry = require('@sentry/nextjs');

//         Sentry.init({
//             dsn: process.env.SENTRY_DSN,
//             environment: process.env.NODE_ENV,
//             beforeSend(event: any) {
//                 // Filtrar información sensible
//                 if (event.extra?.details?.email) {
//                     event.extra.details.email = event.extra.details.email.replace(
//                         /(.{2}).*(@.*)/,
//                         '$1***$2'
//                     );
//                 }
//                 return event;
//             }
//         });

//         global.Sentry = Sentry;
//     }
// }

// export default securityLogger;