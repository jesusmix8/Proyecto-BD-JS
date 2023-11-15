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
--Hola