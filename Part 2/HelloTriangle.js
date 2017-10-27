//HelloTriangle.js
/**
 * Точка
 * @param gl.Points
 * @description Группа точек. Точки рисуются в координатах вершин v0, v1, v2 ...
 * 
 * Отрезок
 * @param gl.LINES
 * @description Группа отдельных отрезков. Отрезки рисуются между парами вершин (v0, v1), (v0, v1), (v0, v1)... Если число вершин нечетное, последняя вершина игнорируется.
 *  
 * Ломаная
 * @param gl.LINE_STRIP
 * @description Группа связанных между собой отрезков. Отрезки рисуются между парами вершин (v0, v1), (v1, v2), (v2, v3)... Первая вершина становится началом первого отрезка, вторая вершина становится концом первого отрезка и началом второго, и так далее. Вершина с индексом i (где i > 1) становится началом i-го отрезка и концом отрезка с индексом i–1. (Последняя вершина становится концом последнего отрезка.)
 *  
 * Замкнутая ломаная
 * @param gl.LINE_LOOP
 * @description Группа связанных между собой отрезков. Вдобавок к обычной ломаной, которая рисуется при значении gl.LINE_STRIP, параметра mode, рисуется отрезок, соединяющий последнюю и первую вершины. Отрезки рисуются между парами вершин (v0, v1), (v1, v2), ..., и (vn, v0) где vn – последняя вершина.
 *  
 * Треугольник
 * @param gl.TRIANGLES
 * @description Группа отдельных треугольников. Треугольники задаются триадами вершин (v0, v1, v2), (v3, v4, v5) .... Если число вершин не кратно 3, лишние вершины игнорируются.
 * 
 * Треугольники с общими сторонами 
 * @param gl.TRIANGLE_STRIP
 * @description Группа треугольников, связанных между собой общими сторонами. Первые три вершины образуют первый треугольник, а второй треугольник образуется из следующей вершины и двух предшествующих, входящих в состав первого треугольника. Треугольники рисуются между тройками вершин  (v0, v1, v2), (v2, v1, v3), (v2, v3, v4) ...
 *
 * Треуольники с общей вершиной
 * @param gl.TRIANGLE_FAN
 * @description Группа треугольников, связанных между собой общими вершинами. Первые три вершины образуют первый треугольник, а второй треугольник образуется из следующей вершины, одной стороны предыдущего треугольника и первой вершины. Треугольники рисуются между тройками вершин (v0, v1, v2), (v0, v2, v3), (v0, v3, v4) ...
 */
// Вершинный шейдер
var vshader_source =
    `attribute vec4 a_Position;
void main() {
gl_Position = a_Position;
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
