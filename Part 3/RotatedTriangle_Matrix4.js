//RotatedTriangle_Matrix4.js

/**
 * Программа осуществляет поворот треугольника относительно оси Z, против часовой стрелки на угол 90 градусов c использованием матрицы вращения
 */

/**
 * Свойства и методы, поддерживаемые объектом Matrix4
 * 
 * @method Matrix4.setIdentity ()
 * @description Инициализирует объект, как единичную матрицу
 * 
 * @method Matrix4.setTranslate (x, y, z)
 * @argument x Расстояние перемещения по оси X
 * @argument y Расстояние перемещения по оси Y
 * @argument z Расстояние перемещения по оси Z
 * @description Заполняет объект Matrix4 как матрицу перемещения
 * 
 * @method Matrix4.setRotate (angle, x, y, z)
 * @argument angle - угол (в градусах)
 * @argument x
 * @argument y
 * @argument z
 * @description Заполняет объект Matrix4 как матрицу вращения, представляющую поворот на угол angle относительно осей (x, y, z). 
 * Координаты (x, y, z) не требуется нормализовать.
 * 
 * @method Matrix4.setScale (x, y, z)
 * @argument x
 * @argument y
 * @argument z
 * @description Заполняет объект Matrix4 как матрицу масштабирования с коэффициентами x, y, z.
 * 
 * @method Matrix4.translate (angle, x, y, z)
 * @argument angle - угол (в градусах)
 * @argument x Расстояние перемещения по оси X
 * @argument y Расстояние перемещения по оси Y
 * @argument z Расстояние перемещения по оси Z
 * @description Умножает матрицу, хранящуюся в объекте Matrix4, на матрицу перемещения, представляющую перемещение. Результат сохраняется в объекте Matrix4.
 * 
 * @method Matrix4.rotate (angle, x, y, z)
 * @argument angle - угол (в градусах)
 * @argument x
 * @argument y
 * @argument z
 * @description Умножает матрицу, хранящуюся в объекте Matrix4, на матрицу перемещения, представляющую поворот на угол angle относительно осей (x, y, z). Результат сохраняется в объекте Matrix4. Координаты (x, y, z) не требуется нормализовать.
 * 
 * @method Matrix4.scale (x, y, z)
 * @argument x
 * @argument y
 * @argument z
 * @description Умножает матрицу, хранящуюся в объекте Matrix4, на матрицу перемещения, представляющую масштабирования с коэффициентами x,y,z. Результат сохраняется в объекте Matrix4.
 * 
 * @method Matrix4.set (m)
 * @argument m - матрица, которая должна быть объектом Matrix4.
 * @description Переписывает содержимое матрицы m в объект Matrix4.
 * 
 * @method Matrix4.elements
 * @description Типизированный массив (Float32Array) с элементами их матрицы, хранящейся в объекте Matrix4.
 * 
 */


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

    // Создать матрицу вращения
    var radian = Math.PI * ANGLE / 180.0; // Преобразовать в радианы
    var cosB = Math.cos(radian), sinB = Math.sin(radian);

    // Создать объект Matrix4
    var xformMatrix = new Matrix4();

    // Cоздать матрицу вращения в переменной xformMatrix
    xformMatrix.setRotate(ANGLE, 0, 0, 1);
    
    // Передать матрицу вращения в вершинный шейдер
    /**
     * Передать методу gl.uniformMatrix4fv объект Matrix4 непосредственно нельзя.
     * Он ожидает получить типизированный массив.
     * Поэтому используется свойство elements объекта Matrix4, возвращающее матрицу в виде такого типизированного массива.
     */
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

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
