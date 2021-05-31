const VeiculoController = require('./VeiculoController');

module.exports = (app) => {
   app.post('/veiculo', VeiculoController.post);
   app.put('/veiculo/:id', VeiculoController.put);
   app.delete('/veiculo/:id', VeiculoController.delete);
   app.get('/veiculo', VeiculoController.get);
   app.get('/veiculo/:id', VeiculoController.getById);
}
