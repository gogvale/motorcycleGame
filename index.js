let values_arr = [];
function randomValue(){
  return Math.floor(Math.random() * 255)
}

function startGame(){
  document.getElementById("title").remove();
  document.getElementById("startButton").remove();
  document.getElementById("instructions").remove();
  document.getElementById("score").hidden = false;

  const score = document.getElementById("score_number");

  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  c.width = 1024;
  c.height = 768;
  document.getElementById("start").appendChild(c);

  let perm = [];
  const ul = document.getElementById("values_list")
  while (perm.length < 255) {
    i = randomValue();
    perm.push(i);
    li = document.createElement("li");
    li.textContent = i;
    ul.appendChild(li);
  }
  values_arr = perm;

  const lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;
  const noise = (x) => {
    x = (x * 0.01) % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
  };

  const player = new (function () {
    this.playedBefore = false;
    this.reset = () => {
      if(this.playedBefore){
        ans = confirm(`Fin de Juego. Tu puntaje fue de ${score.textContent}. Desea jugar otra vez?`)
        if(!ans) gameOver()
        else score.textContent = 0;
      } 
      this.x = c.width / 2;
      this.y = 0;
      this.ySpeed = 0;
      this.rot = 0;
      this.rSpeed = 0;
      this.playedBefore = true;
    };

    this.reset();
    this.img = new Image();
    this.bg = new Image();
    this.img.src = "img/scooter.png";
    this.bg.src = "img/backgroundForest.png";
    
    
    this.draw = function () {
      ctx.drawImage(this.bg, 0,0);
      const p1 = c.height - noise(t + this.x) * 0.25;
      const p2 = c.height - noise(t + 5 + this.x) * 0.25;

      let grounded = 0;

      if (p1 - 15 > this.y) {
        this.ySpeed += 0.1;
      }
      else {
        this.ySpeed -= this.y - (p1 - 15);
        this.y = p1 - 15;
        grounded = 1;
      }

      if (playing || (grounded && Math.abs(this.rot) > Math.PI * 0.5)) {
        playing = false;
        this.rSpeed = 0;
        k.ArrowUp = 1;
        this.x -= speed * 5;
      }

      const angle = Math.atan(p2 - 15 - this.y, 5);
      this.y += this.ySpeed;

      if (grounded && playing) {
        this.rot -= (this.rot - angle) * 0.5;
        this.rSpeed -= angle - this.rot;
      }
      this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;

      this.rot -= this.rSpeed * 0.1;
      if (this.rot > Math.PI) this.rot = -Math.PI;
      if (this.rot < -Math.PI) this.rot = Math.PI;
        
      if(
        this.rot !== 0 && 
        this.y !== 0 && 
        !(grounded && 
          Math.abs(this.rot) > Math.PI * 0.5)) score.textContent = +score.textContent + 1;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.drawImage(this.img, -15, -15, 30, 30);
      ctx.restore();
    };
  })();

  let t = 0;
  let speed = 0;
  let playing = true;
  const k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
  function loop() {
    if (player.x < 0) player.reset();
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
    t += 10 * speed;
    // ctx.fillStyle = "#19f";
    // ctx.fillRect(0, 0, c.width, c.height);

    player.draw();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width; i++)
      ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    
    ctx.fillStyle = "#a7d1d2";
    ctx.beginPath();
    ctx.moveTo(0, c.height/2);
    ctx.lineTo(30, c.height );
    ctx.lineTo(0, c.height );
    ctx.fill();

    requestAnimationFrame(loop);
  }
  onkeydown = (d) => (k[d.key] = 1);
  onkeyup = (d) => (k[d.key] = 0);

  loop();
  function gameOver(){
    c.remove();
    document.getElementById("gameOver").style.visibility = "visible"
  }
}
