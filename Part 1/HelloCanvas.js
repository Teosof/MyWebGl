//HelloCanvas.js
function main() {
    // Получить ссылку на элемент canvas
    var canvas = document.getElementById('webgl');

    // Получить контекст отображения для WebGL
    var g1 = getWebGLContext(canvas); /**
     * Возвращает контекст отображения для WebGL, устанавливает режим отладки и выводит любые сообщения об ошибках в консоль браузера
     */
    if (!g1) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Указать цвет для очистки области рисования canvas
    g1.clearColor(0.0, 0.0, 0.0, 1.0);/**
     * Устанавливает цвет для очистки (заливки) области рисования. Все параметры варьируются от 0.0 до 1.0
     */

    //Очистить canvas
    g1.clear(g1.COLOR_BUFFER_BIT);/**
     * Очищает указанный буфер предварительно определенными значениями. В случае буфера цвета, значение (цвет) устанавливается вызовом метода gl.clearColor()
     */

}