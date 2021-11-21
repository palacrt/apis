const  { conexion }  = require('./database.js');

function seleccionar(esquema,tabla,callback) {

  sql = 
   `select
      table_name tabla,
      ordinal_position orden,
      column_name campo,
      data_type tipo_dato,
      column_key ,
      is_nullable
    from INFORMATION_SCHEMA.COLUMNS
    where table_schema = ?
    and table_name = ?
    order by 1,2;`;

    conexion.query(sql,[esquema,tabla],(err, rows) => { 
      
      if (err) {
        // envia el objeto de error
        console.log(err);
        callback(err,null);
        return;
      } 

      // devuelve la informacion
      const datos = rows.map(x => Object.assign({},x));
      callback(null,datos);

    });

}