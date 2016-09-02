var connection = require('./connection');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var storage = require('node-persist');
storage.initSync();
function User() {
        this.sample = function(token,res){
           connection.acquire(function(err, con){
             console.log(token.headers);
             //token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaHl1dCIsImlhdCI6MTQ3Mjc4MjE1M30.FeWJj0gneQ-7LGB6zT9UNB9Pp2zx4ES63rSTnTZnI2M";
             var decoded = jwt.verify(token, 'inclass');
             con.query('select phonenumber from signup where username=?',[decoded.username], function(err, result){
                  res.send(result[0]);
            });
             con.release();
          });
        }

	this.get = function(log,res) {
    connection.acquire(function(err, con) {
       /*var message="Ravi is Bahubali";
         log.password = require('crypto-js').AES.encrypt(message,log.password);*/

      con.query('select * from login where username=? and password=?',[log.username,log.password], function(err, result) {
      if(result.length!=0){
         /*require('crypto').randomBytes(20, function(err, buffer) {
         var token = buffer.toString('hex');*/
           var token = jwt.sign({'username':log.username}, 'inclass');
          res.send({'status':'Success','username':result[0].username,'auth':token});
         con.query('update login set token=? where username=?',[token,log.username], function(err, result){
           console.log(err);
});
         con.release();
         
      }
      else{
         res.send({'status':'User does not exist'});
      }
      });
    });
  };
  
  this.create = function(user, res) {
    connection.acquire(function(err, con) {
	console.log(user);
           
     var rand, number;
     if(user.carrier = "AT&T"){
          number = user.phonenumber+'@txt.att.net';
     }
     else{
          number = user.phonenumber+'@tmomail.net';
     }

     var transporter = nodemailer.createTransport({
                service: 'Yahoo',
                auth: {
                        user: 'achyut.rampalli@yahoo.co.in',
                        pass: 'RAma_1234'
                }
        });

     require('crypto').randomBytes(4, function(err, buffer){
         rand = buffer.toString('hex').slice(0,4);
     
	console.log(rand);
	transporter.sendMail({
           from: 'achyut.rampalli@yahoo.co.in',
           to: number,
           subject: '',
           text: rand.toString()
        });
        res.send({'status':'OK'});
        storage.setItemSync(user.phonenumber,rand);
        storage.setItemSync(user.emailid, user);
      });
    });
  };
  

      this.save = function(user, res){
         connection.acquire(function(err, con){
          console.log(user);
          console.log(storage.getItemSync(user.phonenumber));
          /*var message="Ravi is Bahubali";
	  user.password = require('crypto-js').AES.encrypt(message,user.password);*/
          
          if(user.vcode == storage.getItemSync(user.phonenumber)){
      con.query('insert into signup set ?', storage.getItemSync(user.emailid), function(err, result) {
          log = {username:user.username,password:user.password};
          con.query('insert into login set ?',log);
          con.release();
          if (err) {
            res.send({status: 1, message: 'User creation failed'});
          } else {
            res.send({status: 0, message: 'User created successfully'});
          }
        });
       }
        else{
            res.send({status:2, message: 'Security code is not correct'});
        }
      });
     };
 }
module.exports = new User();
