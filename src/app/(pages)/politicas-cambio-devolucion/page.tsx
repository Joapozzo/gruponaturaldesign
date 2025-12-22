import { WHATSAPP_PHONE_NUMBER, getWhatsAppNumberForUrl } from '@/app/utils/constants';

export const metadata = {
    title: 'Políticas de Cambio y Devolución | NTDS Natural Design',
    description: 'Políticas de cambio y devolución de NTDS Natural Design. Conocé nuestros términos y condiciones para cambios y devoluciones.',
};

export default function PoliticasCambioDevolucion() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">
                    🔁 POLÍTICAS DE CAMBIO Y DEVOLUCIÓN
                </h1>

                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                    <p className="text-base md:text-lg leading-relaxed">
                        Los cambios se aceptan dentro de los 10 días hábiles posteriores a la entrega, siempre que las prendas no hayan sido usadas, lavadas ni personalizadas.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                        En caso de bordado o estampa institucional, no se aceptan devoluciones una vez aprobado el diseño.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                        Si el producto presenta defectos de fabricación, deberá informarse dentro de las 48 hs. de recibido para coordinar el reemplazo sin costo.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                        Los cambios se gestionan con el vendedor asignado, quien coordinará el retiro o reposición según la ubicación del cliente.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                        Para prendas con talles especiales, se fabrican bajo pedido y no poseen cambio.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                        📩 Ante cualquier consulta, podés comunicarte con nuestro equipo comercial a través del formulario o por WhatsApp, de lunes a viernes de 8 a 17 hs.
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                        CAMBIOS:
                    </h2>

                    <p className="text-base md:text-lg leading-relaxed">
                        Comunícate con nuestro Centro de Atención al Cliente a través de WhatsApp al número <a href={`https://wa.me/${getWhatsAppNumberForUrl()}`} className="text-[#Ed3237] hover:underline">{WHATSAPP_PHONE_NUMBER}</a> indicando: número de pedido, producto que deseás cambiar y el motivo. Para facilitar el trabajo de nuestros asesores podés adjuntarnos una foto.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                        Los cambios se encuentran sujetos a disponibilidad de stock. En caso de no contar con la misma prenda, se puede elegir otra de igual o mayor valor abonando diferencia, respecto al precio de la compra inicial.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                        Los productos deben estar en su packaging original y con la etiqueta puesta en la prenda, (en caso que la prenda contenga) en perfecto estado, deberán estar acompañados por la factura de compra.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                        Los costos del mismo, correrán por cuenta del cliente. Nosotros hacemos todas las gestiones.
                    </p>
                </div>
            </div>
        </div>
    );
}

