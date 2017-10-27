// DrawRectangle.js
function main() {

    // (1)
    // Получить ссылку на элемент <canvas>
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retieve the <canvas> element');
        return;
    }

    // (2)
    // Получить двумерный контекст изображения
    var ctx = canvas.getContext("2d");  // TODO: проверка ошибок

    // (3)
    // Нарисовать синий квадрат
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // выбрать синий цвет
    ctx.fillRect(120, 10, 150, 150) // выполнить заливку квадрата
    // rgba - red green blue alpha transparency
    // 1, 2 параметры - координаты левого верхнего угла
    // 3, 4 параметры - ширина и высота квадрата (в пикселях)
}