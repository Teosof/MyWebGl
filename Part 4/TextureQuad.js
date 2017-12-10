// TextureQuad.js
/**
 * Тексель - элемент текстуры - пиксель, составляющий текстуру. Каждый тексель хранит информацию о своем цвете.
 * Наложение текстуры:
 * 1) Подготовка изображения для наложения на геометрическую фигуру
 * 2) Определение метода наложения
 * 3) Загрузка изображения текстуры и настройка его для использования в WebGL
 * 4) Извлечение текселей из изображения во фрагментном шейдере и установка цвета соответствующих фрагментов
 * 
 * Часть фигуры, предназначенная для покрытия текстурой, определяется путем определения координат вершин на поверхности фигуры. Часть изображения текстуры, которая будет использоваться, определяется координатами текстуры.
 * 
 * Система координат st. S ~ X, T ~ Y
 * 
 * Работа над наложением текстуры
 * Часть 1: прием координат текстуры в вершинный шейдер и передача их во фрагментный шейдер.
 * Часть 2: наложение изображения текстуры на геометрическую фигуру во фрагментном шейдере.
 * Часть 3: определение координат текстуры (initVertexBuffers()).
 * Часть 4: подготовка к загрузке изображения текстуры и передача браузеру требования загрузить его (initTextures()).
 * Часть 5: настройка загруженной текстуры к использованию в WebGL (loadTexture()).
 */

/* Часть 1 */
/** 
 * @description значения varying-переменных с теми же именами и типами автоматически копируются между вершинным и фрагментным шейдерами. Координаты текстуры интерполируются между вершинами 
 * @description uniform-переменные предназначены для передачи «общих» (uniform) данных, поэтому в программах они должны использоваться только для передачи таких данных.*/

/**
 * @function vec4 texture2D (sampler2D sampler, vec2 coord) Возвращает цвет текселя в текстуре sampler с координатами coord.
 * @param sampler Определяет номер текстурного слота.
 * @param coord Определяет координаты текселя текстуры.
 */
var vshader_src =
    `attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
  gl_Position = a_Position;
  v_TexCoord = a_TexCoord;
}`;

/* Часть 2 */
var fshader_src =
    `precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    //gl_FragColor = vec4(1, 0, 0, 1);
}`;

