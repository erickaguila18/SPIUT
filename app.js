// Depedencias
var express = require('express')
, http = require('http')
, path = require('path')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, methodOverride = require('method-override');


var Publicacion = require('./models/publicaciones');
//var rutas = require('./routes/index');


// Configuracion
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));


app.get('/', function(req, res) {
    res.render('index');
});

// Puerto y servidor
var server = http.createServer(app);
server.listen(8080);


//Conexion
mongoose.connect('mongodb://localhost/publicaciones',function(err){
	if(!err){
		console.log("Conectado a mongo");
	}else{
		throw err;
	}
});


// CREATE
app.get('/publicadas',function(req , res){
    Publicacion.find({},null,{sort:{fecha: -1}},function(err,pub){
        res.render('create',{
            put:false,
            action:'/create',
            pub:pub
        });
    });
});



app.post('/create',function(req , res){
		var publicacion =  new Publicacion({
			contenido:req.body.publicacion,
            usuario:req.body.usuario,
            area:req.body.area
		});
		publicacion.save(function(err){
			if(err){
				res.redirect('/create');
			}else{
				res.redirect('/publicadas');
			}			
		});
});

// READ
app.get('/publicaciones',function(req , res){
	Publicacion.find({},function(err,pub){
		res.render('index',{
			pub:pub
		});
	});
});



// UPDATE
app.get('/publicaciones/:id', function(req, res){
    Publicacion.findById(req.params.id, function(err, pub){
        if(!err){
            res.render('edit', {
                put: true,
                action: '/update/' + req.params.id,
                pub: pub
            });
        }
    });
});

app.put('/update/:id', function(req, res){
    Publicacion.findById(req.params.id, function(err, documento){
        if(!err){
            var publicacion = documento;
            publicacion.contenido = req.body.texto;
            publicacion.usuario = req.body.texto;
            publicacion.area = req.body.texto;
            publicacion.save(function(err, documento){
                if(!err){
                    res.redirect('/publicadas');
                }
            });
        }
    });
});
// DELETE
app.delete('/publicaciones/:id', function(req, res){
    Publicacion.remove({_id: req.params.id}, function(error){
        if(!error){
            res.redirect('/publicaciones');
        }
    });
});


