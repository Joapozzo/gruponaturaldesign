import { Categoria } from "../types/categoria";

const categorias: Categoria[] = [
    {
        id: 'administrativo',
        nombre: 'ADMINISTRATIVO',
        descripcion: 'Elegancia corporativa para oficinas',
        imagen: '/imgs/cat-1.jpg',
        productos: [
            { nombre: 'Camisa Poplin Hombre', imagen: '/imgs/2.png' },
            { nombre: 'Conjunto Sastrero', imagen: '/imgs/3.png' },
            { nombre: 'Blazer Corporativo', imagen: '/imgs/4.png' },
            { nombre: 'Pantalón Formal', imagen: '/imgs/5.png' }
        ]
    },
    {
        id: 'industrial',
        nombre: 'INDUSTRIAL / PLANTA',
        descripcion: 'Resistencia, durabilidad y seguridad laboral',
        imagen: '/imgs/cat-2.jpg',
        productos: [
            { nombre: 'Delantal Chef', imagen: '/imgs/7.png' },
            { nombre: 'Chaqueta Cocinero', imagen: '/imgs/8.png' },
            { nombre: 'Pantalón Cargo Chef', imagen: '/imgs/9.png' },
            { nombre: 'Mandil Camarero', imagen: '/imgs/10.png' }
        ]
    },
    {
        id: 'merch',
        nombre: 'MERCH & OTROS',
        descripcion: 'OTROS: prendas promocionales personalizadas, gastronomía y más ',
        imagen: '/imgs/cat-3.jpg',
        productos: [
            { nombre: 'Mameluco Industrial', imagen: '/imgs/12.png' },
            { nombre: 'Camisa Trabajo', imagen: '/imgs/13.png' },
            { nombre: 'Pantalón Cargo', imagen: '/imgs/14.png' },
            { nombre: 'Chaleco Seguridad', imagen: '/imgs/15.png' }
        ]
    },
];

export default categorias;