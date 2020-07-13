const c = document.createElement("canvas");
const ctx = c.getContext("2d");
c.width = 500;
c.height = 350;
document.body.appendChild(c);

let perm = [];
while (perm.length < 255) {
  perm.push(Math.floor(Math.random() * 255));
}

const lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;
const noise = (x) => {
  x = (x * 0.01) % 255;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
};

const player = new (function () {
  this.x = c.width / 2;
  this.y = 0;
  this.ySpeed = 0;
  this.rot = 0;

  this.img = new Image();
  this.img.src = "bike.png";
  this.draw = function () {
    const p1 = c.height - noise(t + this.x) * 0.25;
    if (p1 - 15 > this.y) this.ySpeed += 0.1;
    else {
      this.ySpeed -= this.y - (p1 - 15);
      this.y = p1 - 15;
    }
    this.y += this.ySpeed;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.drawImage(this.img, -15, -15, 30, 30);
    ctx.restore();
  };
})();

let t = 0;
function loop() {
  t += 5;
  ctx.fillStyle = "#19f";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, c.height);
  for (let i = 0; i < c.width; i++)
    ctx.lineTo(i, c.height - noise(t + i) * 0.25);
  ctx.lineTo(c.width, c.height);
  ctx.fill();

  player.draw();
  requestAnimationFrame(loop);
}
loop();
