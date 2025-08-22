// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactSchema } from '../../schemas/contactSchema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validar con Zod
    const validatedData = contactSchema.parse(body);

    // Configurar transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verificar SMTP
    await transporter.verify();

    const timestamp = new Date().toLocaleString('es-AR');

    // Email cliente
    const clientMail = {
      from: process.env.SMTP_USER,
      to: validatedData.email,
      subject: '✅ Confirmación - Natural Online',
      html: `
        <h2>¡Gracias por tu consulta!</h2>
        <p>Hola <strong>${validatedData.nombreCompleto}</strong>,</p>
        <p>Recibimos tu consulta el ${timestamp}.</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3>Resumen:</h3>
          <p><strong>Empresa:</strong> ${validatedData.empresa}</p>
          <p><strong>Teléfono:</strong> ${validatedData.telefono}</p>
          <p><strong>Mensaje:</strong> ${validatedData.mensaje}</p>
        </div>
        <p>Te responderemos en menos de 24 horas.</p>
      `
    };

    // Email interno
    const internalMail = {
      from: process.env.SMTP_USER,
      to: 'info@naturalonline.com.ar',
      subject: `🔔 Nueva Consulta - ${validatedData.empresa}`,
      html: `
        <h2>Nueva Consulta</h2>
        <p><strong>Fecha:</strong> ${timestamp}</p>
        <p><strong>Nombre:</strong> ${validatedData.nombreCompleto}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Empresa:</strong> ${validatedData.empresa}</p>
        <p><strong>Teléfono:</strong> ${validatedData.telefono}</p>
        <div style="background: #f5f5f5; padding: 15px;">
          <strong>Mensaje:</strong><br>${validatedData.mensaje}
        </div>
      `
    };

    // Enviar emails
    await Promise.all([
      transporter.sendMail(clientMail),
      transporter.sendMail(internalMail)
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Consulta enviada correctamente'
    });

  } catch (error: any) {
    console.error('Error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Datos inválidos',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}