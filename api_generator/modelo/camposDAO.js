const  { conexion }  = require('./database.js');

function seleccionar(esquema,tabla) {

  sql = 
   `select 
      c.table_name tabla,
      c.ordinal_position orden,
      c.column_name campo,
      c.data_type tipo_dato,
      c.column_key codigo_llave,
      c.is_nullable es_nulo,
      kcu.CONSTRAINT_NAME nombre_constraint,
      kcu.referenced_table_schema esquema_relacionado,
      kcu.referenced_table_name tabla_relacionada,
      kcu.referenced_column_name campo_relacionado,
      rc.column_name campo_relacionado_display
    from INFORMATION_SCHEMA.COLUMNS c
    left join INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
    on kcu.table_schema = c.table_schema
    and kcu.table_name = c.table_name
    and kcu.column_name = c.column_name
    left join INFORMATION_SCHEMA.COLUMNS rc
    on kcu.referenced_table_schema = rc.table_schema
    and kcu.referenced_table_name = rc.table_name
    and rc.ordinal_position = 2
    where c.table_schema = '${esquema}'
    and c.table_name = '${tabla}'
    order by 1,2`;

    rows = conexion.query(sql,[esquema,tabla]);
    
    // devuelve la informacion
    const datos = rows.map(x => Object.assign({},x));
    return datos;


}

module.exports.seleccionar = seleccionar;