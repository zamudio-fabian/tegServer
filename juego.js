var Pais = require('./pais.js');
var Jugador = require('./jugador.js');
var ObjetivoSecreto = require('./objetivo.js');
module.exports = function Juego(){
	this.MAXPLAYERS = 2;
	this.jugadores = [];
	this.jugadorActual = null;
	this.paisSeleccionado1 = '';
	this.paisSeleccionado2 = '';
	this.cantidad = 0;
	this.conquistado = false;
	this.cantTurnos = 1;

	//Creamos paises
	this.paises = {
	 1		:new Pais(1,'Argentina','América del Sur','teg/images/paises/argentina.svg',505,527),
	 2		:new Pais(2,'Chile','América del Sur','teg/images/paises/chile.svg',470.75,526.37),
	 3		:new Pais(3,'Brasil','América del Sur','teg/images/paises/brasil.svg',524.25,433.85),
	 4		:new Pais(4,'Uruguay','América del Sur','teg/images/paises/uruguay.svg',552.75,465),
	 5		:new Pais(5,'Perú','América del Sur','teg/images/paises/peru.svg',461.5,443.44),
	 6		:new Pais(6,'Colombia','América del Sur','teg/images/paises/colombia.svg',453,382.11),
	 7		:new Pais(7,'México','América del Norte','teg/images/paises/mexico.svg',393.975,344.78),
	 8		:new Pais(8,'Oregon','América del Norte','teg/images/paises/oregon.svg',273.225,308.45),
	 9		:new Pais(9,'New York','América del Norte','teg/images/paises/newyork.svg',376.65,270.05),
	 10		:new Pais(10,'California','América del Norte','teg/images/paises/california.svg',333.9,326.23),
	 11		:new Pais(11,'Alaska','América del Norte','teg/images/paises/alaska.svg',242.95,274.43),
	 12		:new Pais(12,'Yukón','América del Norte','teg/images/paises/yukon.svg',290.925,235.78),
	 13		:new Pais(13,'Canadá','América del Norte','teg/images/paises/canada.svg',329.225,220.195),
	 14		:new Pais(14,'Labrador','América del Norte','teg/images/paises/labrador.svg',401.725,232.025),
	 15		:new Pais(15,'Groenlandia','América del Norte','teg/images/paises/groenlandia.svg',498,210),
	 16		:new Pais(16,'Islandia','Europa','teg/images/paises/islandia.svg',596,255),
	 17		:new Pais(17,'Suecia','Europa','teg/images/paises/suecia.svg',715.375,191.715),
	 18		:new Pais(18,'Gran Bretaña','Europa','teg/images/paises/granbretana.svg',648,275),
	 19		:new Pais(19,'España','Europa','teg/images/paises/espana.svg',644,355.16),
	 20		:new Pais(20,'Rusia','Europa','teg/images/paises/rusia.svg',774,267),
	 21		:new Pais(21,'Australia','Oceanía','teg/images/paises/australia.svg',990.6,471.43),
	 22		:new Pais(22,'Japón','Asia','teg/images/paises/japon.svg',1008.275,189.94),
	 23		:new Pais(23,'China','Asia','teg/images/paises/china.svg',935,281.074),
	 24		:new Pais(24,'Sudáfrica','África','teg/images/paises/sudafrica.svg',800.625,521.73),
	 25		:new Pais(25,'Sahara','África','teg/images/paises/sahara.svg',695.15,463.06),
	 26		:new Pais(26,'Zaire','África','teg/images/paises/zaire.svg',742.9,487.261),
	 27		:new Pais(27,'Egipto','África','teg/images/paises/egipto.svg',787.025,435.648),
	 28		:new Pais(28,'Etiopía','África','teg/images/paises/etiopia.svg',779.875,457.921),
	 29		:new Pais(29,'Madagascar','África','teg/images/paises/madagascar.svg',896.525,506.968),
	 30		:new Pais(30,'Israel','Asia','teg/images/paises/israel.svg',843.275,355),
	 31		:new Pais(31,'Turquía','Asia','teg/images/paises/turquia.svg',820,312.102),
	 32		:new Pais(32,'Francia','Europa','teg/images/paises/francia.svg',695.85,323.819),
	 33		:new Pais(33,'Alemania','Europa','teg/images/paises/alemania.svg',746.9,310),
	 34		:new Pais(34,'Italia','Europa','teg/images/paises/italia.svg',755.1,373),
	 35		:new Pais(35,'Goby','Asia','teg/images/paises/goby.svg',876,292),
	 36		:new Pais(36,'Siberia','Asia','teg/images/paises/siberia.svg',872.7,177.598),
	 37		:new Pais(37,'Mongolia','Asia','teg/images/paises/mongolia.svg',864.2,227.856),
	 38		:new Pais(38,'Kamtchatka','Asia','teg/images/paises/kamtchatka.svg',940,152),
	 39		:new Pais(39,'Aral','Asia','teg/images/paises/aral.svg',822,181),
	 40		:new Pais(40,'India','Asia','teg/images/paises/india.svg',945.125,353),
	 41		:new Pais(41,'Sumatra','Oceanía','teg/images/paises/sumatra.svg',927.875,420.625),
	 42		:new Pais(42,'Borneo','Oceanía','teg/images/paises/borneo.svg',985.525,383.888),
	 43		:new Pais(43,'Java','Oceanía','teg/images/paises/java.svg',1041.95,380.76),
	}


	//Asignamos paises limitrofes
	this.paises[1].addLimitrofes([this.paises[2],this.paises[3],this.paises[4],this.paises[5]]);
	this.paises[2].addLimitrofes([this.paises[1],this.paises[21],this.paises[5]]);
	this.paises[3].addLimitrofes([this.paises[1],this.paises[6],this.paises[4],this.paises[5],this.paises[25]]);
	this.paises[4].addLimitrofes([this.paises[1],this.paises[3]]);
	this.paises[5].addLimitrofes([this.paises[2],this.paises[3],this.paises[1],this.paises[6]]);
	this.paises[6].addLimitrofes([this.paises[7],this.paises[3],this.paises[5]]);
	this.paises[7].addLimitrofes([this.paises[6],this.paises[10]]);
	this.paises[8].addLimitrofes([this.paises[10],this.paises[11],this.paises[12],this.paises[13],this.paises[9]]);
	this.paises[9].addLimitrofes([this.paises[13],this.paises[8],this.paises[10],this.paises[14],this.paises[15]]);
	this.paises[10].addLimitrofes([this.paises[7],this.paises[9],this.paises[8]]);
	this.paises[11].addLimitrofes([this.paises[38],this.paises[12],this.paises[8]]);
	this.paises[12].addLimitrofes([this.paises[11],this.paises[8],this.paises[13]]);
	this.paises[13].addLimitrofes([this.paises[12],this.paises[8],this.paises[9],this.paises[14]]);
	this.paises[14].addLimitrofes([this.paises[9],this.paises[13],this.paises[15]]);
	this.paises[15].addLimitrofes([this.paises[14],this.paises[9],this.paises[16]]);
	this.paises[16].addLimitrofes([this.paises[15],this.paises[18],this.paises[17]]);
	this.paises[17].addLimitrofes([this.paises[16],this.paises[20]]);
	this.paises[18].addLimitrofes([this.paises[16],this.paises[33],this.paises[19]]);
	this.paises[19].addLimitrofes([this.paises[18],this.paises[32],this.paises[25]]);
	this.paises[20].addLimitrofes([this.paises[33],this.paises[17],this.paises[31],this.paises[39],this.paises[37],this.paises[35]]);
	this.paises[21].addLimitrofes([this.paises[2],this.paises[43],this.paises[42],this.paises[41]]);
	this.paises[22].addLimitrofes([this.paises[38],this.paises[23]]);
	this.paises[23].addLimitrofes([this.paises[38],this.paises[22],this.paises[36],this.paises[37],this.paises[35],this.paises[40]]);
	this.paises[24].addLimitrofes([this.paises[26],this.paises[28]]);
	this.paises[25].addLimitrofes([this.paises[3],this.paises[19],this.paises[26],this.paises[28],this.paises[27]]);
	this.paises[26].addLimitrofes([this.paises[25],this.paises[24],this.paises[28],this.paises[29]]);
	this.paises[27].addLimitrofes([this.paises[25],this.paises[28],this.paises[30],this.paises[31],this.paises[33],this.paises[29]]);
	this.paises[28].addLimitrofes([this.paises[27],this.paises[25],this.paises[26],this.paises[24]]);
	this.paises[29].addLimitrofes([this.paises[27],this.paises[26]]);
	this.paises[30].addLimitrofes([this.paises[31],this.paises[27]]);
	this.paises[31].addLimitrofes([this.paises[20],this.paises[33],this.paises[30],this.paises[27],this.paises[35]]);
	this.paises[32].addLimitrofes([this.paises[19],this.paises[33],this.paises[34]]);
	this.paises[33].addLimitrofes([this.paises[32],this.paises[18],this.paises[34],this.paises[20],this.paises[31],this.paises[27]]);
	this.paises[34].addLimitrofes([this.paises[32],this.paises[33]]);
	this.paises[35].addLimitrofes([this.paises[20],this.paises[31],this.paises[23],this.paises[37],this.paises[40]]);
	this.paises[36].addLimitrofes([this.paises[39],this.paises[37],this.paises[23],this.paises[38]]);
	this.paises[37].addLimitrofes([this.paises[36],this.paises[39],this.paises[20],this.paises[35],this.paises[23]]);
	this.paises[38].addLimitrofes([this.paises[36],this.paises[23],this.paises[11],this.paises[22]]);
	this.paises[39].addLimitrofes([this.paises[20],this.paises[37],this.paises[36]]);
	this.paises[40].addLimitrofes([this.paises[23],this.paises[35],this.paises[41],this.paises[42]]);
	this.paises[41].addLimitrofes([this.paises[40],this.paises[21]]);
	this.paises[42].addLimitrofes([this.paises[40],this.paises[21]]);
	this.paises[43].addLimitrofes([this.paises[21]]);


	//Agregamos tarjetas de objetivos
	this.objetivos = [
		new ObjetivoSecreto('Ocupar África, 5 países de América del Norte y 4 países de Europa.',
		function(jugador){
			var cantEuropa = 0;
			var cantAmericaNorte = 0;
			var cantAfrica = 0;
			var paises = jugador.paises;
			for (var i = 0; i < paises.length; i++) {
				switch (paises[i].continente) {
					case 'Europa':
						cantEuropa++;
						break;
					case 'América del Norte':
						cantAmericaNorte++;
						break;
					case 'África':
						cantAfrica++;
						break;
				};
			};
				console.log('checkWin ='+(cantEuropa >= 4 && cantAfrica >= 6 &&
					cantAmericaNorte >= 4));
				if(cantEuropa >= 4 && cantAfrica >= 6 && cantAmericaNorte >= 4){
					return true;
				}else{
					return false;
				}

		}),
		new ObjetivoSecreto('Ocupar América del Norte, 2 países de Oceanía y 4 de Asia',function(jugador){
			var cantOceania = 0;
			var cantAmericaNorte = 0;
			var cantAsia = 0;
			var paises = jugador.paises;
			for (var i = 0; i < paises.length; i++) {
				switch (paises[i].continente) {
					case 'Oceanía':
						cantOceania++;
						break;
					case 'América del Norte':
						cantAmericaNorte++;
						break;
					case 'Asia':
						cantAsia++;
						break;
				};
			};
				console.log('checkWin ='+(cantAmericaNorte == 9 && cantOceania == 2 &&
					 cantAsia == 4));
				if(cantAmericaNorte >= 9 && cantOceania >= 2 && cantAsia >= 4){
					return true;
				}else{
					return false;
				}

		}),
		new ObjetivoSecreto('Ocupar América del Sur, 7 países de Europa y 2 países de Oceania.',
		function(jugador){
			var cantEuropa = 0;
			var cantAmericaSur = 0;
			var cantOceania = 0;
			var paises = jugador.paises;
			for (var i = 0; i < paises.length; i++) {
				switch (paises[i].continente) {
					case 'Europa':
						cantEuropa++;
						break;
					case 'América del Sur':
						cantAmericaSur++;
						break;
					case 'Oceania':
						cantOceania++;
						break;
				};
			};
				console.log('checkWin ='+(cantEuropa >= 7 && cantOceania >= 2 &&
					cantAmericaSur >= 6));
				if(cantEuropa >= 7 && cantOceania >= 2 && cantAmericaSur >= 6){
					return true;
				}else{
					return false;
				}

		}),
		new ObjetivoSecreto('Ocupar 2 países de Oceanía, 2 países de África, 2 países de América del Sur, 3 países de Europa, 4 de América del Norte y 3 de Asia',
		function(jugador){
			var cantEuropa = 0;
			var cantAfrica = 0;
			var cantAmericaNorte = 0;
			var cantAsia = 0;
			var cantAmericaSur = 0;
			var cantOceania = 0;
			var paises = jugador.paises;
			for (var i = 0; i < paises.length; i++) {
				switch (paises[i].continente) {
					case 'Europa':
						cantEuropa++;
						break;
					case 'América del Sur':
						cantAmericaSur++;
						break;
					case 'América del Norte':
						cantAmericaNorte++;
						break;
					case 'Asia':
						cantAsia++;
						break;
					case 'África':
						cantAfrica++;
						break;
					case 'Oceania':
						cantOceania++;
						break;
				};
			};
				console.log('checkWin ='+(cantEuropa >= 3 && cantOceania >= 2 && cantAmericaSur >= 2 &&
					cantAfrica>=2 && cantAmericaNorte>=4 && cantAsia>=3));
				if(cantEuropa >= 3 && cantOceania >= 2 && cantAmericaSur >= 2 && cantAfrica>=2 &&
					 cantAmericaNorte>=4 && cantAsia>=3){
					return true;
				}else{
					return false;
				}

		}),
		new ObjetivoSecreto('Ocupar Asia y 2 países de América del Sur.',
		function(jugador){
			var cantAsia = 0;
			var cantAmericaSur = 0;
			var paises = jugador.paises;
			for (var i = 0; i < paises.length; i++) {
				switch (paises[i].continente) {
					case 'América del Sur':
						cantAmericaSur++;
						break;
					case 'Asia':
						cantAsia++;
						break;

				};
			};
				console.log('checkWin ='+(cantAmericaSur >= 2 && cantAsia>=10));
				if(cantAmericaSur >= 2 && cantAsia>=10){
					return true;
				}else{
					return false;
				}

		}),
		new ObjetivoSecreto(' Ocupar Europa, 4 países de Asia y 2 países de América del Sur.',
		function(jugador){
			var cantEuropa = 0;
			var cantAsia = 0;
			var cantAmericaSur = 0;
			var paises = jugador.paises;
			for (var i = 0; i < paises.length; i++) {
				switch (paises[i].continente) {
					case 'América del Sur':
						cantAmericaSur++;
						break;
					case 'Asia':
						cantAsia++;
						break;
					case 'Europa':
						cantEuropa++;
						break;

				};
			};
				console.log('checkWin ='+(cantAmericaSur >= 2 && cantAsia>=4 && cantEuropa>=8));
				if(cantAmericaSur >= 2 && cantAsia>=4 && cantEuropa>=8){
					return true;
				}else{
					return false;
				}

		}),
	]

	this.repartirObjetivos = function(){
		console.log('repartimos objetivos');
		var objetivosShuffle = shuffle(this.objetivos);
		for (var i = 0; i < this.jugadores.length; i++) {
			this.jugadores[i].addObjetivo(objetivosShuffle[i]);
		}
	}



	this.getJ = function(numero){
		return this.jugadores[numero-1];
	}


	function shuffle(paisesArray) {
		var j, x, i;
	    for (i = paisesArray.length; i; i -= 1) {
	        j = Math.floor(Math.random() * i);
	        x = paisesArray[i - 1];
	        paisesArray[i - 1] = paisesArray[j];
	        paisesArray[j] = x;
	    }
		return paisesArray;
	}

	this.repartirPaises = function(){
		console.log('repartimos paises');
		//Ponemos todos los paises dentro de un array y los repartimos
		var shufflePaises = [];
		for (var property in this.paises) {
		    if (this.paises.hasOwnProperty(property)) {
		        shufflePaises.push(property);
		    }
		}
		shufflePaises = shuffle(shufflePaises);
		var paisesJ1 = [];
		var paisesJ2 = [];
		var jugador1 = this.getJ(1);
		var jugador2 = this.getJ(2);
		for (var i = 0; i < shufflePaises.length; i++) {
			if(i<22){
				jugador1.addPais(this.paises[shufflePaises[i]]);
				this.paises[shufflePaises[i]].addJugador(jugador1);
				paisesJ1.push(shufflePaises[i]);
			}else{
				jugador2.addPais(this.paises[shufflePaises[i]]);
				this.paises[shufflePaises[i]].addJugador(jugador2);
				paisesJ2.push(shufflePaises[i]);
			}
		}
		return [paisesJ1,paisesJ2];

	}

	this.setPaisSeleccionado1 = function(pais){
		this.paisSeleccionado1 = pais;
	}

	this.setPaisSeleccionado2 = function(pais){
		this.paisSeleccionado2 = pais;
	}

	this.removePaisSeleccionado1 = function(){
		this.paisSeleccionado1 = '';
	}

	this.removePaisSeleccionado2 = function(){
		this.paisSeleccionado2 = '';
	}

	this.clearPaisesSeleccionados = function(){
		this.paisSeleccionado1 = '';
		this.paisSeleccionado2 = '';
	}

	this.siguiente = function(){


		if(this.jugadorActual.objetivo.checkWin(this.jugadorActual)){
			console.log(this.jugadorActual.nombre + ' GANO!!');
		}
		switch (this.jugadorActual.estado) {
			case 'PrimeraIncorporacion':
				this.jugadorActual.estado = 'SegundaIncorporacion';
				this.jugadorActual.addEjercitosDisponibles(3);
				this.nextPlayer();
				this.clearPaisesSeleccionados();
				break;
			case 'SegundaIncorporacion':
					this.jugadorActual.estado = 'Atacando';
					this.nextPlayer();
					this.clearPaisesSeleccionados();
					break;
			case 'Incorporando':
				this.jugadorActual.estado = 'Atacando';
				this.clearPaisesSeleccionados();
				break;
			case 'Atacando':
				this.jugadorActual.estado = 'Reagrupando';
				this.clearPaisesSeleccionados();
				break;
			case 'Reagrupando':
				//Sumamos 1 a cantidad de turnos
				this.cantTurnos++;
				this.jugadorActual.paises.forEach(function(p){
					p.ejercitosPasados = {};
				});
				this.clearPaisesSeleccionados();
				//Cambio el jugador Actual
				this.nextPlayer();
				//Agregamos ejercitos MIN 3
				var ejercitosNuevos = 3;
				if(this.jugadorActual.paises.length>=8){
					ejercitosNuevos = Math.floor(this.jugadorActual.paises.length/2);
				}
				this.jugadorActual.addEjercitosDisponibles(ejercitosNuevos);
				this.jugadorActual.estado = 'Incorporando';
				this.conquistado = false;
				break;
		}

	}


	this.nextPlayer = function(){
		var indexPlayer = 0;
		for (var i = 0; i < this.jugadores.length; i++) {
			if(this.jugadores[i].id==this.jugadorActual.id){
				indexPlayer = i;
			}
		}
		indexPlayer++;
		if(indexPlayer>(this.jugadores.length-1)){
			indexPlayer=0;
		}
		this.jugadorActual = this.jugadores[indexPlayer];

	}

	this.pasarEjercito = function(p1,p2,cantidad){
		if(p1.ejercitosPasados[p2.id]){
			if(p1.ejercitosPasados[p2.id]>=cantidad){
					//Pasamos de los que nos habia pasado con aterioridad
					console.log('DE OTROS --------');
					p1.ejercitosPasados[p2.id] -= cantidad;
					p1.ejercito -= cantidad;
					p2.ejercito += cantidad;
			}
		}else{
			//Pasamos de nuestro ejercito
			console.log('EJERCITOS PASADOS = '+ p1.countEjercitosPasados());
			if((p1.ejercito - 1 - p1.countEjercitosPasados()) >= cantidad){
				p1.enviarEjercito(p1,p2,cantidad);
				if(p2.ejercitosPasados[p1.id]){
					p2.ejercitosPasados[p1.id]=cantidad+p2.ejercitosPasados[p1.id];
				}else{
					p2.ejercitosPasados[p1.id]=cantidad;
				}
				console.log('DE MI RESERVA ---------');
			}
		}
		console.log(p1.ejercitosPasados);
		console.log(p2.ejercitosPasados);
	}



}
