(() => {
  "use strict";
  const dialog = document.querySelector("#putting");
  const canvas = document.querySelector("#green");
  const ctx = canvas.getContext("2d");
  const aim = document.querySelector("#aim");
  const power = document.querySelector("#power");
  const putt = document.querySelector("#putt");
  const note = document.querySelector("#play-note");
  const strokesText = document.querySelector("#strokes");
  const edges = [[57,115],[147,54],[755,54],[884,95],[884,263],[776,347],[223,347],[57,293]];
  const bumpers = [{x:405,y:233,r:36},{x:561,y:115,r:29}];
  const tee = {x:140,y:261};
  const cup = {x:795,y:140};
  const radius = 8;
  const ball = {x:tee.x,y:tee.y,vx:0,vy:0};
  let strokes = 0;
  let state = "aim";
  let frame = 0;
  let lastTime = 0;

  function polygon(context, offset = 0) {
    context.beginPath();
    edges.forEach(([x,y],i) => i ? context.lineTo(x,y + offset) : context.moveTo(x,y + offset));
    context.closePath();
  }

  function disc(context,x,y,r,fill) {
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2);
    context.fillStyle = fill;
    context.fill();
  }

  // Bake the turf and wood grain once. A shot only redraws its moving parts.
  const background = document.createElement("canvas");
  background.width = canvas.width;
  background.height = canvas.height;
  const paint = background.getContext("2d");
  paint.fillStyle = "#0e211b";
  paint.fillRect(0,0,940,428);
  paint.lineJoin = "round";
  for (let depth = 13; depth >= 0; depth--) {
    polygon(paint,depth);
    paint.strokeStyle = depth % 3 ? "#9b6b42" : "#725238";
    paint.lineWidth = 10;
    paint.stroke();
  }
  polygon(paint);
  const felt = paint.createLinearGradient(0,40,760,340);
  felt.addColorStop(0,"#48895f");
  felt.addColorStop(.58,"#397a50");
  felt.addColorStop(1,"#245c40");
  paint.fillStyle = felt;
  paint.fill();
  paint.save();
  paint.clip();
  for (let x=-300; x<940; x+=108) {
    paint.fillStyle = "rgba(231,255,183,.042)";
    paint.beginPath();
    paint.moveTo(x,0); paint.lineTo(x+52,0); paint.lineTo(x+290,428); paint.lineTo(x+238,428);
    paint.fill();
  }
  let seed = 317;
  function random() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (let i=0; i<15000; i++) {
    paint.fillStyle = i%2 ? "rgba(255,255,207,.14)" : "rgba(8,36,22,.16)";
    paint.fillRect(random()*940,random()*428,1.15,1);
  }
  paint.restore();
  polygon(paint);
  paint.lineWidth = 5;
  paint.strokeStyle = "#d8b181";
  paint.stroke();
  paint.save();
  paint.setLineDash([4,5]);
  paint.strokeStyle = "#e1e5bf77";
  paint.strokeRect(tee.x-21,tee.y-26,42,52);
  paint.restore();
  for (const bumper of bumpers) {
    disc(paint,bumper.x+4,bumper.y+7,bumper.r,"#153e2c99");
    disc(paint,bumper.x,bumper.y+2,bumper.r,"#87401f");
    disc(paint,bumper.x,bumper.y-2,bumper.r,"#f1854f");
    for (let r=bumper.r-5; r>2; r-=5) {
      paint.strokeStyle = "#a8582a80";
      paint.beginPath(); paint.arc(bumper.x,bumper.y-2,r,0,Math.PI*2); paint.stroke();
    }
  }
  disc(paint,cup.x,cup.y,15,"#9bb588");
  disc(paint,cup.x,cup.y+1,12.5,"#101e18");
  paint.strokeStyle = "#e8e6c8";
  paint.lineWidth = 2;
  paint.beginPath(); paint.moveTo(cup.x+7,cup.y); paint.lineTo(cup.x+7,cup.y-59); paint.stroke();
  paint.fillStyle = "#ff7950";
  paint.beginPath(); paint.moveTo(cup.x+8,cup.y-59); paint.lineTo(cup.x+46,cup.y-50); paint.lineTo(cup.x+8,cup.y-40); paint.fill();

  function draw() {
    ctx.drawImage(background,0,0);
    if (state === "won") return;
    const angle = Number(aim.value) * Math.PI / 180;
    if (state === "aim") {
      const length = 42 + Number(power.value)*.9;
      ctx.save(); polygon(ctx); ctx.clip();
      ctx.strokeStyle = "#e9ffb7";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5,7]);
      ctx.beginPath(); ctx.moveTo(ball.x,ball.y);
      ctx.lineTo(ball.x+Math.cos(angle)*length,ball.y+Math.sin(angle)*length);
      ctx.stroke(); ctx.restore();
    }
    disc(ctx,ball.x+2.5,ball.y+4,radius,"#14372599");
    const light = ctx.createRadialGradient(ball.x-3,ball.y-4,1,ball.x,ball.y,9);
    light.addColorStop(0,"#fff"); light.addColorStop(.6,"#faf9dd"); light.addColorStop(1,"#a9b39c");
    disc(ctx,ball.x,ball.y,radius,light);
  }

  function setControls() {
    aim.disabled = power.disabled = state !== "aim";
    putt.disabled = state === "moving";
    putt.textContent = state === "won" ? "Play again" : "Putt →";
    document.querySelector("#aim-val").value = aim.value + "°";
    document.querySelector("#power-val").value = power.value + "%";
    strokesText.textContent = strokes;
  }

  function restart() {
    cancelAnimationFrame(frame);
    Object.assign(ball,{x:tee.x,y:tee.y,vx:0,vy:0});
    strokes = 0;
    state = "aim";
    aim.value = -10; power.value = 65;
    note.textContent = "Tap the green to aim, or use the controls below.";
    setControls(); draw();
  }

  function bounce(nx,ny,penetration) {
    ball.x += nx*penetration; ball.y += ny*penetration;
    const normalSpeed = ball.vx*nx + ball.vy*ny;
    if (normalSpeed < 0) {
      ball.vx -= 1.78*normalSpeed*nx;
      ball.vy -= 1.78*normalSpeed*ny;
    }
  }

  function advance(dt) {
    ball.x += ball.vx*dt; ball.y += ball.vy*dt;
    for (let i=0; i<edges.length; i++) {
      const [x,y] = edges[i];
      const next = edges[(i+1)%edges.length];
      const dx=next[0]-x, dy=next[1]-y;
      const length=Math.hypot(dx,dy), nx=-dy/length, ny=dx/length;
      const distance=(ball.x-x)*nx+(ball.y-y)*ny;
      if (distance<radius) bounce(nx,ny,radius-distance);
    }
    for (const obstacle of bumpers) {
      const dx=ball.x-obstacle.x, dy=ball.y-obstacle.y, distance=Math.hypot(dx,dy);
      if (distance<obstacle.r+radius && distance>0) bounce(dx/distance,dy/distance,obstacle.r+radius-distance);
    }
    const speed = Math.hypot(ball.vx,ball.vy);
    if (Math.hypot(ball.x-cup.x,ball.y-cup.y)<14 && speed<360) {
      state = "won";
      note.textContent = strokes === 1 ? "Hole in one!" : "Holed in " + strokes + " strokes.";
      setControls(); return;
    }
    const remainingSpeed = Math.max(0,speed-228*dt);
    if (remainingSpeed<3) {
      state = "aim"; ball.vx=ball.vy=0;
      aim.value = Math.round(Math.atan2(cup.y-ball.y,cup.x-ball.x)*180/Math.PI);
      note.textContent = "Line up your next putt."; setControls(); return;
    }
    ball.vx *= remainingSpeed/speed; ball.vy *= remainingSpeed/speed;
  }

  function animate(time) {
    const elapsed=Math.min(.05,Math.max(0,(time-lastTime)/1000));
    lastTime=time;
    const steps=Math.max(1,Math.ceil(elapsed*180));
    for (let i=0;i<steps && state==="moving";i++) advance(elapsed/steps);
    draw();
    if (state==="moving" && dialog.open) frame=requestAnimationFrame(animate);
  }

  function shoot() {
    if (state === "won") { restart(); return; }
    if (state !== "aim") return;
    const angle=Number(aim.value)*Math.PI/180, speed=Number(power.value)*7;
    ball.vx=Math.cos(angle)*speed; ball.vy=Math.sin(angle)*speed;
    strokes++; state="moving"; note.textContent="Ball in play."; setControls();
    lastTime=performance.now(); frame=requestAnimationFrame(animate);
  }

  canvas.addEventListener("pointerdown",event => {
    if (state!=="aim") return;
    const rect=canvas.getBoundingClientRect();
    const dx=(event.clientX-rect.left)*canvas.width/rect.width-ball.x;
    const dy=(event.clientY-rect.top)*canvas.height/rect.height-ball.y;
    aim.value=Math.round(Math.atan2(dy,dx)*180/Math.PI);
    power.value=Math.min(100,Math.round(Math.sqrt(456*Math.hypot(dx,dy))/7));
    setControls(); draw();
  });
  for (const input of [aim,power]) input.addEventListener("input",() => { setControls(); draw(); });
  putt.addEventListener("click",shoot);
  document.querySelector("#reset-shot").addEventListener("click",restart);
  document.querySelector("[data-play]").addEventListener("click",() => { dialog.showModal(); restart(); });
  document.querySelector(".close-game").addEventListener("click",() => dialog.close());
  dialog.addEventListener("close",() => cancelAnimationFrame(frame));
})();
