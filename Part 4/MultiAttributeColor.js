// MultiAttributeColor.js
// Не работает
// Вершинный шейдер
var vshader_source =
    `attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
void main() {
gl_Position = a_Position; 
gl_PointSize = 10.0;
v_Color = a_Color;
}`;

// Фрагментный шейдер 
var fshader_source =
    `varying vec4 v_Color;
void main() {
gl_FragColor = v_Color;
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
    // gl.drawArrays(gl.POINTS, 0, n);
    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        // Координаты и размеры точек
        0.0, 0.5, 1.0, 0.0, 0.0, // Первая точка
        -0.5, -0.5, 0.0, 1.0, 0.0, // Вторая точка
        0.5, -0.5, 0.0, 0.0, 1.0 // Третья точка
    ]);
    var n = 3;

    // Создать буферный объект
    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Записать координаты вершин в буферный объект и разрешить присваивание
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    /**
     * @param FSIZE - размер одного элемента массива verticeSizes
     */
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // Получить ссылку на a_Position, выделить буфер и разрешить его
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Сохранить ссылку на буферный объект в переменной a_Position
    /**
     * @method vertexAttribPoiner
     * @param location определяет переменную-атрибут, которой будет выполнено присваивание
     * @param size определяет число компонентов на вершину в буферном объекте (допустимые значения от 1 до 4)
     * @param type определяет формат данных
     * @param normalized либо true, либо false. Указаывает на необходимость нормализации невещественных данных в диапазоне [0, 1] или [-1, 1]
     * @param stride определяет длину шага (в байтах) для извлечения информации об одной вершине, то есть, число байтов между разными элементами данных
     * @param offset определяет смещение (в байтах) от начала буферного объекта, где хранятся данные для вершин. Если данные хранятся, начиная с самого начала буфера, в этом параметре следует передать значение 0.
     */
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    // Разрешить присваивание переменной a_Position
    gl.enableVertexAttribArray(a_Position);

    // Получить ссылку на a_Color, выделить буфер и разрешить его
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Сохранить ссылку на буферный объект в переменной a_Color
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    // Разрешить присваивание переменной a_PointSize
    gl.enableVertexAttribArray(a_Color);
    return n;
}