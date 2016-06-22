var config = [];
config['username'] 	= 'postgres';
config['password']	= 'belgrano1147';
config['ip']		= 'localhost';
config['port']		= '5432';
config['bd']		= 'tegBd';

exports.conectionString = function(){
	return "postgres://"+config['username']+":"+config['password']+"@"+config['ip']+":"+config['port']+"/"+config['bd'];
}
