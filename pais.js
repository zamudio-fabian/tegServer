module.exports = function Pais(id,nombre,continente){
	this.id = id;
	this.nombre = nombre;
	this.continente = continente;
	this.ejercito = 1;
	this.limitrofes = [];
	this.ejercitosPasados = {};



		this.pasarEjercito = function(toPais,cantidad){
			var paisDesde  = this;
			var paisHacia = toPais;
			var cantidad = cantidad;
			if(cantidad<=3 && cantidad>=1 && cantidad<=(this.ejercito-1)){
				paisDesde.enviarEjercito(paisDesde,paisHacia,cantidad);
			}
		}

		this.enviarEjercito = function(paisDesde,paisHacia,cantidad){
			paisHacia.ejercito+=cantidad;
			paisDesde.ejercito-=cantidad;
		}

		this.addJugador = function(jugador){
			this.jugador = jugador;
		}

		this.addLimitrofes = function(limitrofes){
			this.limitrofes = limitrofes;
		}

		this.addEjercito = function(cantidad){
			if(this.jugador.ejercitosDisponibles >= cantidad){
				this.ejercito+=cantidad;
				this.jugador.removeEjercitosDisponibles(cantidad);
				return true;
			}
			return false;
		}

		this.removeEjercito = function(cantidad){
			if(this.ejercito >= cantidad){
				this.ejercito-=cantidad;
				this.jugador.addEjercitosDisponibles(cantidad);
				return true;
			}
			return false;
		}

		this.isLimitrofeEnemigo = function(pais){
			return this.jugador != pais.jugador &&
					this.limitrofes.indexOf(pais)>-1;
		}

		this.isLimitrofeAliado = function(pais){
			return this.jugador == pais.jugador &&
					this.limitrofes.indexOf(pais)>-1;
		}

		this.countEjercitosPasados = function(){
			var count = 0;
			for (var property in this.ejercitosPasados) {
			    if (this.ejercitosPasados.hasOwnProperty(property)) {
					count+=this.ejercitosPasados[property] ;
			    }
			}
			return count;
		}


}
