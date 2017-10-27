//RotatedTriangle.js
/**
 * Программа осуществляет поворот треугольника относительно оси Z, против часовой стрелки на угол 90 градусов
 */

// Вершинный шейдер
var vshader_source =
    /**
     * x' = x cos b - y sin b
     * y' = x sin b + y cos b
     * z' = z
     */
    `attribute vec4 a_Position;
    uniform float u_CosB, u_SinB;
void main() {
    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
    gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
}`;

// Фрагментный шейдер 
var fshader_source =
    `void main() {
gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

//Угол поворота
var ANGLE = 90.0;

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

    // Передать в вершинный шейдер данные, необходимые для поворота фигуры
    var radian = Math.PI * ANGLE / 180.0; // Преобразовать в радианы
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать треугольник
    /**
     * gl.drawArrays(gl.TRIANGLES, 0, n) выполняет вершинный шейдер
     * На каждом прогоне он выполняет три операции:
     * 1. Координаты текущей вершины переписываются в переменную a_Position.
     * 2. Значение u_Translation складывается со значением переменной a_Position.
     * 3. Результат присваивается переменной gl_Position.
     */
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
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
