// PRE-ENTREGA - GESTIÓN DE PRODUCTOS CON FAKESTORE API
// Desarrollado por: JOAQUIN G.
// Fecha: 2026-04-29

// 1. CONSTANTES
const url = "https://fakestoreapi.com/products";
const args = process.argv.slice(2);

//2. FUNCIONES
// Ver todos los productos
async function obtenerTodosLosProductos() {
    console.log("Obteniendo todos los productos...");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        const data = await response.json();
        const productosSimplicados = data.map(
            ({ id, title, price, category }) => ({
                id,
                title,
                price,
                category,
            }),
        );
        console.table(productosSimplicados);
    } catch (error) {
        console.error("Ocurrió un problema al obtener los productos");
        console.error("- Detalle:", error.message);
    } finally {
        console.log("Fin del proceso de obtención.");
    }
}

// Ver un producto específico
async function obtenerProductoPorId(id) {
    console.log(`Obteniendo el producto ${id}...`);
    try {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) {
            throw new Error(
                `Producto con ID ${id} no encontrado (Status: ${response.status})`,
            );
        }
        const data = await response.json();
        if (!data) {
            throw new Error(`Producto con ID ${id} sin datos`);
        }
        const simplificado = {
            id: data.id,
            titulo: data.title,
            precio: data.price,
            categoria: data.category,
        };
        console.log(`--- Detalle del Producto ${id} ---`);
        console.table(simplificado);
    } catch (error) {
        console.error(`Ocurrió un problema al obtener el producto ${id}`);
        console.error("- Detalle:", error.message);
    } finally {
        console.log("Fin del proceso de obtención.");
    }
}

// Agregar un producto nuevo
async function agregarProducto(title, price, category) {
    console.log("Agregando nuevo producto...");
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                title: title,
                price: parseFloat(price),
                category: category,
            }),
        });
        if (!response.ok) {
            throw new Error(`Error al crear: ${response.status}`);
        }
        const nuevoProducto = await response.json();
        console.log("Producto creado exitosamente.");
        console.table({
            id: nuevoProducto.id,
            title: title,
            price: price,
            category: category,
        });
    } catch (error) {
        console.log("No se pudo crear el producto:", error.message);
    } finally {
        console.log("Fin del proceso de creación.");
    }
}

// Eliminar un producto
async function eliminarProducto(id) {
    console.log(`Eliminando el producto ${id}...`);
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(
                `Producto con ID ${id} no encontrado (Status: ${response.status})`,
            );
        }
        const data = await response.json();
        if (!data) {
            throw new Error(`Producto con ID ${id} sin datos`);
        }
        console.log(`Producto ${id} "${data.title}" eliminado con éxito.`);
    } catch (error) {
        console.error(`Ocurrió un problema al eliminar el producto ${id}`);
        console.error("- Detalle:", error.message);
    } finally {
        console.log("Fin del proceso de eliminación.");
    }
}

// 3. EJECUCIÓN
switch (args[0]) {
    case "GET":
        if (args[1] && args[1].includes("/")) {
            const id = args[1].split("/")[1];
            obtenerProductoPorId(id);
        } else {
            obtenerTodosLosProductos();
        }
        break;
    case "POST":
        if (args[1] !== "products") {
            console.log(
                "Error: La ruta debe ser 'products'. Uso: POST products <titulo> <precio> <categoria>",
            );
            break;
        }
        if (args.length < 5) {
            console.log(
                "Faltan datos: Uso POST products <titulo> <precio> <categoria>",
            );
            break;
        }
        const title = args[2];
        const price = args[3];
        const category = args[4];

        agregarProducto(title, price, category);
        break;

    case "DELETE":
        if (!args[1]) {
            console.log("Error: Debes ingresar un ID para eliminar.");
        } else {
            if (args[1] && args[1].includes("/")) {
            const id = args[1].split("/")[1];
            eliminarProducto(id);
        }}
        break;
    default:
        console.log(`--- Sistema de Gestión FakeStore ---

            Ingresar: 
            - "GET products" para obtener todos los productos.
            - "GET products/<id>" para obtener un producto específico.
            - "POST products <titulo> <precio> <categoría>" para agregar un nuevo producto.
            - "DELETE products/<id>" para eliminar un producto específico. 
            `);
        break;
}
