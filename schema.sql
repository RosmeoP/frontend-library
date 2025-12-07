-- Categoria 
CREATE TABLE categoria (
    id_categoria INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);
GO

-- Editorial 
CREATE TABLE editorial (
    id_editorial INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    pais VARCHAR(100),
    email_contacto VARCHAR(255)
);
GO

-- Autor 
CREATE TABLE autor (
    id_autor INT IDENTITY(1,1) PRIMARY KEY,
    nombres VARCHAR(101) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(100)
);
GO

-- Libros 
CREATE TABLE libros (
    id_libro INT IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    anoedicion INT,
    codigoeditorial INT REFERENCES editorial(id_editorial),
    id_categoria INT REFERENCES categoria(id_categoria),
    sinopsis TEXT,
    portada VARCHAR(500)
);
GO

-- Autor_Libro 
CREATE TABLE autor_libro (
    id_autor INT REFERENCES autor(id_autor) ON DELETE CASCADE,
    id_libro INT REFERENCES libros(id_libro) ON DELETE CASCADE,
    PRIMARY KEY (id_autor, id_libro)
);
GO

-- Ejemplar 
CREATE TABLE ejemplar (
    id_ejemplar INT IDENTITY(1,1) PRIMARY KEY,
    id_libro INT REFERENCES libros(id_libro) ON DELETE CASCADE,
    codigo_barras VARCHAR(50) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'Prestado', 'Reparacion', 'Perdido')),
    nota_estado TEXT
);
GO

-- Usuario 
CREATE TABLE usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    carnet VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    tipo_usuario VARCHAR(20) DEFAULT 'Estudiante' CHECK (tipo_usuario IN ('Estudiante', 'Profesor', 'Administrativo')),
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Suspendido', 'Inactivo')),
    password_hash VARCHAR(255),
    direccion TEXT,
    fecha_registro DATETIME DEFAULT GETDATE()
);
GO

-- Prestamos 
CREATE TABLE prestamos (
    id_prestamo INT IDENTITY(1,1) PRIMARY KEY,
    id_ejemplar INT REFERENCES ejemplar(id_ejemplar),
    id_usuario INT REFERENCES usuario(id_usuario),
    fecha_prestamo DATETIME DEFAULT GETDATE(),
    fecha_devolucion_esperada DATE NOT NULL,
    fecha_devuelto DATETIME,
    estado_prestamo VARCHAR(20) DEFAULT 'Activo' CHECK (estado_prestamo IN ('Activo', 'Finalizado', 'Vencido'))
);
GO

-- Reservas 
CREATE TABLE reservas (
    id_reserva INT IDENTITY(1,1) PRIMARY KEY,
    id_libro INT REFERENCES libros(id_libro),
    id_usuario INT REFERENCES usuario(id_usuario),
    fecha_solicitud DATETIME DEFAULT GETDATE(),
    estado VARCHAR(30) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Listo para recoger', 'Completada', 'Cancelada'))
);
GO

-- Multas 
CREATE TABLE multas (
    id_multa INT IDENTITY(1,1) PRIMARY KEY,
    id_prestamo INT REFERENCES prestamos(id_prestamo),
    monto DECIMAL(10, 2) NOT NULL,
    pagado BIT DEFAULT 0,
    fecha_pago DATETIME
);
GO

CREATE VIEW vw_libros_disponibles AS
SELECT 
    l.id_libro,
    l.titulo,
    l.isbn,
    l.anoedicion,
    l.sinopsis,
    l.portada,
    c.nombre AS categoria,
    ed.nombre AS editorial,
    STRING_AGG(CONCAT(a.nombres, ' ', a.apellidos), ', ') AS autores,
    COUNT(DISTINCT CASE WHEN e.estado = 'Disponible' THEN e.id_ejemplar END) AS ejemplares_disponibles
FROM libros l
LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
LEFT JOIN editorial ed ON l.codigoeditorial = ed.id_editorial
LEFT JOIN autor_libro al ON l.id_libro = al.id_libro
LEFT JOIN autor a ON al.id_autor = a.id_autor
LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
GROUP BY l.id_libro, l.titulo, l.isbn, l.anoedicion, l.sinopsis, l.portada, c.nombre, ed.nombre
HAVING COUNT(DISTINCT CASE WHEN e.estado = 'Disponible' THEN e.id_ejemplar END) > 0;
GO

