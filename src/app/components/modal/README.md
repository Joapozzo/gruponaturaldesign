# Modales Reutilizables

Sistema de modales animados y responsivos para el admin. Todos los modales están construidos sobre `BaseModal` para mantener consistencia en animaciones y comportamiento.

## Componentes Disponibles

### BaseModal
Componente base reutilizable con animaciones. No se usa directamente, sino como base para otros modales.

### AlertModal
Modal para mostrar información, alertas y mensajes de éxito/error.

```tsx
import AlertModal from '@/app/components/modal/AlertModal';

<AlertModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título del alert"
  message="Mensaje descriptivo"
  type="success" // 'success' | 'error' | 'warning' | 'info'
  confirmText="Aceptar"
  onConfirm={() => console.log('Confirmado')}
/>
```

### ConfirmModal
Modal para confirmaciones con opción de cancelar.

```tsx
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import { useConfirmModal } from '@/app/components/hooks/useModal';

const MyComponent = () => {
  const confirmModal = useConfirmModal();

  const handleDelete = () => {
    confirmModal.showModal({
      title: 'Eliminar',
      message: '¿Estás seguro?',
      type: 'warning',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        // Acción a realizar
      },
    });
  };

  return (
    <>
      <button onClick={handleDelete}>Eliminar</button>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        onConfirm={confirmModal.handleConfirm}
        title={confirmModal.modalOptions.title}
        message={confirmModal.modalOptions.message}
        type={confirmModal.modalOptions.type}
        loading={confirmModal.loading}
      />
    </>
  );
};
```

### FormModal
Modal base para formularios (creación/edición).

```tsx
import FormModal from '@/app/components/modal/FormModal';

<FormModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Crear Item"
  onSubmit={async (e) => {
    e.preventDefault();
    // Guardar datos
  }}
  submitText="Guardar"
  loading={isLoading}
  size="lg"
>
  {/* Campos del formulario */}
  <input type="text" name="nombre" />
</FormModal>
```

### ProductoFormModal
Modal específico para crear/editar productos.

```tsx
import ProductoFormModal from '@/app/components/modal/ProductoFormModal';

<ProductoFormModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={async (data) => {
    // Guardar producto
  }}
  producto={producto} // null para crear, objeto para editar
  loading={isLoading}
/>
```

## Hooks Disponibles

### useConfirmModal
Hook para facilitar el uso de ConfirmModal.

```tsx
import { useConfirmModal } from '@/app/components/hooks/useModal';

const { isOpen, loading, modalOptions, showModal, closeModal, handleConfirm } = useConfirmModal();
```

### useAlertModal
Hook para facilitar el uso de AlertModal.

```tsx
import { useAlertModal } from '@/app/components/hooks/useAlertModal';

const { isOpen, options, showAlert, closeAlert, handleConfirm } = useAlertModal();
```

## Características

- ✅ Animaciones suaves con Framer Motion
- ✅ Responsive (mobile-first)
- ✅ Accesible (ARIA labels, teclado)
- ✅ Backdrop blur
- ✅ Cierre con click fuera del modal
- ✅ Estados de carga
- ✅ Tipos de alerta (success, error, warning, info)
- ✅ Z-index configurable

## Ejemplo Completo

Ver implementación en `gnd-front/src/app/(pages)/admin/productos/page.tsx`

