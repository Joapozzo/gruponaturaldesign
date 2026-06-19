import type { Page } from '@playwright/test';

const API_PATTERN = /\/api\//;

function emptyList() {
  return {
    success: true,
    data: {
      items: [],
      productos: [],
      pagination: { page: 1, limit: 24, total: 0, totalPages: 1 },
    },
  };
}

/** Intercepta llamadas al backend (NEXT_PUBLIC_API_URL) con respuestas mínimas. */
export async function mockBackendApi(page: Page) {
  await page.route(API_PATTERN, async (route) => {
    const url = route.request().url();

    if (url.includes('productos-publicados') || url.includes('destacados') || url.includes('/productos')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyList()),
      });
    }

    if (url.includes('payment-status')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { estadoInterno: 'confirmado', mpLiveStatus: 'approved' },
        }),
      });
    }

    if (url.includes('empresa-precio') || url.includes('sales') || url.includes('rubros')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: {} }),
      });
    }

    if (url.includes('shipping') || url.includes('checkout')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { precio: 1500, correoOpciones: [] },
        }),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: null }),
    });
  });
}
