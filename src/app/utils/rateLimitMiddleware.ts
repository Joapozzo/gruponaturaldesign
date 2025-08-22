// import { NextApiRequest, NextApiResponse } from 'next';
// import { rateLimitStore } from '../utils/rateLimitStore';

// interface RateLimitOptions {
//     windowMs: number;
//     max: number;
//     message?: string;
// }

// export function createRateLimit(options: RateLimitOptions) {
//     return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
//         const key = req.headers['x-forwarded-for'] as string ||
//             req.headers['x-real-ip'] as string ||
//             req.connection.remoteAddress ||
//             'unknown';

//         const currentCount = rateLimitStore.increment(key, options.windowMs);

//         // Headers informativos
//         res.setHeader('X-RateLimit-Limit', options.max);
//         res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - currentCount));
//         res.setHeader('X-RateLimit-Reset', Date.now() + options.windowMs);

//         if (currentCount > options.max) {
//             return res.status(429).json({
//                 success: false,
//                 message: options.message || 'Demasiadas consultas',
//                 retryAfter: options.windowMs
//             });
//         }

//         next();
//     };
// }