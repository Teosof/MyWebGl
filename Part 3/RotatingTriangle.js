//RotatingTriangle.js

/**
 * Для воспроизведения анимационного эффекта требуется два ключевых механизма:
 * Механизм 1: который позволил бы снова и снова вызывать функцию рисования треугольника в разные моменты времени.
 * Механизм 2: осуществляющий очистку области рисованием нового треугольника.
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

// Угол поворота (град/сек)
var ANGLE_STEP = 100.0;
// Смещение по оси
var Tx = 0.35, Ty = 0.0, Tz = 0.0;
// Масштабирование
var Sx = 1.0, Sy = 1.5, Sz = 1.0; 

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

	// Создать объект Matrix4 для модели преобразования
	var modelMatrix = new Matrix4();

	// Получить ссылку на переменную u_ModelMatrix
	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

	// Очистить <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Текущий угол поворота треугольника
	var currentAngle = 0.0;
	// Объект Matrix4 для модели преобразования
	var modelMatrix = new Matrix4();

	// Начать рисование треугольника
	// Фактический механизм повторного вызова [Механизм 1] функции рисования
	/**
	 * @description @function tick() - анонимная функция - её использование обусловлено тем, чтобы обеспечить передачу локальных переменных, объявленных в main() функции draw()
	 */
	var tick = function () {
		currentAngle = animate(currentAngle); // Изменить угол поворота
		draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
		/**
		 * @function setInterval (func, delay)
		 * @description: многократно вызывает функцию func через равные интервалы времени delay
		 * @argument func: определяет функцию вызова
		 * @argument dalay: определяет интервал времени (в миллисекундах)
		 * @deprecated: Этот метод появился задолго до того, как браузеры стали поддерживать интерфейс с вкладками;он выполняется, независимо от того, какая вкладка в данный момент активна. Это может приводить к ухудшению общей производительности
		 */
		/**
		 * @function requestAnimationFrame (func)
		 * @description: Требует от браузера вызвать функцию func для перерисовывания. Это требование необходимо повторять после каждого вызова.
		 * @argument: Определяет функцию для вызова. Функция должна принимать параметр time, в котором передается текущее время.
		 */
		/**
		 * @function cancelAnimationFrame (requestID)
		 * @description: отменяет требование на повторный вызов функции, переданное вызовом requestAnimationFrame()
		 * @argument requestID: значение  возвращаемое вызовом requestAnimationFrame()
		 */
		requestAnimationFrame(tick); // Потребовать от браузера вызвать tick
	};
	tick();
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

// [Механизм 2], осуществляющий очистку и рисование треугольника, определен как единая функция draw()
/**
	 * @function draw()
	 * @description: получает матрицу вращения, поворачивающую треугольник на currentAngle градусов, и передает ее дальше, вершинному шейдеру, через u_ModelMatrix, после чего вызывает gl.drawArrays()
	 * @argument gl: контекст отображения, в котором выполняется рисование
	 * @argument n: число вершин
	 * @argument currentAngle: текущий угол поворота;
	 * @argument modelMatrix: объект Matrix4 для хранения матрицы вращения, вычисленной с использованием currentAngle;
	 * @argument u_ModelMatrix : ссылка на uniform-переменную, через которую передается modelMatrix 
	 */
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
	// Определить матрицу вращения
	modelMatrix.setRotate(currentAngle, 0, 0, 1);
	modelMatrix.translate(Tx, 0, 0);
	modelMatrix.scale(Sx, Sy, Sz)

	// Передать матрицу в вершинный шейдер
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	// Очистить <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Нарисовать треугольник
	gl.drawArrays(gl.TRIANGLES, 0, n);
}

// Момент времени, когда функция была вызвана в последний раз
var g_last = Date.now();
function animate(angle) {
	// Вычислить прошедшее время
	var now = Date.now(); // Date.now() измеряется в миллисекундах (1/1000)
	var elapsed = now - g_last; // в миллисекундах
	g_last = now;
	// Изменить текущий угол поворота (в соответствии с прошедшим временем)
	var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
	return newAngle %= 360;
}