var Dado = require('./dado.js');
var Pais = require('./pais.js');
var Jugador = require('./jugador.js');
var ObjetivoSecreto = require('./objetivo.js');
var Juego = require('./juego.js');
var conf = require('./config.js');
var pg = require('pg');

var server = require('http').Server();
var io = require('socket.io')(server);
var colores = ['#e65100','#689f38'];
var myJuego = new Juego();

var PUNTOSBASE = 50;

server.listen(8888, function() {
    console.log('Servidor corriendo en http://localhost:8888');
});

function saveWin(ganador,puntos,callback){
	pg.connect(conf.conectionString(), function(err, client, done) {
		client.query("UPDATE batallas SET ganador =$1, puntos = $2 WHERE id = $3",
			[ganador,puntos,myJuego.batallaId],
			function(err, result) {
				callback();
			});
	});
}

function generateBatalla(j1,j2,callback){
	pg.connect(conf.conectionString(), function(err, client, done) {
		client.query("INSERT INTO batallas (player1,player2,start_date) VALUES ($1,$2,CURRENT_TIMESTAMP) RETURNING id",
			[j1,j2],
			function(err, result) {
				console.log(result);
				callback(result.rows[0]['id']);
			});
	});
}

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
	//Set jugador
	socket.on('setJugador',function(nombre){
		console.log('Jugador nuevo = '+nombre);
		socket.emit('setId',socket.id);
		//Agregamos jugadores a el juego
		if(myJuego.jugadores.length<myJuego.MAXPLAYERS){
			var jugador = new Jugador(socket.id,nombre,colores[myJuego.jugadores.length]);
			myJuego.jugadores.push(jugador);
		}
		if(myJuego.jugadores.length==myJuego.MAXPLAYERS){
			//Ya estan todos los participantes
			myJuego.jugadorActual = myJuego.getJ(1);
			io.sockets.emit('players',myJuego.jugadores);
			myJuego.repartirObjetivos();
			io.sockets.connected[myJuego.getJ(1).id].emit('objetivo',myJuego.getJ(1).objetivo);
			io.sockets.connected[myJuego.getJ(2).id].emit('objetivo',myJuego.getJ(2).objetivo);
			var paisesRepartidos = myJuego.repartirPaises();
			io.sockets.emit('ready',{player1:paisesRepartidos[0],player2:paisesRepartidos[1]});
			generateBatalla(myJuego.getJ(1).nombre,myJuego.getJ(2).nombre,function(id){
				myJuego.batallaId = id;
				console.log('id = '+myJuego.batallaId);
			});
			// socket.broadcast.emit('ready',{player1:myJuego.getJ(1),player2:myJuego.getJ(2)});
		}else if(myJuego.jugadores.length>myJuego.MAXPLAYERS){
			//Si ya hay dos jugadores desconectamos la otra conexión
			socket.disconnect();
		}
	});

	//Set pais 1
	socket.on('setP1',function(data){
		if(data.id == myJuego.jugadorActual.id){
			myJuego.paisSeleccionado1 = myJuego.paises[data.pais];
			io.sockets.emit('setP1Response',{pais:data.pais});
			console.log('P1 = '+myJuego.paisSeleccionado1.nombre);
		}
	});

	//Set pais 2
	socket.on('setP2',function(data){
		if(data.id == myJuego.jugadorActual.id){
			myJuego.paisSeleccionado2 = myJuego.paises[data.pais];
			io.sockets.emit('setP2Response',{pais:data.pais});
			console.log('P2 = '+myJuego.paisSeleccionado2.nombre);
		}
	});

	socket.on('atacar',function(data){
		if(data.id == myJuego.jugadorActual.id &&
				myJuego.jugadorActual.estado == 'Atacando'){
			var result = myJuego.jugadorActual.atacar(myJuego)
			if(result!=null){
				if(myJuego.jugadorActual.objetivo.checkWin(myJuego.jugadorActual)){
					saveWin(myJuego.jugadorActual.nombre,PUNTOSBASE,function(){
						io.sockets.emit('win',{
							'playerWin':myJuego.jugadorActual.id
						});
					});
				}else{
					io.sockets.emit('responseAtacar',{
						'conquistado':myJuego.conquistado,
						'ejercitos':result
					});
				}
			}else{
				console.log(result);
				console.log('Ataque no realizado');
			}
		}
	});

	socket.on('addEjercitoAfterAtack',function(data){
			myJuego.paisSeleccionado1.pasarEjercito(myJuego.paisSeleccionado2,data.cantidad);
			myJuego.conquistado = false;
			io.sockets.emit('responseAddEjercitoAfterAtack',{
				'cantidad':data.cantidad
			});
	});

	//Se agrega ejercito a pais
	socket.on('addEjercitoP1',function(data){
		if(data.id == myJuego.jugadorActual.id){
			if(myJuego.paisSeleccionado1.addEjercito(data.cantidad)){
				io.sockets.emit('addEjercitoP1Response',{cantidad:data.cantidad});
			}
		}
	});

	//Se pasan ejercitos de un pais a otro
	socket.on('enviarEjercito',function(data){
		if(data.id == myJuego.jugadorActual.id &&
			myJuego.paisSeleccionado1 &&
			myJuego.paisSeleccionado2){
			var p1 = myJuego.paisSeleccionado1;
			var p2 = myJuego.paisSeleccionado2;
			var cantidad = data.cantidad;
			myJuego.pasarEjercito(p1,p2,cantidad);
			io.sockets.emit('enviarEjercitoResponse',{
				p1:p1.ejercito,
				p2:p2.ejercito
			});
		}
	});

	//Se pasan ejercitos de un pais a otro
	socket.on('devolverEjercito',function(data){
		if(data.id == myJuego.jugadorActual.id  &&
			myJuego.paisSeleccionado1 &&
			myJuego.paisSeleccionado2){
			var p1 = myJuego.paisSeleccionado1;
			var p2 = myJuego.paisSeleccionado2;
			var cantidad = data.cantidad;
			myJuego.pasarEjercito(p2,p1,cantidad);
			io.sockets.emit('enviarEjercitoResponse',{
				p1:p1.ejercito,
				p2:p2.ejercito
			});
		}
	});

	//Se saca pais1
	socket.on('removePaisSeleccionado1',function(data){
		if(data.id == myJuego.jugadorActual.id){
			myJuego.paisSeleccionado1 = '';
			io.sockets.emit('responseRemovePaisSeleccionado1',{});
		}
	});

	//Se saca pais2
	socket.on('removePaisSeleccionado2',function(data){
		if(data.id == myJuego.jugadorActual.id){
			myJuego.paisSeleccionado2 = '';
			io.sockets.emit('responseRemovePaisSeleccionado2',{});
		}
	});

	//Se sacan ejercito a pais
	socket.on('removeEjercitoP1',function(data){
		if(data.id == myJuego.jugadorActual.id){
			if(myJuego.paisSeleccionado1.removeEjercito(data.cantidad)){
				io.sockets.emit('removeEjercitoP1Response',{cantidad:data.cantidad});
			}
		}
	});

	socket.on('next',function(data){
		if(data.id == myJuego.jugadorActual.id){
			myJuego.siguiente();
			var jugadores = {};
			myJuego.jugadores.forEach(function(jugador){
				jugadores[jugador.id] = {
					'estado':jugador.estado,
					'ejercitosDisponibles':jugador.ejercitosDisponibles
				}
			});
			io.sockets.emit('responseRemovePaisSeleccionado1',{});
			io.sockets.emit('responseRemovePaisSeleccionado2',{});
			io.sockets.emit('nextResponse',{
				'actualId':myJuego.jugadorActual.id,
				'jugadores':jugadores
			});
		}
	});

	//Cuando se desconecta
	socket.on('disconnect', function(){
		var jugadorWin = null;
		for (var i = 0; i < myJuego.jugadores.length; i++) {
			if(myJuego.jugadores[i].id != socket.id){
				jugadorWin = myJuego.jugadores[i];
			}
		}
		saveWin(jugadorWin.nombre,PUNTOSBASE,function(){
			if(jugadorWin){
				io.sockets.emit('win',{
					'playerWin':jugadorWin.id
				});
			}
		});
	    console.log('user disconnected');
	  });



	//
});
