'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { z } from 'zod';
import FormModal from '../modal/FormModal';
import Button from '../ui/Button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ProductoDatosComunesStep } from './steps/ProductoDatosComunesStep';
import { ProductoDatosSFactoryStep } from './steps/ProductoDatosSFactoryStep';
import { ProductoDatosLocalesStep } from './steps/ProductoDatosLocalesStep';
import { useProductoWizard, type ModoWizard } from '@/app/hooks/useProductoWizard';
import { useProductoVariante } from '@/app/hooks/useProductoVariante';
import { useProductosMutations } from '@/app/hooks/useProductosMutations';
import { useQuery } from '@tanstack/react-query';
import { productoService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/utils/productosKeys';
import { useRubros } from '@/app/hooks/useRubros';
import { useSubrubros } from '@/app/hooks/useSubrubros';
import { useUploadProductImages } from '@/app/hooks/useProductImages';
import toast from 'react-hot-toast';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';
import type { ProductoPadreBusqueda } from '@/app/services/producto.service';

/** IDs de rubros SFactory permitidos para ecommerce (igual que en API) */
const ECOMMERCE_RUBROS_SFACTORY_IDS = [3285, 3314] as const;
const RUBROS_PERMITIDOS_MSG =
  'Solo se permiten rubros PRODUCTO WORKWEAR (3285) y PRODUCTO OFFICE (3314).';

const paso2SFactorySchema = z.object({
  rubro_id: z
    .number({
      error: (issue) => (issue.input === undefined ? 'El rubro es requerido' : 'Valor inválido'),
    })
    .refine((id) => ECOMMERCE_RUBROS_SFACTORY_IDS.includes(id as 3285 | 3314), {
      message: RUBROS_PERMITIDOS_MSG,
    }),
  subrubro_id: z.number({
    error: (issue) => (issue.input === undefined ? 'El subrubro es requerido' : 'Valor inválido'),
  }),
});

interface ProductoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ProductoPadreConVariantes) => Promise<void>;
  producto?: ProductoPadreConVariantes | null;
  modo?: ModoWizard;
  productoPadreSeleccionado?: ProductoPadreBusqueda;
  loading?: boolean;
}

