// Importa los módulos necesarios de Sequelize
const { Sequelize, DataTypes } = require("sequelize");

// Crea una nueva instancia de Sequelize para conectarse a la base de datos MySQL
const sequelize = new Sequelize('sequelize', 'Pruebas', 'Pruebas.1234', {
    host: 'localhost',
    dialect: 'mysql',
});

// Función autoejecutable asíncrona
(async () => {
    // Define el modelo de Usuario
    const Usuario = sequelize.define('Usuario', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    // Define el modelo de Pedido
    const Pedido = sequelize.define('Pedido', {
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    // Establece la relación entre Usuario y Pedido (un usuario puede tener muchos pedidos)
    Usuario.hasMany(Pedido);
    // Establece la relación inversa (un pedido pertenece a un usuario)
    Pedido.belongsTo(Usuario);

    // Sincroniza los modelos con la base de datos
    await sequelize.sync().then(() => {
        console.log('Los modelos fueron sincronizados con exito!')
    }).catch((err) => {
        console.log('Hubo un error al intentar sincronizar los modelos: ', err)
    });

    try {
        // Crea cuatro usuarios
        const user1 = await Usuario.create({ nombre: "nombre1", apellido: 'apellido1' });
        const user2 = await Usuario.create({ nombre: "nombre2", apellido: 'apellido2' });
        const user3 = await Usuario.create({ nombre: "nombre3", apellido: 'apellido3' });
        const user4 = await Usuario.create({ nombre: "nombre4", apellido: 'apellido4' });

        // Crea cuatro pedidos
        const pedido = await Pedido.create({ descripcion: 'dadf', cantidad: 2, precio: 10.2, estado: 'pendiente' })
        const pedido2 = await Pedido.create({ descripcion: 'asdf', cantidad: 3, precio: 2.4, estado: 'pendiente' })
        const pedido3 = await Pedido.create({ descripcion: 'asdf', cantidad: 3, precio: 2.4, estado: 'pendiente' })
        const pedido4 = await Pedido.create({ descripcion: 'asdf', cantidad: 3, precio: 2.4, estado: 'pendiente' })

        // Busca un pedido y un usuario específicos
        const ped = await Pedido.findByPk(1);
        const usr = await Usuario.findByPk(3);

        // Asocia el pedido al usuario
        await usr.addPedido(ped);

        // Busca todos los usuarios incluyendo sus pedidos asociados
        const usuarios = await Usuario.findAll({ include: Pedido });
        console.log(usuarios);

        // Actualiza el nombre de un usuario específico
        const userMod = await Usuario.findByPk(1);
        await userMod.update({ nombre: 'nuevoNombre' });

        // Elimina un pedido específico
        const pedidoDel = await Pedido.findByPk(1);
        await pedidoDel.destroy();

        // Actualiza el nombre de un usuario específico usando un método alternativo
        await Usuario.update({ nombre: 'nuevoNombreDos' }, { where: { id: 1 } });

        // Cierra la conexión con la base de datos
        sequelize.close();

    } catch (err) {
        // Maneja cualquier error que pueda ocurrir durante la ejecución
        console.error('Error al ejecutar: ', err)
    }
})();