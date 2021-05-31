async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({host:'heidisql', user: 'root', password:'123456'});
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
 }



exports.post = async(req, res, next) => {
    const conn = await connect();
   const sql = 'INSERT INTO veiculo(placa, modelo, marca, ano, valor) VALUES (?,?,?,?,?);';
   const values = [req.body.placa, req.body.modelo, req.body.marca, req.body.ano, req.body.valor];
   await conn.query(sql, values);
   res.status(201).send('ok!');
 
 };
  
 exports.put = async(req, res, next) => {
    let id = req.params.id;
    const conn = await connect();
    const sql = 'UPDATE veiculo SET placa=?, modelo=?, marca=?, ano=?, valor=? WHERE idveiculo = ?;';
    const values = [req.body.placa, req.body.modelo, req.body.marca, req.body.ano, req.body.valor, id];
    await conn.query(sql, values);
    res.status(201).send('ok!');
 
 };
  
 exports.delete = async (req, res, next) => {
    let id = req.params.id;
    const conn = await connect();
    const sql = 'DELETE FROM veiculo WHERE idveiculo = ?;';
    const values = [id];
    await conn.query(sql, values);
    res.status(200).send('ok');
 };
  
 exports.get = async (req, res, next) => {
    const conn = await connect();
   const [rows] = await conn.query('SELECT * FROM veiculo;');
   res.status(200).send(rows);
 };
  
 exports.getById = async (req, res, next) => {
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM veiculo WHERE idveiculo = ' + req.params.id);
    if (rows.length > 0) {
      res.status(200).send(rows[0]);
    } else {
      res.status(404).send("ID não existe");
    }
 };
 };