function main() {
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    if (!gl) {
        alert("Failed at getWebGLContext");
        return;
    }

    if (!initShaders(gl, vshader_src, fshader_src)) {
        alert("Failed at initShaders");
        return;
    }
    // Определить информацию о вершине и определить текстурыА
    var n = initVertexBuffers(gl);
    initTextures(gl, n);
}
/* Часть 3 */
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        /* Первые две колонки - координаты вершины, вторые две колонки - координаты текстуры */
        0.5, 0.5, 0.0, 1.0, 
        -0.5, 0.5, 0.0, 0.0,
        0.5, -0.5, 1.0, 1.0, 
        -0.5, -0.5, 1.0, 0.0,
    ]);
    /**
     * @param FSIZE - размер одного элемента массива verticeSizes
    */
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    /* Число вершин */
    var n = 4;

    /* Создание буферного объекта */
    var vertexTexCoordBuffer = gl.createBuffer();
    /* Запись координат вершин и ткстуры в буферный объект */
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    /**
     * @method vertexAttribPoiner Присваивает буферный объект типа gl.ARRAY_BUFFER переменной-атрибуту location
     * @param location определяет переменную-атрибут, которой будет выполнено присваивание
     * @param size определяет число компонентов на вершину в буферном объекте (допустимые значения от 1 до 4)
     * @param type определяет формат данных
     * @param normalized либо true, либо false. Указаывает на необходимость нормализации невещественных данных в диапазоне [0, 1] или [-1, 1]
     * @param stride определяет длину шага (в байтах) для извлечения информации об одной вершине, то есть, число байтов между разными элементами данных
     * @param offset определяет смещение (в байтах) от начала буферного объекта, где хранятся данные для вершин. Если данные хранятся, начиная с самого начала буфера, в этом параметре следует передать значение 0.
     */
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    /* Записать координаты текстуры в переменную a_TexCoord и разрешить её */
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}
/* Часть 4 */
function initTextures(gl, n) {
    /* Создать объект текстуры */
    /**
     * @method createTexture() создает объект текстуры для хранения изображения
     * @method deleteTexture() удалет объект текстуры texture
     * @param texture ссылка на объект текстуры, подлежайший удалению
     */
    var texture = gl.createTexture();
    /* Получить ссылку на u_Sampler */
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    /* Создать объект иображения */
    var img = new Image();
    /* Зарегистрировать обработчик, вызываемый после загрузки изображения */
    /**
     * @description текстура загружается асинхронно
     * 1) Потребовать от браузера вызвать loadTexture() после загрузки изображения
     * 2) Потребовать от браузера загрузить изображение
     * 3) Запрос к веб-серверу на получение изображения
     * 4) Загрузка изображения
     * 5) Получение изображения заврешено
     * 6) Загрузка изображения завершена
     * 7) Вызов loadTexture()
     */
    img.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, img);
    };
    /* Заставить браузер загрузить изображение */
    img.src = "../resource/sky.jpg";

    return true;
}
/* Часть 5 */
function loadTexture(gl, n, texture, u_Sampler, img) {
    /* Повернуть ось Y изображения */
    /**
    * @method pixelStorei (pname, param) выполняет операцию, определяемую параметрами pname и param, после загрузки изображения
    * @param pname может принимать одно из значений:
    @param gl.UNPACK_FLIP_Y_WEBGL Поворачивает ось Y изображения. Значение по умолчанию false.
    @param gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL Умножает каждую составляющую цвета в формате RGB на значение составляющей 2 (альфа-канала). Значение по умолчанию false. 
    * @param param Целочисленное ненулевое значение соответствует true, нулевое значение соответствует false.
    */
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    /* Выбрать текстурный слот 0 */
    /**
     * @method activeTexture(texUnit) выбирает (активизирует) текстурный слот texUnit
     * @param texUnit Определяет выбираемый текстурный слот (один из восьми). Число в конце имени соответствует порядковому номеру текстурного слота
     */
    gl.activeTexture(gl.TEXTURE0);
    /* Указать тип объекта текстуры */
    /**
     * @method bindTexture (target, texture) Активизирует объект текстуры texture и указывает его тип target. Кроме того, если прежде, вызовом gl.activeTexture(), был активизирован текстурный слот, объект текстуры также будет связан с активным слотом.
     * @param target может принимать одно из значений:
     @param TEXTURE_2D 2-мерная (плоская текстура)
     @param TEXTURE_CUBE_MAP кубическая текстура
     * @param texture объект текстуры, тип которого требуется указать
     */
    gl.bindTexture(gl.TEXTURE_2D, texture);
    /* Определить параметры текстуры */
    /**
     * @method texParameteri (target, pname, param) Присваивает значение param параметру текстуры pname в объекте текстуры с типом target
     * @param target может принимать одно из значений:
     @param TEXTURE_2D 2-мерная (плоская текстура)
     @param TEXTURE_CUBE_MAP кубическая текстура
     * @param pname имя параметра текстуры
     * @param param значение параметра с именем pname
     */
    /**
     * @param gl.TEXTURE_MAG_FILTER метод увеличения изображения текстуры, когда размеры фигуры, на которую она накладывается, оказываются больше размеров текстуры. @constant gl.LINEAR Используется среднее взвешенное по четырем текселям, ближайшим к центру текстурируемого пикселя. (Этот метод обеспечивает более высокое качество)
     * @param gl.TEXTURE_MIN_FILTER метод уменьшения изображения текстуры, когда размеры фигуры, на которую она накладывается, оказываются меньше размеров текстуры. @constant gl.NEAREST Используется значение текселя, ближайшего  к центру текстурируемого пикселя.
     * @param gl.TEXTURE_WRAP_S параметр определяет, как должны заполняться пустые области слева и справа от подобласти фигуры, на которую наложена текстура:
     @constant gl.REPEAT, 
     @constant gl.MIRRORED_REPEAT, 
     @constant gl.CLAMP_TO_EDGE
     * @param gl.TEXTURE_WRAP_T параметр определяет, как должны заполняться пустые области сверху и снизу от подобласти фигуры, на которую наложена текстура: 
     @constant gl.REPEAT Использовать изображение текстуры повторно. 
     @constant gl.MIRRORED_REPEAT Использовать изображение текстуры повторно с отражением. 
     @constant gl.CLAMP_TO_EDGE Использовать цвет края изображения текстуры.
     */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    /* Определить изображение текстуры */
    /**
     * @method texImage2D (target, level, internalformat, format, type, image) присваивает изображение image объекту текстуры с типом target.
     * @param target может принимать одно из значений:
     @param TEXTURE_2D 2-мерная (плоская текстура)
     @param TEXTURE_CUBE_MAP кубическая текстура
     * @param level параметр используется совместно с MIP-текстурами
     * @description Текстура в формате MIPMAP (или MIP-текстура) представляет собо последовательность текстур, расположенных в порядке  уменьшения разрешения одного и того же изображения.
     * @param internalformat Определяет внутренний формат изображения:
     @const gl.RGB (red, green, blue) 
     @const gl.RGBA (red, green, blue, alpha) 
     @const gl.ALPHA (0.0, 0.0, 0.0, alpha) 
     @const gl.LUMINANCE (L, L, L, 1), где L – Luminance (светимость) 
     @const gl.LUMINANCE_ALPHA (L, L, L, alpha)
     * @param format Определяет формат данных с информацией о текселях. Должен иметь то же значение, что и internalformat.
     * @param type Определяет тип данных с информацией о текселях:
     @constant gl.UNSIGNED_BYTE Компоненты RGB представлены беззнаковыми байтами – каждый компонент представлен одним байтом.
     @constant gl.UNSIGNED_SHORT_5_6_5 RGB: компоненты RGB представлены 5, 6 и 5 битами, соответственно.    
     @constant gl.UNSIGNED_SHORT_4_4_4_4 RGBA: компоненты RGBA представлены 4, 4, 4 и 4 битами, соответственно.
     @constant  gl.UNSIGNED_SHORT_5_5_5_1 RGBA: компоненты RGB представлены 5 битами, а альфа-канал – одним битом.
     * @param image Объект изображения, содержащий текстуру.
     */
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    /* Определить указатель на текстурный слот 0*/
    /**
     * @constant sampler2D Тип данных для текстур типа gl.TEXTURE_2D.
     * @constant sampleCube Тип данных для текстур типа gl.TEXTURE_CUBE_MAP.
     */
    gl.uniform1i(u_Sampler, 0);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    /* Нарисовать прямоугольник */
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}