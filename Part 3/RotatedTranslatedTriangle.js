//RotatedTranslatedTriangle.js

/**
 * Моделирование преобразований (модель преобразований) - объединение нескольких преобразований.
 * Матрица модели - матрица, представляющая такую модель преобразований.
 */

// Вершинный шейдер
var vshader_source =
	`attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
void main() {
gl_Position = u_ModelMatrix * a_Position;
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

	// Создать объект Matrix4 для модели преобразования
	var modelMatrix = new Matrix4();

	// Cоздать матрицу модели
	var ANGLE = 60.0; // Угол поворота
	var Tx = 0.5; // Расстояние перемещения
	// Вращение и поворот
	modelMatrix.setRotate(ANGLE, 0, 0, 1); // Определить матрицу вращения
	modelMatrix.translate(Tx, 0, 0); // Умножить modelMatrix на матрицу перемещения

	/**
	 * // Поворот и вращение
	 * modelMatrix.setTranslate(Tx, 0, 0);
	 * modelMatrix.rotate(ANGLE, 0, 0, 1);
	 */

	// Передать матрицу вращения в вершинный шейдер
	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	// Указать цвет для очистки области рисования <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Очистить <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Нарисовать треугольник
	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([0.0, 0.3, -0.3, -0.3, 0.3, -0.3]);
	var n = 3; // Число вершин

	// Создание буферный объект
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Определить тип буферного объекта
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Записать данные в буферный объект
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Сохранить ссылку на буферный объект в переменной a_Position
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// Разрешить присваивание переменной a_Position
	gl.enableVertexAttribArray(a_Position);

	return n;
}
