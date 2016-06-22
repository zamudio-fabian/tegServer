module.exports = function ObjetivoSecreto(descripcion,funcion){
	this.descripcion = descripcion;

	this.checkWin = function(jugador){
		if(funcion(jugador)){
			return true;
		}else if(jugador.paises.length==43){
			return true;
		}else{
			return false;
		}
	}
}
