//TranslatedTriangle.js

// Вершинный шейдер
var vshader_source =
    `attribute vec4 a_Position;
uniform vec4 u_Translation;
void main() {
gl_Position = a_Position + u_Translation;
}`;
/**
 * В переменной gl_Position нужно указать однородные, четырехмерные координаты. Если последний компонент однородных координат равен 1.0, такие координаты соответствуют той же позиции, что и трехмерные координаты. В данном случае, так как последний компонент вычисляется как сумма w1+w2,чтобы гарантировать равенство результата w1+w2 значению 1.0 необходимо в компоненте w передать значение 0.0 (четвертый параметр метода gl.uniform4f())
 */

// Фрагментный шейдер 
var fshader_source =
    `void main() {
gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

// Расстояния трансляции по осям X, Y и Z
var Tx = 0.5, Ty = 0.5, Tz = 0.0;

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

    // Передача расстояния перемещения в вершинный шейдер
    // Извлечение ссылки на uniform-переменную
    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    // Запись в uniform-переменную данные
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

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
