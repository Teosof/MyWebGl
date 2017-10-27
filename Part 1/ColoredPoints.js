// ColoredPoints.js
/**
 * Цель:
 * объявить uniform -переменную во фрагментном шейдере;
 * присвоить встроенной переменой gl_FragColor значение uniform - переменной;
 * присвоить данные uniform - переменной.
 */

// Вершинный шейдер
var vshader_source =
    `attribute vec4 a_Position;
void main() {
gl_Position = a_Position;
gl_PointSize = 10.0;
}`;

// Фрагментный шейдер
// precision = medium - спецификатор точности
var fshader_source =
    `precision mediump float;
    uniform vec4 u_FragColor;
void main() {
gl_FragColor = u_FragColor;
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

    // Получить ссылку на переменную-атрибут a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Получить ссылку на unifrom-переменную u_fragColor
    /**
     * gl.getUniformLocation(program, name)
     * program - объект программы, хранящий вершинный и фрагментный шейдеры
     * name - определяет имя uniform-переменной, ссылку на которую требуется получить
     */
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    //Зарегистрировать функцию (обработчик) для вызова по щелчку 
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position, u_FragColor); };

    // Сохранить координаты в переменной-атрибуте
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var g_points = []; // Массив с координатами точек, где выполнялись щелчки
    var g_colors = []; // Массив со значениями цветов точек

    function click(ev, gl, canvas, a_Position, u_FragColor) {
        var x = ev.clientX; // координата X указателя мыши
        var y = ev.clientY; // координата Y указателя мыши
        var rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);

        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

        g_points.push([x, y]);

        // Сохранить цвет в массиве g_colors
        if (x >= 0.0 && y >= 0.0) { // Первый квадрант
            g_colors.push([1.0, 0.0, 0.0, 1.0]); // Красный

        } else if (x < 0.0 && y < 0.0) { // Третий квадрант
            g_colors.push([0.0, 1.0, 0.0, 1.0]); // Зеленый

        } else { // Второй и четвёртый квадрат
            g_colors.push([1.0, 1.0, 1.0, 1.0]); // Белый


            // Очистить <canvas>
            gl.clear(gl.COLOR_BUFFER_BIT);

            var len = g_points.length;
            for (var i = 0; i < len; i++) {
                // Передать координаты щелчка в переменную a_Position
                var xy = g_points[i];
                var rgba = g_colors[i];

                // Передать координаты щелчка в переменную a_Position
                gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

                // Передать цвет точки в переменную u_FragColor
                /**
                 * gl.uniform4f(location, v0, v1, v2, v3)
                 * location - ссылка на uniform-переменную атрибут, которой требуется присвоить указанное значение
                 * v0 - значение, используемое как первый элемент для uniform-переменной
                */
                gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

                // Нарисовать точку
                gl.drawArrays(gl.POINTS, 0, 1);
            }
        }
    }
}