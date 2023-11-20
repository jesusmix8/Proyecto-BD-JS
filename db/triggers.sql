CREATE OR REPLACE FUNCTION crear_cuenta_despues_insertar_cliente()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar una nueva fila en la tabla cuenta
    INSERT INTO cuenta (cliente_ID) VALUES (NEW.cliente_ID);

    -- Puedes establecer un saldo predeterminado de 0 pesos
    UPDATE cuenta SET saldo = 0 WHERE cliente_ID = NEW.cliente_ID;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
CREATE TRIGGER trigger_crear_cuenta
AFTER INSERT
ON cliente
FOR EACH ROW
EXECUTE FUNCTION crear_cuenta_despues_insertar_cliente();

-- Trigger para actualizar el saldo 
CREATE OR REPLACE FUNCTION actualizar_saldo()
RETURNS TRIGGER AS $$
DECLARE 
    id_cuentaDestino INT;
BEGIN
    IF NEW.tipoDeMovimiento = 'Transferencia' THEN
        -- Buscar el cuenta_id del CuentaDestino
        SELECT cuenta_id INTO id_cuentaDestino
        FROM catalogo_servicio 
        WHERE notarjeta = NEW.cuentaDestino::numeric; -- Convertir a tipo numeric
        -- Restar el saldo cuentaOrigen y sumar cuentaDestino
        UPDATE cuenta SET saldo = saldo - NEW.monto WHERE cuenta_ID = NEW.cuenta_ID;
        UPDATE cuenta SET saldo = saldo + NEW.monto WHERE cuenta_ID = id_cuentaDestino;
    ELSIF NEW.tipoDeMovimiento = 'Retiro' THEN
        UPDATE cuenta SET saldo = saldo - NEW.monto WHERE cuenta_ID = NEW.cuenta_ID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Crear el trigger
CREATE TRIGGER trigger_actualizar_saldo
AFTER INSERT ON transaccion
FOR EACH ROW
EXECUTE FUNCTION actualizar_saldo();