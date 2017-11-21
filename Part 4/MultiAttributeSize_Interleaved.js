//MultiAttributeSize_Interleaved.js
/**
 * Перемежение (interleaving) - группировка координат и размеров
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
	var verticesSizes = new Float32Array([
		// Координаты и размеры точек
		0.0, 0.5, 10.0, // Первая точка
		- 0.5, -0.5, 20.0, // Вторая точка
		0.5, -0.5, 30.0 // Третья точка
	]);
	var n = 3;

	// Создать буферный объект
	var vertexSizeBuffer = gl.createBuffer();
	if (!vertexSizeBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Записать координаты вершин в буферный объект и разрешить присваивание
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

	var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
	// Получить ссылку на a_Position, выделить буфер и разрешить его
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Сохранить ссылку на буферный объект в переменной a_Position
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
	// Разрешить присваивание переменной a_Position
	gl.enableVertexAttribArray(a_Position);

	// Получить ссылку на a_PointSize, выделить буфер и разрешить его
	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
	if (a_PointSize < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Сохранить ссылку на буферный объект в переменной a_PointSize
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
	// Разрешить присваивание переменной a_PointSize
	gl.enableVertexAttribArray(a_PointSize);
	return n;
}