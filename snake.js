var canvas = document.querySelector('#content');
var context = canvas.getContext('2d');
var direction = {x: 10, y: 0};
var lastTime = 0;
var keys = {
  '37': {x: -10, y: 0},
  '38': {x: 0, y: -10},
  '39': {x: 10, y: 0},
  '40': {x: 0, y: 10}
};

var snake = {
  head: {x: 30, y: 150},
  body: [
    {x: 20, y: 150},
    {x: 10, y: 150},
  ]
};
var food = spawnFood();

function drawSnake(snake) {
  var head = snake.head, body = snake.body;
  context.fillRect(head.x, head.y, 10, 10);
  body.forEach(function(block) {
    context.fillRect(block.x, block.y, 10, 10);
  });
}

function clearCanvas() {
  context.clearRect(0, 0, 300, 300);
}

function moveSnake(snake) {
  var head = snake.head, body = snake.body;
  var newHead = {x: head.x + direction.x, y: head.y + direction.y};
  var newBody = [head].concat(body.slice(0, -1));
  return {head: newHead, body: newBody};
}

function update(snake) {
  if (new Date().getTime() - 60 > lastTime) {
    if (isCollision(snake)) {
      context.fillText('Game over', 125, 100);
      return;
    } else {
      lastTime = new Date().getTime();
      clearCanvas();
      snake = moveSnake(snake);
      if (snake.head.x === food.x && snake.head.y === food.y) {
        snake = eatFood(snake);
        food = spawnFood();
      }
      drawSnake(snake);
      context.fillRect(food.x, food.y, 10, 10);
    }
  }
  requestAnimationFrame(function() {
    update(snake);
  });
}

function switchDirection(event) {
  if (keys[event.keyCode]) {
    direction = keys[event.keyCode];
  }
}

function eatFood(snake) {
  var tail = snake.body.slice(-1), beforeTail = snake.body.slice(-2, -1);
  var tailDirection = {x: beforeTail.x - tail.x, y: beforeTail.y - tail.y};
  var newTail = {x: tail.x - tailDirection.x, y: tail.y - tailDirection.y};
  return {head: snake.head, body: snake.body.concat(newTail)};
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 30) * 10,
    y: Math.floor(Math.random() * 30) * 10
  };
}

function isCollision(snake) {
  return snake.head.x < 0 || snake.head.y < 0 ||
    snake.head.x >= 300 || snake.head.y >= 300 || 
    snake.body.some(function(block) {
      return block.x === snake.head.x && block.y === snake.head.y;
    });
}

addEventListener('keydown', switchDirection);

update(snake);

