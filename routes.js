var user = require('./user');
 
module.exports = {
  configure: function(app) {
    app.post('/login', function(req, res) {
      user.get(req.body, res);
    });
	
   app.post('/signup', function(req, res) {
      user.create(req.body, res);
    });

   app.post('/verify', function(req, res) {
      user.save(req.body, res);
    });

   app.get('/getphone', function(req, res){
      user.sample(req.query.auth, res);
   });
  }
    
};
