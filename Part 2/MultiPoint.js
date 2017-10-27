//MultiPoint.js
/**
 * Буферный объект – это область памяти в системе WebGL, где можно хранить множество вершин. Она используется и как область для сборки фигуры, и как средство передачи сразу нескольких вершин в вершинный шейдер.
 * Для передачи в вершинный шейдер массив данных посредством буферного объекта, необходимо выполнить пять шагов.
 * 1. Создать буферный объект ( gl.createBuffer() ).
 * 2. Указать тип буферного объекта ( gl.bindBuffer() ).
 * 3. Записать данные в буферный объект ( gl.bufferData() ).
 * 4. Сохранить ссылку на буферный объект в переменной-атрибуте ( gl.vertexAttribPointer() ).
 * 5. Разрешить присваивание ( gl.enableVertexAttribArray() ).
 */

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
    /**
     * @method gl.drawArrays (mode, first, count)
     * @description Выполняет вершинный шейдер, чтобы нарисовать фигуры, определяемые параметром mode.
     * @param mode - Определяет тип фигуры. Допустимыми значениями являются следующие константы: gl.POINTS, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN.
     * @param first - Определяет номер вершины, с которой должно начинаться рисование (целое число).
     * @param count - Определяет количество вершин (целое число).
     */
    gl.drawArrays(gl.POINTS, 0, n); // n равно 3
}

function initVertexBuffers(gl) {
    /**
     * Float32Array - типизированный массив.
     * Размер одного элемента в байтах - 4.
     * Типизированные массивы не поддерживают методы push() и pop().
     * Методы типизированных массивов.
     * 1. get(index) - возвращает элемент с индексом index.
     * 2. set(index, value) - записывает в элемент с индексом index значение value.
     * 3. set(array, offset) - копирует значения элементов из массива array в данный массив, начиная с элемента с индексом offset.
     * 4. length - число элементов в массиве.
     * 5. BYTES_REP_ELEMENTS - размер одного элемента массива в байтах.
     */
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var n = 3; // Число вершин

    // Создание буферный объект
    /**
     * gl.createBuffer()
     * создает буферный объект
     */
    /**
     * gl.deleteBuffer (buffer)
     * Удаляет буферный объект, заданный параметром buffer.
     * buffer - ссылка на буферный объект, подлежащий удалению.
     */
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Определить тип буферного объекта
    /**
     * gl.bindBuffer(target, buffer)
     * Активирует буферный объект buffer и указывает его тип target.
     * Параметр target:
     * 1. gl.ARRAY_BUFFER - указывает, что буферный объект содержит информацию о вершинах.
     * 2. gl.ELEVENT_ARRAY_BUFFER - указывает, что буферный объект содержит значения индексов, ссылающихся на информацию о вершинах.
     * 3. buffer - ссылка на буферный объект, предварительно созданный вызовом gl.createBuffer(). Если в этом параметре передать null, связь с типом target будет разорвана.
     */
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Записать данные в буферный объект
    /**
     * gl.bufferData(target, data, usage)
     * Выделяет память для буферного объекта и записывает данные data в буферный объект, тип которого определяется параметром target.
     * target - gl.ARRAY_BUFFER или gl.ELEMENT_ARRAY_BUFFER
     * data - данные для записи в буферный объект (типизированный массив)
     * usage - Подсказка о том, как программа собирается использовать данные в буферном объекте. Эта подсказка помогает системе WebGL оптимизировать производительность, но не является страховкой от ошибок в вашей программе.
     * 1. gl.STATIC_DRAW - данные в буферном объекте будут определены один раз и использованы многократно для рисования фигур.
     * 2. gl.STREAM_DRAW - данные в буферном объекте будут определены один раз и использованы лишь несколько раз для рисования фигур.
     * 3. gl.DYNAMIC_DRAW - данные в буферном объекте будут определены многократно и использованы для рисования фигур так же многократно.
     */
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Сохранить ссылку на буферный объект в переменной a_Position
    /**
     * @function gl.vertexAttribPointer (location, size, type, normalized, stride, offset)
     * Присваивает буферный объект типа gl.ARRAY_BUFFER переменной-атрибуту location.
     * @param location - определяет переменную-атрибут, которой будет выполнено присваивание.
     * @param size - определяет число компонентов на вершину в буферном объекте (допустимыми являются значения от 1 до 4). Если значение параметра size меньше числа элементов, требуемых переменной-атрибутом, отсутствующие компоненты автоматически получат значения по умолчанию, как указывается в описании семейства методов gl.vertexAttrib[1234]f().
     * Например, если в параметре передать значение 1, второй и третий компоненты получат значение 0.0, а четвертый элемент – значение 1.0.
     * @param type - определяет формат данных. Может иметь одно из следующих значений:
     * 1. gl.UNSIGNED_BYTE - беззнаковый байт
     * 2. gl.SHORT - короткое целое число со знаком
     * 3. gl.UNSIGNED_SHORT - короткое целое число без знака
     * 4. gl.INT - целое число со знаком
     * 5. gl.UNSIGNED_INT - целое число без знака
     * 6. gl.FLOAT - вещественное число
     * @param normalized - либо true, либо false. Указывает на необходимость нормализации невещественных данных в диапазон [0, 1] или [-1, 1].
     * @param stride - определяет число байтов между разными элементами данных. Значение по умолчанию: 0.
     * @param offset - определяет смещение (в байтах) от начала буферного объекта, где хранятся данные для вершин. Если данные хранятся, начиная с самого начала буфера, в этом параметре следует передать значение 0.
     */
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Разрешить присваивание переменной a_Position
    /**
     * gl.enableVertexAttribArray(location)
     * Разрешает присваивание буферного объекта переменной-атрибуту, определяемой параметром location.
     * location - определяет переменную-атрибут.
     */
    /**
     * gl.disableVertexAttribArray(location)
     * Запрещает присваивание буферного объекта переменной-атрибуту, определяемой параметром location.
     * location - определяет переменную-атрибут
     */
    gl.enableVertexAttribArray(a_Position);

    return n;
}
