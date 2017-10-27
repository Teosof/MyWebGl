// ClickedPoints.js

// Вершинный шейдер
var vshader_source =
    `attribute vec4 a_Position;
void main() {
gl_Position = a_Position;
gl_PointSize = 10.0;
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
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    //Зарегистрировать функцию (обработчик) для вызова по щелчку 
    /**
     * Обработчик событий - асинхронная функция обратного вызова, обрабатывающая события ввода от пользователя
     * onmousedown - свойства, которому присвают ссылку на функцию, которая будет обрабатывать щелчки
     * Данная function - анонимная функция, т. е. функция, не имеющая имени
     * Когда возникает событие щелчка, браузер автоматически вызовет функцию, зарегистрированную в свойстве omousedown с единственным предопределенным параметром. 
     // Порядок действий
     * Вызов анонимной функции function
     * Вызов click и передача в локальных переменных, объявленных в main()
     */
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position); };

    // Сохранить координаты в переменной-атрибуте
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    // Указать цвет для очистки области рисования <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Очистить <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var g_points = []; // Массив с координатами точек, где выполнялись щелчки
    /**
     * Описание асинхронной функции обратного вызова click().
     * Получаем координаты указателя мыши в момент щелчка и сохраняем их в массиве.
     * Очищаем <canvas>.
     * Для каждой пары координат в массиве рисуем точку.
     // Координаты clientX и clientY нельзя использовать непосредственно:
     * Координаты соответствуют положению указателя мыши в «клиентской области» окна браузера, а не в элементе <canvas>
     * Система координат элемента <canvas> отличается от системы координат WebGL – начало системы координат и  направление оси Y не совпадают    
     * */
    function click(ev, gl, canvas, a_Position) {
        var x = ev.clientX; // координата X указателя мыши
        var y = ev.clientY; // координата Y указателя мыши
        var rect = ev.target.getBoundingClientRect(); // преобразование координат из системы координат клиентской области окна браузера в систему координат элемента <canvas> 

        /**
         * Преобразуем координаты из системы координат клиентской области окна браузера в систему координат элемента <canvas>. 
         * Значения rect.left и rect.top – это координаты верхнего левого угла <canvas> в клиентской области окна браузера. 
         * То есть, выражение (X - rect.left)  и выражение (Y - rect.top) - смещение начало координат в позицию верхнего левого угла элемента <canvas>.
         * Преобразуем координаты в элементе <canvas> в систему координат WebGL.
         * Для этого требуется определить координаты центра элемента <canvas>. 
         * Получить высоту и ширину элемента <canvas> можно с помощью свойств canvas.height (в данном случае имеет значение 400) и canvas.width (так же имеет значение 400). 
         * Таким образом, центр элемента <canvas> будет иметь координаты (сanvas.height/2, canvas.width/2). 
         * Это преобразование реализуем путем смещения начала координат в центр элемента <canvas>, где находится начало системы координат WebGL. 
         * Необходимое преобразование выполняется с помощью выражений ((x - rect.left) - canvas.width / 2) и (canvas.height / 2 - (y - rect.top)). 
         * Диапазон значений по оси X в элементе <canvas> изменяется от 0 до canvas.width (400), а диапазон значений по оси Y – от 0 до canvas.height (400). 
         * Но, так как диапазон значений по осям координат в WebGL изменяется от –1.0 до 1.0, на последнем шаге преобразования системы координат <canvas> в систему координат WebGL необходимо разделить координату X на canvas.width/2, а координату Y – на canvas.height/2 
         */
        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);

        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

        /**
         * Сохранить координаты в массиве g_points
         * Чтобы программа могла нарисовать все точки, соответствующие предыдущим щелчкам, необходимо хранить координаты всех щелчков
         */
        g_points.push([x, y]);

        // Очистить <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;
        for (var i = 0; i < len; i++) {
            // Передать координаты щелчка в переменную a_Position
            var xy = g_points[i]
            gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

            // Нарисовать точку
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}