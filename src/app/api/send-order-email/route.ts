import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { CustomerData, ShippingData, PaymentData, CartItem } from '@/app/types/cart';

interface EmailRequestBody {
  to: string;
  subject: string;
  customerData: CustomerData;
  shippingData: ShippingData;
  paymentData: PaymentData;
  items: CartItem[];
  itemCount: number;
}

/**
 * API Route para enviar email de confirmación de pedido con Nodemailer
 */
export async function POST(request: NextRequest) {
  try {
    const body: EmailRequestBody = await request.json();
    const { to, subject, customerData, shippingData, paymentData, items, itemCount } = body;

    // Validar datos requeridos
    if (!to || !customerData || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Configurar transporter de nodemailer con tu SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true', // true para puerto 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Generar HTML del email
    const emailHTML = generateOrderEmailHTML({
      customerData,
      shippingData,
      paymentData,
      items,
      itemCount,
    });

    // Enviar email al cliente
    const clientEmail = await transporter.sendMail({
      from: `"GND - Natural Design" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: emailHTML,
    });

    // Enviar email de notificación interna
    const internalEmailHTML = generateInternalEmailHTML({
      customerData,
      shippingData,
      paymentData,
      items,
      itemCount,
    });

    const internalEmail = await transporter.sendMail({
      from: `"GND - Natural Design" <${process.env.SMTP_USER}>`,
      to: 'rovalencia@naturalonline.com.ar',
      subject: `🛍️ Nuevo Pedido - ${customerData.nombre} ${customerData.apellido}`,
      html: internalEmailHTML,
    });

    console.log('✅ Emails enviados exitosamente:', {
      cliente: clientEmail.messageId,
      interno: internalEmail.messageId,
    });

    return NextResponse.json({
      success: true,
      message: 'Emails enviados exitosamente',
      to,
      internalTo: 'rovalencia@naturalonline.com.ar',
      messageIds: {
        cliente: clientEmail.messageId,
        interno: internalEmail.messageId,
      },
    });

  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return NextResponse.json(
      { error: 'Error al enviar email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Genera el HTML del email de confirmación
 */
function generateOrderEmailHTML(data: {
  customerData: CustomerData;
  shippingData: ShippingData;
  paymentData: PaymentData;
  items: CartItem[];
  itemCount: number;
}): string {
  const { customerData, shippingData, paymentData, items, itemCount } = data;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido - GND Natural Design</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Poppins', 'Arial', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
      padding: 20px;
    }
    .email-wrapper {
      max-width: 650px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    .header {
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(237, 50, 55, 0.1) 0%, transparent 70%);
    }
    .header-content {
      position: relative;
      z-index: 1;
    }
    .logo-container {
      margin-bottom: 25px;
    }
    .logo {
      width: 120px;
      height: auto;
      display: inline-block;
    }
    .check-icon {
      width: 70px;
      height: 70px;
      background: #Ed3237;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      animation: scaleIn 0.5s ease-out;
    }
    @keyframes scaleIn {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }
    .check-icon svg {
      width: 40px;
      height: 40px;
      stroke: white;
      stroke-width: 3;
      fill: none;
    }
    .header h1 {
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header p {
      color: #e0e0e0;
      font-size: 16px;
    }
    .content {
      padding: 35px 30px;
    }
    .section {
      margin-bottom: 30px;
      background: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      border-left: 4px solid #Ed3237;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
    }
    .section-icon {
      font-size: 24px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .section-title {
      color: #000000;
      font-size: 18px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1;
      display: flex;
      align-items: center;
    }
    .info-grid {
      display: grid;
      gap: 12px;
    }
    .info-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #e8e8e8;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #000000;
      min-width: 140px;
      font-size: 14px;
    }
    .info-value {
      color: #4a4a4a;
      flex: 1;
      font-size: 14px;
    }
    .product-item {
      background: #ffffff;
      padding: 18px;
      margin-bottom: 12px;
      border-radius: 8px;
      border: 2px solid #e8e8e8;
      transition: all 0.3s ease;
    }
    .product-item:hover {
      border-color: #Ed3237;
      box-shadow: 0 4px 12px rgba(237, 50, 55, 0.1);
    }
    .product-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }
    .product-number {
      background: #Ed3237;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }
    .product-name {
      font-weight: 700;
      color: #000000;
      font-size: 16px;
      flex: 1;
    }
    .product-specs {
      font-size: 13px;
      color: #333;
      margin-bottom: 12px;
      padding: 10px 15px 10px 40px;
      background: #f0f0f0;
      border-left: 3px solid #Ed3237;
      border-radius: 4px;
      line-height: 1.8;
    }
    .product-quantity {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-left: 40px;
      font-size: 14px;
      color: #4a4a4a;
    }
    .quantity-badge {
      background: #Ed3237;
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .summary-box {
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      margin-top: 25px;
      text-align: center;
    }
    .summary-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .summary-total {
      font-size: 36px;
      font-weight: 700;
      color: #Ed3237;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    .summary-label {
      font-size: 12px;
      color: #b0b0b0;
      margin-top: 5px;
      text-transform: uppercase;
    }
    .divider {
      height: 2px;
      background: linear-gradient(to right, transparent, #Ed3237, transparent);
      margin: 30px 0;
    }
    .footer {
      background: #f5f5f5;
      padding: 30px;
      text-align: center;
      border-top: 3px solid #Ed3237;
    }
    .footer-title {
      font-size: 18px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .footer-text {
      color: #4a4a4a;
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .contact-info {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      border: 2px solid #e8e8e8;
    }
    .contact-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 8px 0;
      font-size: 14px;
      color: #4a4a4a;
    }
    .brand {
      font-weight: 700;
      color: #000000;
      font-size: 20px;
      margin-top: 20px;
      letter-spacing: 1px;
    }
    .brand-subtitle {
      color: #Ed3237;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .footer-logo {
      width: 100px;
      height: auto;
      margin: 20px auto 10px;
      display: block;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="logo-container">
          <img src="https://naturalonline.com.ar/logos/logo-2.svg" alt="GND - Natural Design" class="logo" />
        </div>
        <div class="check-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1>¡Pedido Confirmado!</h1>
        <p>Gracias por confiar en nosotros, <strong>${customerData.nombre}</strong></p>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Cliente -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon">👤</span>
          <h2 class="section-title">Información del Cliente</h2>
        </div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">🪪 Nombre:</span>
            <span class="info-value">${customerData.nombre} ${customerData.apellido}</span>
          </div>
          <div class="info-row">
            <span class="info-label">📧 Email:</span>
            <span class="info-value">${customerData.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">📞 Teléfono:</span>
            <span class="info-value">${customerData.telefono}</span>
          </div>
          ${customerData.empresa ? `
          <div class="info-row">
            <span class="info-label">🏢 Empresa:</span>
            <span class="info-value">${customerData.empresa}</span>
          </div>
          ` : ''}
          ${customerData.cuit ? `
          <div class="info-row">
            <span class="info-label">🏛️ CUIT:</span>
            <span class="info-value">${customerData.cuit}</span>
          </div>
          ` : ''}
          ${customerData.documento ? `
          <div class="info-row">
            <span class="info-label">🧾 ${customerData.tipo_documento}:</span>
            <span class="info-value">${customerData.documento}</span>
          </div>
          ` : ''}
          ${customerData.fecha_nacimiento ? `
          <div class="info-row">
            <span class="info-label">🎂 Fecha de Nacimiento:</span>
            <span class="info-value">${customerData.fecha_nacimiento}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Entrega -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon">📦</span>
          <h2 class="section-title">Información de Entrega</h2>
        </div>
        <div class="info-grid">
          ${shippingData.tipo === 'envio' ? `
          <div class="info-row">
            <span class="info-label">🚚 Tipo:</span>
            <span class="info-value">Envío a domicilio</span>
          </div>
          <div class="info-row">
            <span class="info-label">🏠 Dirección:</span>
            <span class="info-value">${shippingData.direccion}</span>
          </div>
          <div class="info-row">
            <span class="info-label">📍 Localidad:</span>
            <span class="info-value">${shippingData.localidad}</span>
          </div>
          <div class="info-row">
            <span class="info-label">🗺️ Provincia:</span>
            <span class="info-value">${shippingData.provincia}</span>
          </div>
          <div class="info-row">
            <span class="info-label">📮 Código Postal:</span>
            <span class="info-value">${shippingData.codigo_postal}</span>
          </div>
          ` : `
          <div class="info-row">
            <span class="info-label">🏬 Tipo:</span>
            <span class="info-value">Retiro en tienda</span>
          </div>
          `}
          ${shippingData.notas ? `
          <div class="info-row">
            <span class="info-label">📝 Notas:</span>
            <span class="info-value">${shippingData.notas}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Pago -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon">💰</span>
          <h2 class="section-title">Forma de Pago</h2>
        </div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">💳 Método:</span>
            <span class="info-value">${getPaymentMethodName(paymentData.metodo)}</span>
          </div>
          ${paymentData.notas ? `
          <div class="info-row">
            <span class="info-label">🗒️ Notas:</span>
            <span class="info-value">${paymentData.notas}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="divider"></div>

      <!-- Productos -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon">🛒</span>
          <h2 class="section-title">Detalle del Pedido</h2>
        </div>
        ${items.map((item, index) => `
        <div class="product-item">
          <div class="product-header">
            <div class="product-number">${index + 1}</div>
            <div class="product-name">${item.product.nombre}</div>
          </div>
          ${item.especificaciones ? `
          <div class="product-specs">
            <strong style="color: #Ed3237;">📋 SKU/Especificaciones:</strong><br/>
            ${item.especificaciones}
          </div>
          ` : ''}
          <div class="product-quantity">
            <span>Cantidad:</span>
            <span class="quantity-badge">${item.quantity} unidades</span>
          </div>
        </div>
        `).join('')}
      </div>

      <!-- Summary -->
      <div class="summary-box">
        <div class="summary-title">Total de Productos</div>
        <div class="summary-total">${itemCount}</div>
        <div class="summary-label">Unidades en total</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-title">¿Qué sucede ahora?</div>
      <div class="footer-text">
        Nuestro equipo se pondrá en contacto contigo pronto vía WhatsApp para coordinar los detalles finales de tu pedido, confirmar disponibilidad de stock y acordar la fecha de entrega.
      </div>

      <div class="contact-info">
        <div class="contact-row">
          <span>📞</span>
          <span>+54 351 7136316</span>
        </div>
        <div class="contact-row">
          <span>📧</span>
          <span>consultas@naturalonline.com.ar</span>
        </div>
        <div class="contact-row">
          <span>📍</span>
          <span>Rivera Indarte 2143, Córdoba</span>
        </div>
      </div>

      <img src="https://naturalonline.com.ar/logos/logo-2.svg" alt="GND - Natural Design" class="footer-logo" />
      <div class="brand">GND - NATURAL DESIGN</div>
      <div class="brand-subtitle">Uniformes Empresariales</div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getPaymentMethodName(metodo: string): string {
  const methods: Record<string, string> = {
    whatsapp: 'WhatsApp',
    transferencia: 'Transferencia Bancaria',
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
  };
  return methods[metodo] || metodo;
}

/**
 * Genera el HTML del email interno de notificación
 */
function generateInternalEmailHTML(data: {
  customerData: CustomerData;
  shippingData: ShippingData;
  paymentData: PaymentData;
  items: CartItem[];
  itemCount: number;
}): string {
  const { customerData, shippingData, paymentData, items, itemCount } = data;
  const timestamp = new Date().toLocaleString('es-AR', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Pedido - GND</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: #000;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 20px -30px;
      text-align: center;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      background: #f9f9f9;
      border-left: 4px solid #Ed3237;
      border-radius: 4px;
    }
    .section-title {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 10px;
      color: #000;
    }
    .info-row {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: bold;
      display: inline-block;
      min-width: 150px;
    }
    .product-item {
      background: white;
      padding: 15px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛍️ NUEVO PEDIDO RECIBIDO</h1>
      <p>Fecha: ${timestamp}</p>
    </div>

    <div class="section">
      <div class="section-title">👤 DATOS DEL CLIENTE</div>
      <div class="info-row">
        <span class="info-label">Nombre:</span>
        <span>${customerData.nombre} ${customerData.apellido}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span>${customerData.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Teléfono:</span>
        <span>${customerData.telefono}</span>
      </div>
      ${customerData.empresa ? `
      <div class="info-row">
        <span class="info-label">Empresa:</span>
        <span>${customerData.empresa}</span>
      </div>
      ` : ''}
      ${customerData.cuit ? `
      <div class="info-row">
        <span class="info-label">CUIT:</span>
        <span>${customerData.cuit}</span>
      </div>
      ` : ''}
      ${customerData.documento ? `
      <div class="info-row">
        <span class="info-label">${customerData.tipo_documento}:</span>
        <span>${customerData.documento}</span>
      </div>
      ` : ''}
      ${customerData.fecha_nacimiento ? `
      <div class="info-row">
        <span class="info-label">Fecha de Nacimiento:</span>
        <span>${customerData.fecha_nacimiento}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">📦 DATOS DE ENTREGA</div>
      ${shippingData.tipo === 'envio' ? `
      <div class="info-row">
        <span class="info-label">Tipo:</span>
        <span>Envío a domicilio</span>
      </div>
      <div class="info-row">
        <span class="info-label">Dirección:</span>
        <span>${shippingData.direccion}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Localidad:</span>
        <span>${shippingData.localidad}, ${shippingData.provincia}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Código Postal:</span>
        <span>${shippingData.codigo_postal}</span>
      </div>
      ` : `
      <div class="info-row">
        <span class="info-label">Tipo:</span>
        <span>Retiro en tienda</span>
      </div>
      `}
      ${shippingData.notas ? `
      <div class="info-row">
        <span class="info-label">Notas:</span>
        <span>${shippingData.notas}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">💰 FORMA DE PAGO</div>
      <div class="info-row">
        <span class="info-label">Método:</span>
        <span>${getPaymentMethodName(paymentData.metodo)}</span>
      </div>
      ${paymentData.notas ? `
      <div class="info-row">
        <span class="info-label">Notas:</span>
        <span>${paymentData.notas}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">🛒 PRODUCTOS (${itemCount} unidades)</div>
      ${items.map((item, index) => `
      <div class="product-item">
        <strong>${index + 1}. ${item.product.nombre}</strong>
        ${item.especificaciones ? `<br/><small style="color: #666;">${item.especificaciones}</small>` : ''}
        <br/><span style="color: #Ed3237; font-weight: bold;">Cantidad: ${item.quantity} unidades</span>
      </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>Este es un email automático de notificación de nuevo pedido.</p>
      <p>GND - Natural Design</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
