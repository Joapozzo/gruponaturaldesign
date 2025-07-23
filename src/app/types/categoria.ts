export type Categoria = {
    id: string;
    nombre: string;
    descripcion: string;
    imagen: string;
    productos: {
        nombre: string;
        imagen: string;
    }[];
};