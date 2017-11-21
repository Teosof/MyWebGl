//MultiAttributeSize.js
/**
 * Передача координат вершин
 * (1) Создать буферный объект.
 * (2) Указать тип буферного объекта.
 * (3) Записать координаты в буферный объект.
 * (4) Присвоить ссылку на буферный объект переменной-атрибуту.
 * (5) Разрешить присваивание. 
 */

// Вершинный шейдер
var vshader_source =
	`attribute vec4 a_Position;
	attribute float a_PointSize;
void main() {
	gl_Position = a_Position; 
	gl_PointSize = a_PointSize; 
}`;

// Фрагментный шейдер 
var fshader_source =
	`void main() {
gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

function main() {
	// Получить ссылку на элемент <canvas>
	var canvas = document.getElementById('webgl');

	// Получить контекст отображения для WebGL
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	// Инициализировать шейдеры
	if (!initShaders(gl, vshader_source, fshader_source)) {
		console.log('Failed to initialize shaders.');
		return;
	}

	// Определить координаты вершин
	var n = initVertexBuffers(gl);
	if (n < 0) {
		console.log('Failed to set the positions of the vertices');
		return;
	}

	// Указать цвет для очистки области рисования <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Очистить <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Нарисовать три точки
	gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
	var n = 3; //Число вершин

	// Размеры точек
	var sizes = new Float32Array([10.0, 20.0, 30.0]);

	// Создать буферный объект
	var vertexBuffer = gl.createBuffer(); // <- (1)
	var sizeBuffer = gl.createBuffer(); // <- (1')
	if (!vertexBuffer || !sizeBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Записать координаты вершин в буферный объект и разрешить присваивание
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // <-(2)
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // <-(3)

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0); // <-(4)
	gl.enableVertexAttribArray(a_Position);// <-(5)

	// Записать размеры точек в буферный объект и разрешить присваивание
	gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer); // <-(2')
	gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW); // <-(3')
	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
	if (a_PointSize < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Сохранить ссылку на буферный объект в переменной a_PointSize
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0); // <-(4')

	// Разрешить присваивание переменной a_PointSize
	gl.enableVertexAttribArray(a_PointSize); // <-(5')

	return n;
}