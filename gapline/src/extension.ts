/** 
 * Indica al entorno de ejecucion del codigo JS que debe ejecutarse en modo estricto.
 * Este modo fue introducido en ES5. Algunos de los cambios que introduce el modo estricto es:
 *   1. Elimina algunos errores silenciosos de JavaScript cambiándolos para que lancen errores
 *   2. Prohíbe cierta sintaxis que probablemente sea definida en futuras versiones de ECMAScript
 */ 

'use strict';

/**
 * Se importan todos los modulos que forman parte del modulo vscode con un alias de vscode,
 * estos modulos sirven para poder interactuar con el editor
 */
import * as vscode from 'vscode';

	/**
	 * Se exporta la funcion para poder ser usada, las extensiones de VS code deben de tener
	 * la funcion activate que se ejecuta cuando el usuario ejecuta por primera vez la extension
	 * 
	 * @param context Una colleccion de utilidades privadas que solo son utilizadas por esta extension
	 */
	export function activate(context: vscode.ExtensionContext) {

		/**
		 * Se registra el comando usando la funcion vscode.commands.registerCommand
		 * 1. El primer argumento es una cadena de texto  con la que se identificara el comando, 
		 *    esta cadena id debe ser unica y tambien se debe registrar en la seccion commands
		 *    del archivo package.json, sino no se podra llamar la extension. Ejemplo:
		 * 
		 *    "commands": [
		 *		 {
		 *	        "command": "extension.gapline",
		*		    "title": "Agregar gapline"
		*		 }
		*	   ]
		* 
		* 2. El segundo argumento es una funcion, esto es lo que realizara la extension
		* 
		* 3. El tercer argumento es opcional y es el contexto de ejecucion de la extension
		* 
		* Esto regresa una clase de tipo disposable
		*/
		let disposable = vscode.commands.registerCommand('extension.gapline', () => {

			/**
			 * Obtenemos una referencia a la ventana activa del editor,
			 * regresa undefined si no hay una ventana activa
			 */
			var editor = vscode.window.activeTextEditor;

			/**
			 * Se verifica si la referencia del editor es undefined o no,
			 * si es undefined, hasta aqui llega la ejecucion de la funcion.
			 */
			if (!editor) { return; }

			/**
			 * Obtiene informacion sobre las lineas del editor
			 * seleccioandas por el usuario
			 */
			var selection = editor.selection;


			/**
			 * Se obtiene el texto de las lineas del editor 
			 * seleccionadas por el usuario
			 */
			var text = editor.document.getText(selection);

			/**
			 * Se muestra un pequeño dialogo de texto donde se le pide
			 * al usuario cada tantas lineas de texto se agregara una linea en blanco
			 * por ejemplo, si el usuario ingresa 2, cada 2 lineas de texto seleccionadas
			 * se agregara una linea en blanco
			 */
			vscode.window.showInputBox({ prompt: 'Lineas?' }).then(value => {
				
				// Se le asigna el valor que el usuario ingreso a la variable
				let numberOfLines = +value;

				// De declara una matriz vacia que almacenara texto
				var textInChunks: Array<string> = [];

				/**
				 * Se separa el texto usando un salto de linea como separador, 
				 * esto regresa una matrix que luego se itera sobre ella
				 */
				text.split('\n').forEach((currentLine: string, lineIndex) => {

					// Agregamos la linea de texto a la matriz
					textInChunks.push(currentLine);

					/**
					 * Verificamos que el resultado de la operacion modulo entre
					 * la posicion del texto en la matriz + 1 que estamos iterando y
					 * el valor ingresado por el usuario sea igual a cero
					 * si es cero se agrega una linea vacia a la matriz textInChuncks
					 */
					if ((lineIndex+1) % numberOfLines === 0) {textInChunks.push('');}
				});

				/**
				 * Se une la matriz resultante como una sola cadena de texto
				 * usando un salto de linea como separador etre elementos
				 */
				text = textInChunks.join('\n');

				//Se edita el contenido de la ventana del editor donde se corrio el comando 
				editor.edit((editBuilder) => {

					/**
					 * Se instancia una clase Range que representa un par ordenado de 2 posiciones
					 * 1. Como primer parametro recibe la linea donde inicia del texto seleccionado
					 *    por el usuario.
					 * 2. Como segundo parametro recibe la posicion del primer caracter del texto
					 *    seleccionado por el usuario. (cero en este caso)
					 * 3. Como tercer parametro recibe la linea final del texto seleccionado por
					 *    el usuario.
					 * 4. Como cuarto parametro recibe la posicion del ultimo caracter del texto
					 * 	  seleccionado por el usuario.
					 */
					var range = new vscode.Range(
						selection.start.line, 0, 
						selection.end.line,
						editor.document.lineAt(selection.end.line).text.length
					);

					/**
					 * Se reemplaza el texto en el rango obtenido,
					 * por el nuevo texto con las lineas en blanco
					 * en la ventana del editor donde se corrio el comando
					 */
					editBuilder.replace(range, text);
				});
			});
		});

		// Se agrega el la variable disposable a la matriz subscriptions
		// esto permite que se liberen los recursos usados por la extension
		// cuando se desactiva 
		context.subscriptions.push(disposable);
	}

	// Funcion que libera recursos cuando se desactiva la extension
	export function deactivate() { }
