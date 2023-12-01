--*********************************************************************************************************************************************************************************************************************
--ALGUNAS CONSULTAS PARA LOS DE BACK Y FRONT
-- Y LAS OPERACIONES DE RANK, DENSE_RANK, ROLLUP Y CUBE

--Insert para tabla fact
INSERT INTO fact_transferencia (transaccion_ID, nombreDeServicio, fechaDeTransaccion, tipoDeMovimiento, monto, nombre, apellido, nomSucursal, codigoPostal, nombreEstado, nombreMunicipio, cuenta_ID)
SELECT
    t.transaccion_ID,
    cs.nombreDeServicio,
    t.fechaDeTransaccion,
    t.tipoDeMovimiento,
    t.monto,
    p.nombre,
    p.apellido,
    s.nomSucursal,
    ce.codigoPostal,
    ce.nombreEstado,
    ce.nombreMunicipio,
    t.cuenta_ID
FROM
    transaccion t
JOIN catalogo_servicio cs ON t.cuenta_ID = cs.cuenta_ID
JOIN cuenta c ON t.cuenta_ID = c.cuenta_ID
JOIN cliente cl ON c.cliente_ID = cl.cliente_ID
JOIN persona p ON cl.RFC = p.RFC
JOIN sucursal s ON cl.sucursal_ID = s.sucursal_ID
JOIN direccion d ON s.direccion_ID = d.direccion_ID
JOIN catalogoEstado ce ON d.codigoPostal = ce.codigoPostal;


--RANK para mostrar las transferencias por ESTADO
WITH TransferenciasPorEstado AS (
    SELECT
        ce.nombreEstado AS Estado,
        EXTRACT(YEAR FROM t.fechaDeTransaccion) AS Año,
        COUNT(*) AS NumeroDeTransferencias
    FROM
        fact_transferencia ft
    JOIN
        catalogoEstado ce ON ft.codigoPostal = ce.codigoPostal
    JOIN
        transaccion t ON ft.transaccion_ID = t.transaccion_ID
    WHERE
        EXTRACT(YEAR FROM t.fechaDeTransaccion) = EXTRACT(YEAR FROM CURRENT_DATE)  -- Filtrar por el año actual
    GROUP BY
        ce.nombreEstado, Año
)
SELECT
    Estado,
    NumeroDeTransferencias,
    RANK() OVER (ORDER BY NumeroDeTransferencias DESC) AS Ranking
FROM
    TransferenciasPorEstado
ORDER BY
    NumeroDeTransferencias DESC;


--DENSE_RANK para mostrar las transferencias por ESTADO
WITH TransferenciasPorEstado AS (
    SELECT
        ce.nombreEstado AS Estado,
        EXTRACT(YEAR FROM t.fechaDeTransaccion) AS Año,
        COUNT(*) AS NumeroDeTransferencias
    FROM
        fact_transferencia ft
    JOIN
        catalogoEstado ce ON ft.codigoPostal = ce.codigoPostal
    JOIN
        transaccion t ON ft.transaccion_ID = t.transaccion_ID
    WHERE
        EXTRACT(YEAR FROM t.fechaDeTransaccion) = EXTRACT(YEAR FROM CURRENT_DATE)  -- Filtrar por el año actual
    GROUP BY
        ce.nombreEstado, Año
)
SELECT
    Estado,
    NumeroDeTransferencias,
    DENSE_RANK() OVER (ORDER BY NumeroDeTransferencias DESC) AS RankingDense
FROM
    TransferenciasPorEstado
ORDER BY
    NumeroDeTransferencias DESC;


--ROLLUP para mostrar totales de transferencias por sucursal
SELECT
    CASE
        WHEN s.nomSucursal IS NULL THEN 'Total General'
        ELSE s.nomSucursal
    END AS Sucursal,
    COUNT(*) AS NumeroDeTransferencias
FROM fact_transferencia ft
LEFT JOIN sucursal s ON ft.nomSucursal = s.nomSucursal
GROUP BY ROLLUP (s.nomSucursal);


