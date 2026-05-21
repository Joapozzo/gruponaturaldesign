import { vi } from 'vitest';

// Evita warnings de React 19 en tests de hooks
vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
