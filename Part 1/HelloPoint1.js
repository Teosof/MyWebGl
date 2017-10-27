// HelloPoint1.js
// Система координат, используемая в WebGL - правосторонняя
// Важное отличие OpenGl от WebGL:
// Отсутсвие кода, осуществляющего перестановку рабочего и фонового буферов цвета

// Вершинный шейдер (vertex shader)
// Описывает характеристики вершины - точки в пространстве (координаты)
// Вершина - точка в двух- или трёхмерном пространстве
/**
 * gl_Position - координаты точки
 * gl_PointSize - размер точки (в пикселях)
 * vec4 - вектор, состоящий из четырёх вещественных значений
 * Четырёх компонентные координаты - однородные координаты (homogeneous coordinate)
 */ы
var vshader_source =
'void main() {\n\
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n\
  gl_PointSize = 10.0;\n\
}';

// Фрагментный шейдер (fragment shader)
// Реализует обработку фрагментов изображений, например, определение освещенности
// Фрагмент - простейший элеент изображения, своего рода "пиксель"
/**
 * g1_FragColor - установить цвет фрагмента
 */
var fshader_source =
'void main() {\n\
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n\
}';

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
    /**
     * initShaders - инициализирует шейдеры и передаёт их системе WebGL
     * gl - контекст изображения
     * vshader_source - вершинный шейдер (строка)
     * fshader_source - фрагметный шейдер (строка)
     */
    if (!initShaders(gl, vshader_source,  fshader_source)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // Указать цвет для очистки <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать точку
    gl.drawArrays(gl.POINTS, 0, 1);
    /**
     * gl.drawArrays (mode, first, count)
     * Выполняет вершинный шейдер, чтобы нарисовать фигуры, определяемые параметром mode
     * Mode - определяет тип фигуры. Допустимые параметры:
     * *gl.POINTS
     * *gl.LINES
     * *gl.LINE_STRIP
     * *gl.LINE_LOOP
     * *gl.TRIANGLES
     * *gl.TRIANGLE_STRIP
     * *gl.TRIANGLE_FAN
     * First - определяет номер вершины, с которой должно начинаться рисование (целое число)
     * Count - определяет количество вершин (целое число)
     * В данном примере:
     * first = 0, так как рисование начинается с первой вершины
     * count = 1, так как программа рисует только одну точку
     */
}