--CUBE para generar totales de transferencias por mes por sucursal
SELECT
    s.nomSucursal AS Sucursal,
    TO_CHAR(t.fechaDeTransaccion, 'YYYY-MM') AS Mes,
    COUNT(*) AS NumeroDeTransferencias
FROM fact_transferencia ft
JOIN sucursal s ON ft.nomSucursal = s.nomSucursal
JOIN transaccion t ON ft.transaccion_ID = t.transaccion_ID
GROUP BY CUBE (s.nomSucursal, TO_CHAR(t.fechaDeTransaccion, 'YYYY-MM'))
ORDER BY Sucursal, Mes;

--*********************************************************************************+
--MAS CONSULTAS

--Consultar el Usuario**
SELECT usuario
FROM cliente
WHERE cliente_ID = 'ID_del_Cliente';

--Consultar la Contraseña
SELECT contraseña
FROM cliente
WHERE usuario = 'nombre_de_usuario';

--Datos de la Tarjeta
SELECT
    noTarjeta AS numero_de_tarjeta,
    saldo,
    cuenta_ID AS id_cuenta
FROM
    catalogo_servicio;

--Consultar monto de la cuenta**
SELECT saldo
FROM catalogo_servicio
WHERE cuenta_ID = 'id de la cuenta';

--Datos para transferencias del Cliente (grafica de los de front)
SELECT
    t.transaccion_ID AS id_transaccion,
    t.fechaDeTransaccion AS fecha_de_transaccion,
    t.tipoDeMovimiento,
    t.monto,
    t.concepto,
    t.cuenta_ID AS id_cuenta,
    c.cliente_ID AS id_cliente
FROM
    transaccion t
JOIN
    cuenta c ON t.cuenta_ID = c.cuenta_ID;

--Consultar nombre**
SELECT nombre
FROM cliente
WHERE usuario = 'usuario';

--Consultar apellido**
SELECT apellido
FROM cliente
WHERE usuario = 'usuario';

--Consultar los movimientos de un cliente, quien es?, su cuenta y la fecha
SELECT
    c.cuenta_ID AS id_cuenta,
    c.cliente_ID AS id_cliente,
    p.nombre,
    p.apellido,
    t.transaccion_ID AS id_transaccion,
    t.monto,
    t.fechaDeTransaccion AS fecha
FROM
    cuenta c
JOIN
    cliente cl ON c.cliente_ID = cl.cliente_ID
JOIN
    persona p ON cl.RFC = p.RFC
LEFT JOIN
    transaccion t ON c.cuenta_ID = t.cuenta_ID
ORDER BY
    c.cuenta_ID, t.fechaDeTransaccion;

--Consultar la cantidad de Gastos e Ingresos por cada mes de un usuario en base a sus transacciones
CREATE OR REPLACE FUNCTION obtenerEstadisticas(cuentaID integer)
RETURNS TABLE (mes integer, cantidad_transacciones bigint, cantidad_gastos numeric, cantidad_ingresos numeric)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mes.m AS mes,
    COALESCE(COUNT(*), 0) AS cantidad_transacciones,
    COALESCE(SUM(CASE WHEN tipodemovimiento IN ('Pago de Seguro', 'Pago de Hipoteca', 'Transferencia', 'Retiro', 'Ahorro') THEN 1 ELSE 0 END)::numeric, 0) AS cantidad_gastos,
    COALESCE(SUM(CASE WHEN tipodemovimiento IN ('Deposito', 'Prestamo', 'Hipoteca') THEN 1 ELSE 0 END)::numeric, 0) AS cantidad_ingresos
  FROM
    generate_series(1, 12) AS mes(m)  -- Asignar un alias a la columna generada
  LEFT JOIN
    transaccion AS t ON EXTRACT(MONTH FROM t.fechadetransaccion) = mes.m
                      AND t.cuenta_id = cuentaID
  GROUP BY
    mes.m
  ORDER BY
    mes.m;
END;
$$ LANGUAGE plpgsql;




