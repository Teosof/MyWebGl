// HelloPoint1.js

/**
 * Цель: передать координаты точки из программного кода на JavaScript в вершинный шейдер.
 * Способ 1: Переменные-атрибуты (переменные со спецификатором attribute)
 * Данная переменная передает уникальные данные для каждой вершины
 * Переменные-атрибуты должны начинаться с префикса a_
 * Способ 2: uniform - переменные (переменные со спецификатором uniform)
 * Данная переменная передает одни и те же данные для всех вершин
 * Uniform-переменные должны начинаться с префикса u_
 */

// Вершинный шейдер
/**
 * attribute - спецификатор класса хранения. Указывает, что следующая за ним переменная является переменной-атрибутом
 * Эта переменная должна быть объявлена глобальной, потому что данные в нее записываются за пределами шейдера. 
 */
var vshader_source =
    `attribute vec4 a_Position;
    attribute float a_PointSize;
void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
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

    // Получить ссылку на переменную-атрибут
    /**
     * gl.getAttribLocation(program, name) - возвращает ссылку на переменную-атрибут, определяемую параметром name
     * program - объект программы, хранящий вершинный и фрагментный шейдеры
     * name - определяет имя пременной-атрибута, ссылку на которую требуется получить.
    */
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    // Сохранить координаты в переменной-атрибуте
    /**
     * gl.vertexAttrib3f(location, v0, v1, v2) - присваивает данные (v0, v1 и v2) переменной-атрибуту, определяемой аргументом location
     * location - cсылка на переменную-атрибут, которой требуется присвоить указанное значение
     * v0 - значение, используемое как первый элемент для переменной-атрибута (х)
     * v1 - значение, используемое как второй элемент для переменной-атрибута (y)
     * v2 - значение, используемое как третий элемент для переменной-атрибута (z)
     */
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    gl.vertexAttrib2f(a_PointSize, 10.0);

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Нарисовать точку
    gl.drawArrays(gl.POINTS, 0, 1);
}