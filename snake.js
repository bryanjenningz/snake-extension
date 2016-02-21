var context = document.querySelector('#content').getContext('2d'), direction = {x: 10, y: 0},
  keys = {'37': {x: -10, y: 0}, '38': {x: 0, y: -10}, '39': {x: 10, y: 0}, '40': {x: 0, y: 10}},
  snake = [{x: 30, y: 150}, {x: 20, y: 150}, {x: 10, y: 150}], lastTime = 0, food = spawnFood();

function drawSnake(snake) {
  snake.forEach(function(block) { context.fillRect(block.x, block.y, 10, 10); });
}
function moveSnake(snake) {
  var head = snake[0], newBody = snake.slice(0, -1);
  var newHead = {x: head.x + direction.x, y: head.y + direction.y};
  return [newHead].concat(newBody);
}
function update(snake) {
  if (new Date().getTime() - 60 > lastTime) {
    if (isCollision(snake)) {
      context.fillText('Game over', 125, 100);
      return;
    } else {
      lastTime = new Date().getTime();
      context.clearRect(0, 0, 300, 300);
      snake = moveSnake(snake);
      if (snake[0].x === food.x && snake[0].y === food.y) {
        snake = eatFood(snake);
        food = spawnFood();
      }
      drawSnake(snake);
      context.fillRect(food.x, food.y, 10, 10);
    }
  }
  requestAnimationFrame(function() { update(snake); });
}
function switchDirection(event) {
  if (keys[event.keyCode]) direction = keys[event.keyCode];
}
function eatFood(snake) {
  var tail = snake.slice(-1), beforeTail = snake.slice(-2, -1);
  var tailDirection = {x: beforeTail.x - tail.x, y: beforeTail.y - tail.y};
  var newTail = {x: tail.x - tailDirection.x, y: tail.y - tailDirection.y};
  return snake.concat(newTail);
}
function spawnFood() {
  return {x: Math.floor(Math.random() * 30) * 10, y: Math.floor(Math.random() * 30) * 10};
}
function isCollision(snake) {
  return snake[0].x < 0 || snake[0].y < 0 ||
    snake[0].x >= 300 || snake[0].y >= 300 || 
    snake.slice(1).some(function(block) {
      return block.x === snake[0].x && block.y === snake[0].y;
    });
}

addEventListener('keydown', switchDirection);
update(snake);
