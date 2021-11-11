var sujsascript = {}
var s = sujsascript

s.re_comienzo = function re_comienzo(x){
	return new RegExp(`^\\s*${x}(\\s+|\\b)`,"g")
}
s.transformar_llamadas = function transformar_llamadas(llamadas){
	return llamadas.map(x=>{
		var sin_comentarios = x.replace(/\/\/.*/g,"")
		var partes = sin_comentarios.split(/\s+/)
		var nombre_servicio = partes[0]
		var nombres_argumentos = partes.slice(1)
		var cad = null
		var re_sistema = s.re_comienzo("sistema.")
		var encuentra_sistema = nombre_servicio.match(re_sistema)
		var inicio = "servicios."
		if(encuentra_sistema){
			inicio = ""
			nombre_servicio = nombre_servicio.replace(re_sistema,"")
		}
		cad = `${inicio}${nombre_servicio}(${
			nombres_argumentos.join(",")
		})`
		return cad
	}).join("\n")
}
s.analizar_sujsascript = function analizar_sujsascript(
	script, nombre_servicios, objeto_servicios, puede_evaluar
){
	var v = {
		sentencias: script.split(/\s*\n+\s*/g).filter(x=>x),
		servicios: [],
		llamadas: []
	}
	var i = 0
	var agrega_servicio = true
	var servicio = []
	v.servicios.push(servicio)
	v.sentencias.map(x=>{
		var re_servicio = s.re_comienzo("servicio")
		var re_llamadas = s.re_comienzo("llamadas")
		var encuentra_servicio = x.match(re_servicio)
		var encuentra_llamadas = x.match(re_llamadas)
		if(encuentra_llamadas){
			agrega_servicio = false
		}
		if(agrega_servicio){
			if(encuentra_servicio){
				if(servicio.length!=0){
					servicio = []
					v.servicios.push(servicio)
				}
				x = x.replace(re_servicio,"")
			}
			servicio.push(x)
		}else{
			if(encuentra_llamadas==null){
				v.llamadas.push(x)
			}
		}
	})
	v.objeto_servicios = objeto_servicios
	v.servicios.map(x=>{
		var encabezado = x[0]
		var tronco = x.slice(1)
		var partes = encabezado.split(/\s+/g)
		var nombre = partes[0]
		var cad = `v.objeto_servicios.${nombre} = function ${
				nombre
			}(${partes.slice(1).join(",")}){${ s.transformar_llamadas(tronco) }}`
		var evaluado = eval(cad)
	})
	v.sentencias_para_evaluar = s.transformar_llamadas(v.llamadas)
	if(puede_evaluar){
		eval(v.sentencias_para_evaluar)
	}
	return v
}

s.ejemplo = `
servicio mostrar
	sistema.console.log ...arguments
servicio sumar a b
	mostrar a+b
servicio multiplicar a b
	mostrar a*b
llamadas
sumar 2 3 // 2+3 = 5
multiplicar 5 7 // 5*7 = 35
`

console.log(s.ejemplo)
var servicios = {}
var analizado = s.analizar_sujsascript(s.ejemplo,"servicios",servicios,true)
//console.log(analizado)