CREATE VIEW vw_prestamos_activos AS
SELECT 
    p.id_prestamo,
    p.fecha_prestamo,
    p.fecha_devolucion_esperada,
    p.estado_prestamo,
    e.codigo_barras,
    l.titulo AS libro,
    u.nombre + ' ' + u.apellido AS usuario,
    u.carnet,
    u.email
FROM prestamos p
JOIN ejemplar e ON p.id_ejemplar = e.id_ejemplar
JOIN libros l ON e.id_libro = l.id_libro
JOIN usuario u ON p.id_usuario = u.id_usuario
WHERE p.estado_prestamo = 'Activo';
GO

CREATE VIEW vw_prestamos_vencidos AS
SELECT 
    p.id_prestamo,
    p.fecha_prestamo,
    p.fecha_devolucion_esperada,
    DATEDIFF(DAY, p.fecha_devolucion_esperada, CAST(GETDATE() AS DATE)) AS dias_vencido,
    e.codigo_barras,
    l.titulo AS libro,
    u.nombre + ' ' + u.apellido AS usuario,
    u.carnet,
    u.email,
    u.telefono
FROM prestamos p
JOIN ejemplar e ON p.id_ejemplar = e.id_ejemplar
JOIN libros l ON e.id_libro = l.id_libro
JOIN usuario u ON p.id_usuario = u.id_usuario
WHERE p.estado_prestamo IN ('Activo', 'Vencido') 
  AND p.fecha_devolucion_esperada < CAST(GETDATE() AS DATE)
  AND p.fecha_devuelto IS NULL;
GO

CREATE VIEW vw_usuarios_con_multas AS
SELECT 
    u.id_usuario,
    u.carnet,
    u.nombre + ' ' + u.apellido AS usuario,
    u.email,
    u.telefono,
    COUNT(m.id_multa) AS cantidad_multas,
    SUM(m.monto) AS total_adeudado
FROM usuario u
JOIN prestamos p ON u.id_usuario = p.id_usuario
JOIN multas m ON p.id_prestamo = m.id_prestamo
WHERE m.pagado = 0
GROUP BY u.id_usuario, u.carnet, u.nombre, u.apellido, u.email, u.telefono;
GO

CREATE VIEW vw_estadisticas_prestamos AS
SELECT 
    COUNT(CASE WHEN estado_prestamo = 'Activo' THEN 1 END) AS prestamos_activos,
    COUNT(CASE WHEN estado_prestamo = 'Finalizado' THEN 1 END) AS prestamos_finalizados,
    COUNT(CASE WHEN estado_prestamo = 'Vencido' THEN 1 END) AS prestamos_vencidos,
    COUNT(CASE WHEN fecha_prestamo >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0) THEN 1 END) AS prestamos_este_mes,
    COUNT(CASE WHEN fecha_prestamo >= DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0) THEN 1 END) AS prestamos_esta_semana,
    COUNT(*) AS total_prestamos
FROM prestamos;
GO

CREATE VIEW vw_catalogo_completo AS
SELECT 
    l.id_libro,
    l.titulo,
    l.isbn,
    l.anoedicion,
    l.sinopsis,
    l.portada,
    c.nombre AS categoria,
    c.descripcion AS categoria_descripcion,
    ed.nombre AS editorial,
    ed.pais AS editorial_pais,
    STRING_AGG(CONCAT(a.nombres, ' ', a.apellidos), ', ') AS autores,
    COUNT(DISTINCT e.id_ejemplar) AS total_ejemplares,
    COUNT(DISTINCT CASE WHEN e.estado = 'Disponible' THEN e.id_ejemplar END) AS ejemplares_disponibles
FROM libros l
LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
LEFT JOIN editorial ed ON l.codigoeditorial = ed.id_editorial
LEFT JOIN autor_libro al ON l.id_libro = al.id_libro
LEFT JOIN autor a ON al.id_autor = a.id_autor
LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
GROUP BY l.id_libro, l.titulo, l.isbn, l.anoedicion, l.sinopsis, l.portada, 
         c.nombre, c.descripcion, ed.nombre, ed.pais;
