# Componentes de Clientes

Este directorio contiene los componentes reutilizables para la gestión de clientes.

## ClienteFormModal

Modal reutilizable para crear o editar clientes. Incluye todos los campos requeridos por SFactory.

### Uso Básico

```tsx
import { ClienteFormModal } from '@/app/components/admin/clientes';
import { useClienteFormModal } from '@/app/hooks/useClienteFormModal';

function MyComponent() {
  const { isOpen, openModal, closeModal, handleSuccess } = useClienteFormModal({
    onSuccess: (cliente) => {
      console.log('Cliente creado:', cliente);
    }
  });

  return (
    <>
      <button onClick={openModal}>Crear Cliente</button>
      <ClienteFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </>
  );
}
```

### Uso en Checkout (sin refrescar la lista)

```tsx
import { ClienteFormModal } from '@/app/components/admin/clientes';
import { useClienteFormModal } from '@/app/hooks/useClienteFormModal';

function CheckoutPage() {
  const [selectedCliente, setSelectedCliente] = useState(null);

  const { isOpen, openModal, closeModal, handleSuccess } = useClienteFormModal({
    onSuccess: (cliente) => {
      // Usar el cliente creado en el checkout
      setSelectedCliente(cliente);
      // No se refresca la lista automáticamente
    },
    skipRefresh: true // Importante: no refresca la lista
  });

  return (
    <>
      <button onClick={openModal}>Crear Nuevo Cliente</button>
      <ClienteFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </>
  );
}
```

### Campos del Formulario

El formulario incluye todos los campos requeridos por SFactory:

- **Información Básica:**
  - Código (opcional, se genera automáticamente si está vacío)
  - Razón Social (requerido)
  - Nombre
  - CUIT
  - Categoría Fiscal
  - Tipo de Cliente

- **Información de Contacto:**
  - Email
  - Teléfono
  - Móvil

- **Domicilio Fiscal:**
  - Domicilio Fiscal
  - Código Postal
  - ID Localidad
  - ID Provincia
  - ID País

- **Información Adicional:**
  - Código Externo
  - ID Contabilidad (CTB)
  - ID Cuenta

### Validaciones

- Razón Social: Requerido
- Email: Validación de formato si se proporciona
- CUIT: Validación de formato (11 dígitos) si se proporciona

