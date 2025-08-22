// interface RateLimitEntry {
//     count: number;
//     resetTime: number;
// }

// class InMemoryRateLimitStore {
//     private store = new Map<string, RateLimitEntry>();
//     private cleanupInterval: NodeJS.Timeout;

//     constructor() {
//         // Limpiar entradas expiradas cada 15 minutos
//         this.cleanupInterval = setInterval(() => {
//             this.cleanup();
//         }, 15 * 60 * 1000);
//     }

//     get(key: string): RateLimitEntry | undefined {
//         const entry = this.store.get(key);
//         if (entry && entry.resetTime > Date.now()) {
//             return entry;
//         }
//         // Entrada expirada
//         if (entry) {
//             this.store.delete(key);
//         }
//         return undefined;
//     }

//     set(key: string, value: RateLimitEntry): void {
//         this.store.set(key, value);
//     }

//     increment(key: string, windowMs: number): number {
//         const now = Date.now();
//         const entry = this.get(key);

//         if (entry) {
//             entry.count++;
//             return entry.count;
//         } else {
//             this.set(key, {
//                 count: 1,
//                 resetTime: now + windowMs
//             });
//             return 1;
//         }
//     }

//     private cleanup(): void {
//         const now = Date.now();
//         for (const [key, entry] of this.store.entries()) {
//             if (entry.resetTime <= now) {
//                 this.store.delete(key);
//             }
//         }
//     }

//     destroy(): void {
//         clearInterval(this.cleanupInterval);
//         this.store.clear();
//     }
// }

// export const rateLimitStore = new InMemoryRateLimitStore();