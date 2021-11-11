# sujsascript
Lenguaje de programación hecho en JavaScript.

El objetivo es que las funciones puedan llamarse sin los paréntesis, y los argumentos que no usen las comas.

 - Es decir, en vez de `mostrar(2,3)`, mejor esto, `mostrar 2 3`, más enfocado al estilo de _bash_.
 - Las funciones, en este lenguaje se llaman ___servicios___.

## Ejemplo de prueba

En este ejemplo se ejecutan las funciones de sumar y multiplicar.

```js
s.ejemplo = `
servicio mostrar
	sistema.console.log ...arguments
servicio sumar a b
	mostrar a+b
servicio multiplicar a b
	mostrar a*b
llamadas
sumar 2 3
multiplicar 5 7
`
```

Para las funciones globales, se le agrega `sistema.`, para las locales, no, y van en un objeto. Además, cuando se declaran todas las funciones, aparece la sentencia `llamadas`, ahí empieza a evaluarse las llamadas.

Para ejecutar el string:

```
var servicios = {}
var analizado = s.analizar_sujsascript(s.ejemplo,"servicios",servicios,true)
```

Resultado:

 - __Dos más tres__ es __cinco__
 - __Cinco por siete__ es __treinta y cinco__

```js
5
35
```
