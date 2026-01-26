# Navbar - Estructura Atomizada

## 📁 Estructura de Carpetas

```
components/navbar/
├── NavbarContainer.tsx      # Componente principal (orquestador)
├── NavbarTopRow.tsx         # Primera fila (buscador, logo, acciones)
├── NavbarDesktopMenu.tsx    # Menú desktop (segunda fila)
├── NavbarMobileMenu.tsx     # Menú móvil desplegable
├── NavbarLogo.tsx           # Componente logo
├── NavbarActions.tsx        # Botones user/cart
├── NavbarMenuItem.tsx       # Item individual del menú
├── ShopDesktopSubmenu.tsx   # Submenú shop (desktop)
├── ShopMobileSubmenu.tsx    # Submenú shop (mobile)
├── CategorySection.tsx      # Sección de categorías (género/rubro/subrubro)
├── types.ts                 # Tipos compartidos
├── index.ts                 # Exports del módulo
└── README.md                # Esta documentación
```

## 🎯 Responsabilidades

### NavbarContainer
- **Responsabilidad**: Orquestar hooks, estados y renderizar estructura principal
- **Lógica**: Maneja todos los hooks (useNavbarMenu, useNavbarNavigation, useCart, etc.)
- **Renderizado**: Estructura principal del navbar (motion.nav) y componentes hijos

### NavbarTopRow
- **Responsabilidad**: Primera fila del navbar (buscador, logo, acciones)
- **Props**: itemCount, isInCheckout, textClasses, callbacks
- **Lógica**: Solo renderizado, no lógica de negocio

### NavbarDesktopMenu
- **Responsabilidad**: Menú de navegación desktop (segunda fila)
- **Props**: menuItems, isLinkActive, callbacks, shopMenuRef
- **Lógica**: Renderiza items del menú y submenú shop para desktop

### NavbarMobileMenu
- **Responsabilidad**: Menú móvil desplegable
- **Props**: isOpen, menuItems, callbacks, submenu states
- **Lógica**: Renderiza menú móvil con animaciones

### NavbarLogo
- **Responsabilidad**: Renderizar logo con animación
- **Props**: width, height, className, isMobile
- **Lógica**: Click handler para navegar a inicio

### NavbarActions
- **Responsabilidad**: Botones de usuario y carrito
- **Props**: itemCount, isInCheckout, textClasses, callbacks
- **Lógica**: Renderiza botones user/cart con badge de items

### NavbarMenuItem
- **Responsabilidad**: Item individual del menú
- **Props**: item, index, isActive, textClasses, onClick
- **Lógica**: Renderiza un item con estados activo/inactivo

### ShopDesktopSubmenu
- **Responsabilidad**: Submenú horizontal de categorías (desktop)
- **Props**: isOpen, categories, callbacks
- **Lógica**: Renderiza secciones de categorías (género, rubro, subrubro)

### ShopMobileSubmenu
- **Responsabilidad**: Submenú de categorías (mobile)
- **Props**: isOpen, categories, callbacks
- **Lógica**: Renderiza secciones de categorías para mobile

### CategorySection
- **Responsabilidad**: Sección individual de categorías
- **Props**: title, items, type, onItemClick, isMobile
- **Lógica**: Renderiza una sección (género, rubro o subrubro)

## 🔄 Flujo de Datos

```
NavbarContainer (hooks + estado)
    ↓
    ├── NavbarTopRow (buscador, logo, acciones)
    │   ├── NavbarLogo
    │   └── NavbarActions
    │
    ├── NavbarDesktopMenu (menú desktop)
    │   ├── NavbarMenuItem (items)
    │   └── ShopDesktopSubmenu
    │       └── CategorySection (género/rubro/subrubro)
    │
    └── NavbarMobileMenu (menú mobile)
        ├── NavbarMenuItem (items)
        └── ShopMobileSubmenu
            └── CategorySection (género/rubro/subrubro)
```

## 🎨 Convenciones

- **Props tipadas**: Todos los componentes usan TypeScript con interfaces claras
- **Componentes "tontos"**: La mayoría son componentes de presentación
- **Lógica en hooks**: Toda la lógica de negocio está en hooks (useNavbarMenu, useNavbarNavigation)
- **Estilos consistentes**: Todas las clases Tailwind se mantienen exactamente iguales
- **Animaciones**: Framer Motion se mantiene en todos los componentes

## 📝 Notas

- El componente principal `Navbar.tsx` es solo un re-export para mantener compatibilidad
- Todos los hooks existentes se mantienen sin cambios
- No se modificó ningún estilo ni comportamiento
- La estructura es escalable y fácil de mantener

