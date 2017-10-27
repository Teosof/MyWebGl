//ScallingTriangle_Matrix.js

// Вершинный шейдер
var vshader_source =
    `attribute vec4 a_Position;
uniform mat4 u_xformMatrix;
void main() {
gl_Position = u_xformMatrix * a_Position;
}`;

// Фрагментный шейдер 
var fshader_source =
    `void main() {
gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

// Коэффициенты масштабирования
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

    // В WebGL элементы следуют в порядке расположения по столбцам
    var xformMatrix = new Float32Array([
        Sx, 0.0, 0.0, 0.0,
        0.0, Sy, 0.0, 0.0,
        0.0, 0.0, Sz, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);

    // Передать матрицу вращения в вершинный шейдер
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    /**
     * @function gl.uniformMatrix4fv (location, transpose, array)
     * @description Записывает матрицу 4×4, находящуюся в массиве array, в uniform-переменную location.
     * @param location - Определяет uniform-переменную, куда будет записана матрица.
     * @param transpose - В WebGL должен иметь значение false.
     * // Этот параметр определяет необходимость транспонирования матрицы. Эта операция не поддерживается реализацией данного метода в WebGL, поэтому в данном параметре всегда следует передавать false.
     * @param array - Определяет массив с матрицей 4×4 с порядком расположения элементов по столбцам.
     */
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать треугольник
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
