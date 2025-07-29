export type CategoriaIndumentaria = "ABRIGOS" | "PANTALONES" | "CHOMBAS Y REMERAS" | "CAMISAS";

export type ProductType = {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    categoriaIndumentaria: CategoriaIndumentaria;
    precio: string;
    imagenes: string[];
    destacado?: boolean;
};