export const ProductoFormModal: React.FC<ProductoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  producto,
  modo: modoProp,
  productoPadreSeleccionado: productoPadreProp,
  loading: loadingProp = false,
}) => {
  const empresaId = 1; // TODO: Obtener del contexto de autenticación
  
  // Determinar modo
  const modo: ModoWizard = modoProp || (producto ? 'editar' : 'crear-producto');
  const isEditMode = modo === 'editar';

  // Wizard state
  const wizard = useProductoWizard(modo);
  const { state: wizardState, siguientePaso, anteriorPaso, setPaso, updateDatosComunes, updateDatosSFactory, updateDatosLocales, updateVariante, updateImagenesSeleccionadas, setProductoPadreId, setProductoWebId, setItemId, setCreadoEnSFactory, resetWizard } = wizard;

  // Variante hook
  const varianteHook = useProductoVariante();

  // Mutations
  const mutations = useProductosMutations({
    empresaId,
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  });

  // Mutation para subir imágenes
  const uploadImagesMutation = useUploadProductImages();

  // Estados locales
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidatingCodigo, setIsValidatingCodigo] = useState(false);
  const [codigoValido, setCodigoValido] = useState<boolean | undefined>(undefined);
  const [codigoMensaje, setCodigoMensaje] = useState<string>('');

  // Cargar rubros (solo permitidos ecommerce: WORKWEAR 3285, OFFICE 3314)
  const { data: rubrosData } = useRubros({ empresaId, visibleWeb: true, includeSubrubros: false });

  // Rubro local para filtrar subrubros (por sfactoryId del estado)
  const rubroLocalId = useMemo(() => {
    const rubroId = wizardState.datosSFactory.rubro_id;
    if (rubroId == null) return undefined;
    return rubrosData?.data?.find((r) => r.sfactoryId === rubroId)?.id;
  }, [wizardState.datosSFactory.rubro_id, rubrosData?.data]);

  const { data: subrubrosData } = useSubrubros({
    empresaId,
    rubroId: rubroLocalId,
    visibleWeb: true,
  });

  // Query para obtener producto completo en modo edición
  const { data: productoCompleto, isLoading: isLoadingProductoCompleto } = useQuery({
    queryKey: productosKeys.completo(producto?.id || 0),
    queryFn: () => productoService.obtenerProductoCompleto(producto!.id),
    enabled: isEditMode && !!producto && isOpen,
  });

  // Query para obtener datos plantilla en modo crear-variante
  const { data: datosPlantilla, isLoading: isLoadingPlantilla } = useQuery({
    queryKey: productosKeys.datosPlantilla(wizardState.productoPadreId!),
    queryFn: () => productoService.obtenerDatosPlantilla(wizardState.productoPadreId!),
    enabled: modo === 'crear-variante' && !!wizardState.productoPadreId && isOpen,
  });

  // Query para obtener variantes por código base
  const { data: variantesData } = useQuery({
    queryKey: productosKeys.variantesPorCodigoBase(wizardState.datosComunes.codigoBase),
    queryFn: () => productoService.obtenerVariantesPorCodigoBase(wizardState.datosComunes.codigoBase),
    enabled: modo === 'crear-variante' && !!wizardState.datosComunes.codigoBase && wizardState.datosComunes.codigoBase.length > 0 && isOpen,
  });

  // Normalizar rubro_id y subrubro_id a IDs de SFactory (los selects usan sfactoryId como value)
  const datosSFactoryParaEdicion = useMemo(() => {
    if (!isOpen || !isEditMode || !productoCompleto) return null;
    const datos = productoCompleto.datosSFactory;
    const rubroIdRaw = datos.rubro_id;
    const subrubroIdRaw = datos.subrubro_id;
    let rubroIdSfactory: number | null = null;
    let subrubroIdSfactory: number | null = null;
    if (rubrosData?.data?.length) {
      const bySfactory = rubrosData.data.find((r) => r.sfactoryId === rubroIdRaw);
      const byLocal = rubrosData.data.find((r) => r.id === rubroIdRaw);
      rubroIdSfactory = bySfactory ? rubroIdRaw! : (byLocal?.sfactoryId ?? rubroIdRaw ?? null);
    } else {
      rubroIdSfactory = rubroIdRaw ?? null;
    }
    if (subrubrosData?.data?.length) {
      const bySfactory = subrubrosData.data.find((s) => s.sfactoryId === subrubroIdRaw);
      const byLocal = subrubrosData.data.find((s) => s.id === subrubroIdRaw);
      subrubroIdSfactory = bySfactory ? subrubroIdRaw! : (byLocal?.sfactoryId ?? subrubroIdRaw ?? null);
    } else {
      subrubroIdSfactory = subrubroIdRaw ?? null;
    }
    return { ...datos, rubro_id: rubroIdSfactory, subrubro_id: subrubroIdSfactory };
  }, [isOpen, isEditMode, productoCompleto, rubrosData?.data, subrubrosData?.data]);

  // Inicializar wizard cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && productoCompleto) {
        const datos = datosSFactoryParaEdicion ?? productoCompleto.datosSFactory;
        updateDatosComunes({
          nombre: productoCompleto.datosSFactory.descripcion || productoCompleto.datosLocales.nombre,
          codigoBase: productoCompleto.productoPadre.codigoAgrupacion,
        });
        updateDatosSFactory(datos);
        updateDatosLocales({
          descripcionMarketing: productoCompleto.datosLocales.descripcionMarketing ?? '',
          descripcionCorta: productoCompleto.datosLocales.descripcionCorta ?? '',
          destacado: productoCompleto.datosLocales.destacado,
          descripcion: productoCompleto.datosLocales.descripcion ?? '',
        });
        if (productoCompleto.variante) {
          updateVariante({
            talle: productoCompleto.variante.talle,
            color: productoCompleto.variante.color,
          });
          setProductoWebId(productoCompleto.variante.id);
          setItemId(productoCompleto.variante.sfactoryId);
        }
        setProductoPadreId(productoCompleto.productoPadre.id);
        setCreadoEnSFactory(true);
      } else if (modo === 'crear-variante' && productoPadreProp) {
        // Cargar datos del producto padre seleccionado
        // Usar la descripcion de SFactory como nombre (o el nombre del padre si no hay)
        updateDatosComunes({
          nombre: datosPlantilla?.datosSFactory.descripcion || productoPadreProp.nombre,
          codigoBase: productoPadreProp.codigoAgrupacion,
        });
        setProductoPadreId(productoPadreProp.id);
        if (datosPlantilla) {
          updateDatosSFactory(datosPlantilla.datosSFactory);
          updateDatosLocales({
            descripcionMarketing: datosPlantilla.datosLocales.descripcionMarketing ?? '',
            descripcionCorta: datosPlantilla.datosLocales.descripcionCorta ?? '',
            destacado: datosPlantilla.datosLocales.destacado,
            descripcion: datosPlantilla.datosLocales.descripcion ?? '',
          });
        }
      }
    } else {
      // Reset cuando se cierra
      resetWizard();
      setErrors({});
      setCodigoValido(undefined);
      setCodigoMensaje('');
    }
  }, [isOpen, isEditMode, productoCompleto, productoPadreProp, datosPlantilla, modo, datosSFactoryParaEdicion]);

  // Calcular colores disponibles (incluyendo el color del estado local si existe)
  const coloresDisponibles = useMemo(() => {
    // Obtener colores de variantes existentes (si hay)
    const coloresExistentes: string[] = [];
    
    // Si hay variantesData, obtener colores de ahí
    if (variantesData?.variantes) {
      variantesData.variantes.forEach(v => {
        if (v.color && !coloresExistentes.includes(v.color)) {
          coloresExistentes.push(v.color);
        }
      });
    }
    
    // Agregar el color del estado local si existe y no está en la lista
    const colorLocal = wizardState.variante.color;
    if (colorLocal && !coloresExistentes.includes(colorLocal)) {
      coloresExistentes.push(colorLocal);
    }
    
    return coloresExistentes.sort();
  }, [variantesData, wizardState.variante.color]);

  // Validar código en tiempo real
  const validarCodigo = useCallback(async (codigo: string) => {
    if (!codigo || codigo.length < 3) {
      setCodigoValido(undefined);
      setCodigoMensaje('');
      return;
    }

    setIsValidatingCodigo(true);
    try {
      const resultado = await mutations.validarCodigo(codigo);
      setCodigoValido(!resultado.existe);
      setCodigoMensaje(resultado.mensaje || '');
      if (resultado.existe) {
        setErrors((prev) => ({ ...prev, codigoCompleto: resultado.mensaje || 'Este código ya existe' }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.codigoCompleto;
          return newErrors;
        });
      }
    } catch (error) {
      setCodigoValido(false);
      setCodigoMensaje('Error al validar código');
    } finally {
      setIsValidatingCodigo(false);
    }
  }, [mutations]);

  // Validar paso 1
  const validarPaso1 = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // En modo editar, no validar nombre ni código (están deshabilitados)
    if (modo !== 'editar') {
      if (!wizardState.datosComunes.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      }
    }

    if (modo === 'crear-variante') {
      // Validar que tenga código base y sufijo (código completo)
      const codigoCompleto = wizardState.datosComunes.codigoCompleto || 
                            (wizardState.datosComunes.codigoBase + ''); // Si no hay codigoCompleto, usar codigoBase
      if (!codigoCompleto.trim() || !wizardState.datosComunes.codigoBase.trim()) {
        newErrors.codigoCompleto = 'El código completo es requerido';
      } else if (codigoValido === false) {
        newErrors.codigoCompleto = codigoMensaje || 'Este código ya existe';
      }
      if (!wizardState.variante.talle) {
        newErrors.talle = 'El talle es requerido para variantes';
      }
      if (!wizardState.variante.color) {
        newErrors.color = 'El color es requerido para variantes';
      }
    } else if (modo !== 'editar') {
      // Solo validar código base si no es modo editar
      if (!wizardState.datosComunes.codigoBase.trim()) {
        newErrors.codigoBase = 'El código base es requerido';
      }
    }

    setErrors(newErrors);
    
    // Scroll al primer error si hay errores
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors)[0];
        const errorElement = document.getElementById(firstErrorField) || 
                           document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }, 100);
    }
    
    return Object.keys(newErrors).length === 0;
  }, [wizardState, modo, codigoValido, codigoMensaje]);

  // Función para parsear errores del backend y mapearlos a campos
  const parsearErrorBackend = useCallback((errorMessage: string): Record<string, string> => {
    const errores: Record<string, string> = {};
    
    // Mapeo de mensajes de error comunes a campos (case insensitive)
    const errorLower = errorMessage.toLowerCase();
    
    // Mapeo de patrones de error a campos
    const mapeoErrores: Array<{ pattern: string | RegExp; campo: string; mensaje: string }> = [
      { pattern: /subrubro.*id/i, campo: 'subrubro_id', mensaje: 'El subrubro es requerido' },
      { pattern: /rubro.*id/i, campo: 'rubro_id', mensaje: 'El rubro es requerido' },
      { pattern: /unidad.*medida.*id/i, campo: 'um_id', mensaje: 'La unidad de medida es requerida' },
      { pattern: /descripcion/i, campo: 'descripcion', mensaje: 'La descripción es requerida' },
      { pattern: /tipo/i, campo: 'tipo', mensaje: 'El tipo es requerido' },
      { pattern: /codigo/i, campo: 'codigo', mensaje: 'El código es requerido' },
    ];

    // Buscar en el mensaje de error
    for (const { pattern, campo, mensaje } of mapeoErrores) {
      if (pattern instanceof RegExp ? pattern.test(errorMessage) : errorLower.includes(pattern.toLowerCase())) {
        errores[campo] = mensaje;
        break; // Solo tomar el primer error encontrado
      }
    }

    return errores;
  }, []);

  // Validar paso 2 con Zod (rubro permitido 3285 o 3314, subrubro requerido)
  const validarPaso2 = useCallback((): boolean => {
    if (modo === 'crear-variante') {
      return true;
    }

    const result = paso2SFactorySchema.safeParse({
      rubro_id: wizardState.datosSFactory.rubro_id ?? undefined,
      subrubro_id: wizardState.datosSFactory.subrubro_id ?? undefined,
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    const zodErrors = result.error.flatten().fieldErrors;
    if (zodErrors.rubro_id?.[0]) newErrors.rubro_id = zodErrors.rubro_id[0];
    if (zodErrors.subrubro_id?.[0]) newErrors.subrubro_id = zodErrors.subrubro_id[0];
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors)[0];
        const errorElement = document.getElementById(firstErrorField) ||
          document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (errorElement as HTMLElement).focus();
        }
      }, 100);
    }

    return false;
  }, [wizardState.datosSFactory.rubro_id, wizardState.datosSFactory.subrubro_id, modo]);

  // Validar paso 3
  const validarPaso3 = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (modo === 'crear-variante') {
      if (!wizardState.variante.talle) {
        newErrors.talle = 'El talle es requerido para variantes';
      }
      if (!wizardState.variante.color) {
        newErrors.color = 'El color es requerido para variantes';
      } else if (variantesData?.variantes) {
        // Validar si el color ya existe en las variantes del producto padre
        const coloresExistentes = variantesData.variantes
          .map(v => v.color)
          .filter((c): c is string => !!c);
        
        if (coloresExistentes.includes(wizardState.variante.color)) {
          // El color ya existe, mostrar advertencia pero permitir continuar
          toast(`⚠️ El color "${wizardState.variante.color}" ya existe en este producto. Se creará otra variante con el mismo color.`, {
            duration: 5000,
            icon: '⚠️',
          });
        }
      }
    }

    setErrors(newErrors);
    
    // Scroll al primer error si hay errores
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors)[0];
        const errorElement = document.getElementById(firstErrorField) || 
                           document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }, 100);
    }
    
    return Object.keys(newErrors).length === 0;
  }, [wizardState, modo, variantesData]);

  // Handler para avanzar al siguiente paso
  const handleSiguiente = useCallback(async () => {
    if (wizardState.pasoActual === 1) {
      if (!validarPaso1()) return;

      // Si es variante, validar código antes de continuar
      if (modo === 'crear-variante' && wizardState.datosComunes.codigoCompleto) {
        setIsValidatingCodigo(true);
        try {
          const resultado = await mutations.validarCodigo(wizardState.datosComunes.codigoCompleto);
          if (resultado.existe) {
            setCodigoValido(false);
            setCodigoMensaje(resultado.mensaje || 'Este código ya existe');
            setErrors((prev) => ({ ...prev, codigoCompleto: resultado.mensaje || 'Este código ya existe' }));
            setIsValidatingCodigo(false);
            return;
          } else {
            setCodigoValido(true);
            setCodigoMensaje('');
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.codigoCompleto;
              return newErrors;
            });
          }
        } catch (error) {
          setCodigoValido(false);
          setCodigoMensaje('Error al validar código');
          setIsValidatingCodigo(false);
          return;
        } finally {
          setIsValidatingCodigo(false);
        }
      }

      // En modo crear-variante, saltar el paso 2 (SFactory) y ir directo al paso 3
      if (modo === 'crear-variante') {
        setPaso(3);
      } else {
        siguientePaso();
      }
    } else if (wizardState.pasoActual === 2) {
      if (!validarPaso2()) return;

      // Crear en SFactory
      try {
        const codigo = modo === 'crear-variante' 
          ? wizardState.datosComunes.codigoCompleto!
          : wizardState.datosComunes.codigoBase;

        const datosSFactoryCompletos = {
          ...wizardState.datosSFactory,
          codigo: codigo || undefined,
          tipo: 'P',
          descripcion: (wizardState.datosSFactory.descripcion?.trim() || wizardState.datosComunes.nombre) as string,
          item_venta: 1,
          um_id: wizardState.datosSFactory.um_id || 1,
        } as any;

        // console.log('📦 Datos que se envían a SFactory:', JSON.stringify(datosSFactoryCompletos, null, 2));

        let productoCreado: ProductoPadreConVariantes;
        
        if (isEditMode && wizardState.itemId) {
          // Actualizar en SFactory
          productoCreado = await mutations.actualizarProductoEnSFactory({
            itemId: wizardState.itemId,
            data: { ...datosSFactoryCompletos, item_id: wizardState.itemId },
          });
          // console.log('✅ Producto actualizado en SFactory - Respuesta:', JSON.stringify(productoCreado, null, 2)); 
        } else {
          // Crear en SFactory
          productoCreado = await mutations.crearProducto(datosSFactoryCompletos);
          // console.log('✅ Producto creado en SFactory - Respuesta:', JSON.stringify(productoCreado, null, 2)); 
        }

        // Guardar IDs
        setProductoPadreId(productoCreado.id);
        if (productoCreado.productosWeb && productoCreado.productosWeb.length > 0) {
          setProductoWebId(productoCreado.productosWeb[0].id);
          setItemId(productoCreado.productosWeb[0].sfactoryId);
        }
        setCreadoEnSFactory(true);

        toast.success('Producto creado/actualizado en SFactory correctamente');
        siguientePaso();
      } catch (error: any) {
        // Parsear errores del backend y mostrarlos en los campos correspondientes
        const errorMessage = error.message || 'Error al crear/actualizar producto en SFactory';
        const erroresBackend = parsearErrorBackend(errorMessage);
        
        if (Object.keys(erroresBackend).length > 0) {
          // Si hay errores específicos de campos, mostrarlos en los inputs
          setErrors((prev) => ({ ...prev, ...erroresBackend }));
          
          // Scroll al primer error
          setTimeout(() => {
            const firstErrorField = Object.keys(erroresBackend)[0];
            const errorElement = document.getElementById(firstErrorField) || 
                               document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              errorElement.focus();
            }
          }, 100);
        }
        
        toast.error(errorMessage);
      }
    }
  }, [wizardState, modo, isEditMode, validarPaso1, validarPaso2, validarCodigo, codigoValido, mutations, siguientePaso, setProductoPadreId, setProductoWebId, setItemId, setCreadoEnSFactory, parsearErrorBackend]);

  // Handler para finalizar
  const handleFinalizar = useCallback(async () => {
    if (!validarPaso3()) return;

    try {
      let productoWebIdFinal = wizardState.productoWebId;
      
      // Si es crear-producto y hay talle y color, crear la primera variante
      // (Solo si no se creó automáticamente en el useEffect)
      if (modo === 'crear-producto' && wizardState.variante.talle && wizardState.variante.color && !wizardState.productoWebId) {
        // Crear variante en SFactory usando el código base + número 1
        const codigoVariante = `${wizardState.datosComunes.codigoBase}1`;
        
        const datosVarianteSFactory = {
          ...wizardState.datosSFactory,
          codigo: codigoVariante,
          tipo: 'P',
          descripcion: (wizardState.datosSFactory.descripcion?.trim() || wizardState.datosComunes.nombre) as string,
          item_venta: 1,
          um_id: wizardState.datosSFactory.um_id || 1,
        };

        // console.log('📦 Creando primera variante en SFactory:', JSON.stringify(datosVarianteSFactory, null, 2)); 

        const varianteCreada = await mutations.crearProducto(datosVarianteSFactory);
        
        // console.log('✅ Variante creada en SFactory - Respuesta:', JSON.stringify(varianteCreada, null, 2)); 
        
        // Guardar IDs de la variante
        if (varianteCreada.productosWeb && varianteCreada.productosWeb.length > 0) {
          productoWebIdFinal = varianteCreada.productosWeb[0].id;
          const itemId = varianteCreada.productosWeb[0].sfactoryId;
          
          // Actualizar datos de la variante (talle y color)
          await mutations.actualizarDatosVariante({
            productoWebId: productoWebIdFinal,
            data: {
              talle: wizardState.variante.talle,
              color: wizardState.variante.color,
            },
          });
          
          // Guardar IDs en el wizard state
          setProductoWebId(productoWebIdFinal);
          setItemId(itemId);
          
          toast.success('Variante creada correctamente');
        }
      }

      // Actualizar datos locales
      if (wizardState.productoPadreId) {
        await mutations.actualizarDatosLocales({
          id: wizardState.productoPadreId,
          data: {
            descripcionMarketing: wizardState.datosLocales.descripcionMarketing,
            descripcionCorta: wizardState.datosLocales.descripcionCorta,
            destacado: wizardState.datosLocales.destacado,
            nombre: wizardState.datosComunes.nombre,
            descripcion: wizardState.datosLocales.descripcion,
          },
        });
      }

      // Crear variante en SFactory si es modo crear-variante
      if (modo === 'crear-variante' && wizardState.productoPadreId && !wizardState.productoWebId) {
        // Obtener datos del producto padre para crear la variante
        const productoPadre = await productoService.obtenerDatosPlantilla(wizardState.productoPadreId);
        
        // Crear variante en SFactory usando el código completo
        // IMPORTANTE: La variante hereda rubro_id, subrubro_id y um_id del producto padre
        // CRÍTICO: rubro_id y subrubro_id DEBEN estar presentes y no ser null
        if (!productoPadre.datosSFactory.rubro_id || !productoPadre.datosSFactory.subrubro_id) {
          throw new Error('El producto padre no tiene rubro_id o subrubro_id. No se puede crear la variante sin estos datos.');
        }

        const datosVarianteSFactory = {
          // PRIMERO: Campos críticos heredados del padre (rubro_id, subrubro_id, um_id, moneda_id)
          rubro_id: productoPadre.datosSFactory.rubro_id,
          subrubro_id: productoPadre.datosSFactory.subrubro_id,
          um_id: productoPadre.datosSFactory.um_id || 1, // Heredado del padre
          moneda_id: productoPadre.datosSFactory.moneda_id || 1, // Heredado del padre, por defecto 1
          // SEGUNDO: Código
          codigo: wizardState.datosComunes.codigoCompleto!,
          // TERCERO: Resto de datos del padre (esto incluye tipo, descripcion, item_venta, etc.)
          ...productoPadre.datosSFactory,
          tipo: 'P',
          descripcion: (productoPadre.datosSFactory.descripcion?.trim() || productoPadre.datosLocales.nombre) as string,
          item_venta: 1,
        };

        // console.log('📦 Creando variante en SFactory:', JSON.stringify(datosVarianteSFactory, null, 2));  

        const varianteCreada = await mutations.crearProducto(datosVarianteSFactory);
        
        // console.log('✅ Variante creada en SFactory - Respuesta:', JSON.stringify(varianteCreada, null, 2)); 
        
        // Guardar IDs de la variante
        if (varianteCreada.productosWeb && varianteCreada.productosWeb.length > 0) {
          productoWebIdFinal = varianteCreada.productosWeb[0].id;
          const itemId = varianteCreada.productosWeb[0].sfactoryId;
          
          // Actualizar datos de la variante (talle y color)
          await mutations.actualizarDatosVariante({
            productoWebId: productoWebIdFinal,
            data: {
              talle: wizardState.variante.talle,
              color: wizardState.variante.color,
            },
          });
          
          // Guardar IDs en el wizard state
          setProductoWebId(productoWebIdFinal);
          setItemId(itemId);
          
          toast.success('Variante creada correctamente');
        }
      } else if (modo === 'crear-variante' && wizardState.productoWebId) {
        // Si ya existe, solo actualizar datos
        await mutations.actualizarDatosVariante({
          productoWebId: wizardState.productoWebId,
          data: {
            talle: wizardState.variante.talle,
            color: wizardState.variante.color,
          },
        });
      }

      toast.success('Producto guardado correctamente');
      if (onSubmit && wizardState.productoPadreId) {
        const productoFinal = await productoService.getById(wizardState.productoPadreId, true);
        await onSubmit(productoFinal);
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar datos locales');
    }
  }, [wizardState, modo, validarPaso3, mutations, uploadImagesMutation, onSubmit, onClose, setProductoWebId, setItemId]);

  // Handlers de cambios
  const handleNombreChange = (value: string) => {
    updateDatosComunes({ nombre: value });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.nombre;
      return newErrors;
    });
  };

  const handleCodigoBaseChange = (value: string) => {
    updateDatosComunes({ codigoBase: value });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.codigoBase;
      return newErrors;
    });
  };

  const handleCodigoCompletoChange = (value: string) => {
    updateDatosComunes({ codigoCompleto: value });
    validarCodigo(value);
  };


  const handleSFactoryFieldChange = (field: string, value: any) => {
    updateDatosSFactory({ [field]: value });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const isLoading = loadingProp || isLoadingProductoCompleto || isLoadingPlantilla;

  // Footer actions
  const footerActions = (
    <div className="flex items-center justify-between w-full">
      <Button
        type="button"
        variant="grayOutline"
        size="lg"
        onClick={wizardState.pasoActual === 1 ? onClose : (modo === 'crear-variante' && wizardState.pasoActual === 3 ? () => setPaso(1) : anteriorPaso)}
        disabled={isLoading}
        className="tracking-wide h-12"
      >
        {wizardState.pasoActual === 1 ? (
          'Cancelar'
        ) : (
          <>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Paso {modo === 'crear-variante' ? (wizardState.pasoActual === 1 ? 1 : 2) : wizardState.pasoActual} de {modo === 'crear-variante' ? 2 : 3}
        </span>
      </div>

      <Button
        type="button"
        variant="black"
        size="lg"
        onClick={(modo === 'crear-variante' && wizardState.pasoActual === 3) || wizardState.pasoActual === 3 ? handleFinalizar : handleSiguiente}
        disabled={isLoading}
        className="tracking-wide h-12 flex items-center justify-center min-w-[120px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (modo === 'crear-variante' && wizardState.pasoActual === 3) || wizardState.pasoActual === 3 ? (
          'Finalizar'
        ) : (
          <>
            Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode
          ? 'Editar producto'
          : modo === 'crear-variante'
          ? 'Crear Variante'
          : 'Crear producto nuevo'
      }
      size="xl"
      showCancel={false}
      footerActions={footerActions}
    >
      {wizardState.pasoActual === 1 && (
        <ProductoDatosComunesStep
          modo={modo}
          nombre={wizardState.datosComunes.nombre}
          codigoBase={wizardState.datosComunes.codigoBase}
          codigoCompleto={wizardState.datosComunes.codigoCompleto}
          productoPadreNombre={productoPadreProp?.nombre}
          siguienteNumeroSugerido={variantesData?.siguienteSugerido}
          variante={modo === 'crear-variante' ? wizardState.variante : undefined}
          onTalleChange={modo === 'crear-variante' ? (value) => updateVariante({ talle: value }) : undefined}
          onColorChange={modo === 'crear-variante' ? (value) => updateVariante({ color: value }) : undefined}
          onNombreChange={handleNombreChange}
          onCodigoBaseChange={handleCodigoBaseChange}
          onCodigoCompletoChange={handleCodigoCompletoChange}
          errors={errors}
          isValidatingCodigo={isValidatingCodigo}
          codigoValido={codigoValido}
          codigoMensaje={codigoMensaje}
        />
      )}

      {wizardState.pasoActual === 2 && modo !== 'crear-variante' && (
        <ProductoDatosSFactoryStep
          datosSFactory={wizardState.datosSFactory}
          errors={errors}
          onFieldChange={handleSFactoryFieldChange}
          bloqueado={false}
          rubros={rubrosData?.data ?? []}
          subrubros={subrubrosData?.data ?? []}
        />
      )}

      {wizardState.pasoActual === 3 && (
        <ProductoDatosLocalesStep
          datosLocales={wizardState.datosLocales}
          modo={modo}
          errors={errors}
          onDescripcionMarketingChange={(value) => updateDatosLocales({ descripcionMarketing: value })}
          onDescripcionCortaChange={(value) => updateDatosLocales({ descripcionCorta: value })}
          onDescripcionChange={(value) => updateDatosLocales({ descripcion: value })}
          onDestacadoChange={(value) => updateDatosLocales({ destacado: value })}
        />
      )}
    </FormModal>
  );
};

export default ProductoFormModal;
