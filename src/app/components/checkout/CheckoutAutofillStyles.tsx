'use client';

/** Estilos para que el autocompletado del navegador no rompa el contraste en inputs del checkout */
export function CheckoutAutofillStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active,
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:focus,
          textarea:-webkit-autofill:active,
          select:-webkit-autofill,
          select:-webkit-autofill:hover,
          select:-webkit-autofill:focus,
          select:-webkit-autofill:active {
            -webkit-text-fill-color: #000000 !important;
            -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
            box-shadow: 0 0 0px 1000px #ffffff inset !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          input:autofill,
          textarea:autofill,
          select:autofill {
            color: #000000 !important;
            background-color: #ffffff !important;
          }
        `,
      }}
    />
  );
}