GO

CREATE PROCEDURE sp_registrar_prestamo
    @p_id_usuario INT,
    @p_id_ejemplar INT,
    @p_dias_prestamo INT = 14
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @v_id_prestamo INT;
    DECLARE @v_estado_ejemplar VARCHAR(20);
    DECLARE @v_estado_usuario VARCHAR(20);
    
    SELECT @v_estado_ejemplar = estado FROM ejemplar WHERE id_ejemplar = @p_id_ejemplar;
    
    IF @v_estado_ejemplar IS NULL
    BEGIN
        RAISERROR('El ejemplar no existe', 16, 1);
        RETURN;
    END
    
    IF @v_estado_ejemplar != 'Disponible'
    BEGIN
        RAISERROR('El ejemplar no está disponible', 16, 1);
        RETURN;
    END
    
    SELECT @v_estado_usuario = estado FROM usuario WHERE id_usuario = @p_id_usuario;
    
    IF @v_estado_usuario IS NULL
    BEGIN
        RAISERROR('El usuario no existe', 16, 1);
        RETURN;
    END
    
    IF @v_estado_usuario != 'Activo'
    BEGIN
        RAISERROR('El usuario no está activo', 16, 1);
        RETURN;
    END
    
    INSERT INTO prestamos (id_ejemplar, id_usuario, fecha_prestamo, fecha_devolucion_esperada, estado_prestamo)
    VALUES (@p_id_ejemplar, @p_id_usuario, GETDATE(), DATEADD(DAY, @p_dias_prestamo, CAST(GETDATE() AS DATE)), 'Activo');
    
    SET @v_id_prestamo = SCOPE_IDENTITY();
    
    UPDATE ejemplar SET estado = 'Prestado' WHERE id_ejemplar = @p_id_ejemplar;
    
    SELECT id_prestamo, id_ejemplar, id_usuario, fecha_prestamo, 
           fecha_devolucion_esperada, estado_prestamo, 'Préstamo registrado exitosamente' AS mensaje
    FROM prestamos WHERE id_prestamo = @v_id_prestamo;
END
GO

CREATE PROCEDURE sp_devolver_libro
    @p_id_prestamo INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @v_id_ejemplar INT;
    DECLARE @v_fecha_esperada DATE;
    DECLARE @v_dias_retraso INT;
    DECLARE @v_monto_multa DECIMAL(10,2);
    
    SELECT @v_id_ejemplar = id_ejemplar, @v_fecha_esperada = fecha_devolucion_esperada
    FROM prestamos WHERE id_prestamo = @p_id_prestamo AND fecha_devuelto IS NULL;
    
    IF @v_id_ejemplar IS NULL
    BEGIN
        RAISERROR('Préstamo no encontrado o ya devuelto', 16, 1);
        RETURN;
    END
    
    SET @v_dias_retraso = CASE WHEN DATEDIFF(DAY, @v_fecha_esperada, CAST(GETDATE() AS DATE)) > 0 
                               THEN DATEDIFF(DAY, @v_fecha_esperada, CAST(GETDATE() AS DATE)) 
                               ELSE 0 END;
    SET @v_monto_multa = 0;
    
    UPDATE prestamos SET 
        fecha_devuelto = GETDATE(),
        estado_prestamo = 'Finalizado'
    WHERE id_prestamo = @p_id_prestamo;
    
    UPDATE ejemplar SET estado = 'Disponible' WHERE id_ejemplar = @v_id_ejemplar;
    
    IF @v_dias_retraso > 0
    BEGIN
        SET @v_monto_multa = @v_dias_retraso * 1.50;
        INSERT INTO multas (id_prestamo, monto, pagado) VALUES (@p_id_prestamo, @v_monto_multa, 0);
    END
    
    SELECT id_prestamo, fecha_devuelto, estado_prestamo, @v_dias_retraso AS dias_retraso, 
           @v_monto_multa AS multa_generada,
           CASE WHEN @v_dias_retraso > 0 
                THEN 'Libro devuelto con ' + CAST(@v_dias_retraso AS VARCHAR) + ' días de retraso. Multa: $' + CAST(@v_monto_multa AS VARCHAR)
                ELSE 'Libro devuelto exitosamente'
           END AS mensaje
    FROM prestamos WHERE id_prestamo = @p_id_prestamo;
