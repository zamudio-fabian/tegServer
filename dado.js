module.exports = function Dado(){
	this.valor = 1;

	this.tirar = function(){
		return (1 + Math.floor(Math.random()*6));
	}
}