END
GO

CREATE PROCEDURE sp_renovar_prestamo
    @p_id_prestamo INT,
    @p_dias_adicionales INT = 7
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @v_fecha_anterior DATE;
    DECLARE @v_estado VARCHAR(20);
    
    SELECT @v_fecha_anterior = fecha_devolucion_esperada, @v_estado = estado_prestamo
    FROM prestamos WHERE id_prestamo = @p_id_prestamo;
    
    IF @v_fecha_anterior IS NULL
    BEGIN
        RAISERROR('Préstamo no encontrado', 16, 1);
        RETURN;
    END
    
    IF @v_estado != 'Activo'
    BEGIN
        RAISERROR('Solo se pueden renovar préstamos activos', 16, 1);
        RETURN;
    END
    
    UPDATE prestamos 
    SET fecha_devolucion_esperada = DATEADD(DAY, @p_dias_adicionales, fecha_devolucion_esperada)
    WHERE id_prestamo = @p_id_prestamo;
    
    SELECT id_prestamo, @v_fecha_anterior AS fecha_devolucion_anterior, 
           fecha_devolucion_esperada AS fecha_devolucion_nueva,
           'Préstamo renovado por ' + CAST(@p_dias_adicionales AS VARCHAR) + ' días adicionales' AS mensaje
    FROM prestamos WHERE id_prestamo = @p_id_prestamo;
END
GO

CREATE PROCEDURE sp_calcular_multa
    @p_id_prestamo INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @v_fecha_esperada DATE;
    DECLARE @v_fecha_devuelto DATETIME;
    DECLARE @v_dias INT;
    
    SELECT @v_fecha_esperada = fecha_devolucion_esperada, @v_fecha_devuelto = fecha_devuelto
    FROM prestamos WHERE id_prestamo = @p_id_prestamo;
    
    IF @v_fecha_esperada IS NULL
    BEGIN
        RAISERROR('Préstamo no encontrado', 16, 1);
        RETURN;
    END
    
    SET @v_dias = CASE WHEN DATEDIFF(DAY, @v_fecha_esperada, COALESCE(CAST(@v_fecha_devuelto AS DATE), CAST(GETDATE() AS DATE))) > 0
                       THEN DATEDIFF(DAY, @v_fecha_esperada, COALESCE(CAST(@v_fecha_devuelto AS DATE), CAST(GETDATE() AS DATE)))
                       ELSE 0 END;
    
    SELECT @p_id_prestamo AS id_prestamo, 
           @v_dias AS dias_retraso, 
           (@v_dias * 1.50) AS monto_calculado,
           CASE WHEN EXISTS(SELECT 1 FROM multas WHERE id_prestamo = @p_id_prestamo) THEN 1 ELSE 0 END AS multa_existente,
           COALESCE((SELECT TOP 1 pagado FROM multas WHERE id_prestamo = @p_id_prestamo), 0) AS multa_pagada;
END
GO

CREATE PROCEDURE sp_buscar_libros_disponibles
    @p_termino VARCHAR(255) = ''
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        l.id_libro,
        l.titulo,
        l.isbn,
        c.nombre AS categoria,
        ed.nombre AS editorial,
        STRING_AGG(CONCAT(a.nombres, ' ', a.apellidos), ', ') AS autores,
        COUNT(DISTINCT CASE WHEN e.estado = 'Disponible' THEN e.id_ejemplar END) AS ejemplares_disponibles
    FROM libros l
    LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
    LEFT JOIN editorial ed ON l.codigoeditorial = ed.id_editorial
    LEFT JOIN autor_libro al ON l.id_libro = al.id_libro
    LEFT JOIN autor a ON al.id_autor = a.id_autor
    LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
    WHERE @p_termino = '' 
       OR l.titulo LIKE '%' + @p_termino + '%'
       OR l.isbn LIKE '%' + @p_termino + '%'
       OR a.nombres LIKE '%' + @p_termino + '%'
       OR a.apellidos LIKE '%' + @p_termino + '%'
       OR c.nombre LIKE '%' + @p_termino + '%'
    GROUP BY l.id_libro, l.titulo, l.isbn, c.nombre, ed.nombre
    HAVING COUNT(DISTINCT CASE WHEN e.estado = 'Disponible' THEN e.id_ejemplar END) > 0;
END
GO

CREATE PROCEDURE sp_obtener_historial_usuario
    @p_id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.id_prestamo,
        l.titulo,
        e.codigo_barras,
        p.fecha_prestamo,
        p.fecha_devolucion_esperada,
        p.fecha_devuelto,
        p.estado_prestamo,
        COALESCE(m.monto, 0) AS multa,
        COALESCE(m.pagado, 1) AS multa_pagada
    FROM prestamos p
    JOIN ejemplar e ON p.id_ejemplar = e.id_ejemplar
    JOIN libros l ON e.id_libro = l.id_libro
    LEFT JOIN multas m ON p.id_prestamo = m.id_prestamo
    WHERE p.id_usuario = @p_id_usuario
    ORDER BY p.fecha_prestamo DESC;
END
GO

CREATE TRIGGER trg_validar_prestamo
ON prestamos
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @v_estado_ejemplar VARCHAR(20);
    DECLARE @v_estado_usuario VARCHAR(20);
    DECLARE @v_id_ejemplar INT;
    DECLARE @v_id_usuario INT;
    
    SELECT @v_id_ejemplar = id_ejemplar, @v_id_usuario = id_usuario FROM inserted;
    
    SELECT @v_estado_ejemplar = estado FROM ejemplar WHERE id_ejemplar = @v_id_ejemplar;
    
    IF @v_estado_ejemplar != 'Disponible'
    BEGIN
        RAISERROR('El ejemplar no está disponible para préstamo', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
    
    SELECT @v_estado_usuario = estado FROM usuario WHERE id_usuario = @v_id_usuario;
    
    IF @v_estado_usuario != 'Activo'
    BEGIN
        RAISERROR('El usuario no está activo y no puede realizar préstamos', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
    
    INSERT INTO prestamos (id_ejemplar, id_usuario, fecha_prestamo, fecha_devolucion_esperada, estado_prestamo)
    SELECT id_ejemplar, id_usuario, fecha_prestamo, fecha_devolucion_esperada, estado_prestamo FROM inserted;
    
    UPDATE ejemplar SET estado = 'Prestado' WHERE id_ejemplar = @v_id_ejemplar;
END
GO

CREATE TRIGGER trg_devolucion_libro
ON prestamos
AFTER UPDATE
AS
BEGIN
    DECLARE @v_id_ejemplar INT;
    DECLARE @v_id_prestamo INT;
    DECLARE @v_fecha_devuelto DATETIME;
    DECLARE @v_fecha_esperada DATE;
    DECLARE @v_dias_retraso INT;
    DECLARE @v_monto DECIMAL(10,2);
    
    SELECT @v_id_prestamo = i.id_prestamo, 
           @v_id_ejemplar = i.id_ejemplar,
           @v_fecha_devuelto = i.fecha_devuelto,
           @v_fecha_esperada = i.fecha_devolucion_esperada
    FROM inserted i
    JOIN deleted d ON i.id_prestamo = d.id_prestamo
    WHERE i.fecha_devuelto IS NOT NULL AND d.fecha_devuelto IS NULL;
    
    IF @v_id_ejemplar IS NOT NULL
    BEGIN
        UPDATE ejemplar SET estado = 'Disponible' WHERE id_ejemplar = @v_id_ejemplar;
        
        SET @v_dias_retraso = CASE WHEN DATEDIFF(DAY, @v_fecha_esperada, CAST(@v_fecha_devuelto AS DATE)) > 0
                                   THEN DATEDIFF(DAY, @v_fecha_esperada, CAST(@v_fecha_devuelto AS DATE))
                                   ELSE 0 END;
        
        IF @v_dias_retraso > 0
        BEGIN
            SET @v_monto = @v_dias_retraso * 1.50;
            INSERT INTO multas (id_prestamo, monto, pagado) VALUES (@v_id_prestamo, @v_monto, 0);
        END
    END
END
GO	