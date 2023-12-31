import Stats from "stats.js";
import Proton from "proton-engine";
import RAFManager from "raf-manager";
import "./styles.css";

let stats;
let canvas;
let context;
let proton;
let renderer;
let emitter;

main();

function main() {
  initCanvas();
  initStats();
  createProton();
  render();
}

function initCanvas() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d");

  window.onresize = function(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    emitter.p.x = canvas.width / 2;
    emitter.p.y = canvas.height / 2;
  };
}

function initStats() {
  stats = new Stats();
  stats.setMode(2);
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0px";
  stats.domElement.style.top = "0px";
  document.body.appendChild(stats.domElement);
}

function createProton() {
  proton = new Proton();
  emitter = new Proton.Emitter();
  emitter.rate = new Proton.Rate(
    new Proton.Span(10, 20),
    new Proton.Span(0.1, 0.25)
  );
  emitter.addInitialize(new Proton.Mass(1));
  emitter.addInitialize(new Proton.Radius(1, 12));
  emitter.addInitialize(new Proton.Life(2, 4));
  emitter.addInitialize(
    new Proton.Velocity(
      new Proton.Span(2, 4),
      new Proton.Span(-30, 30),
      "polar"
    )
  );
  emitter.addBehaviour(new Proton.RandomDrift(30, 30, 0.05));
  emitter.addBehaviour(
    new Proton.Color("ff0000", "random", Infinity, Proton.easeOutQuart)
  );
  emitter.addBehaviour(new Proton.Scale(1, 0.7));
  emitter.p.x = canvas.width / 2;
  emitter.p.y = canvas.height / 2;
  emitter.emit();

  proton.addEmitter(emitter);
  renderer = new Proton.CanvasRenderer(canvas);
  renderer.onProtonUpdate = () => {
    context.fillStyle = "rgba(0, 0, 0, 0.1)";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
  proton.addRenderer(renderer);
}

function render() {
  RAFManager.add(() => {
    stats.begin();
    emitter.rotation += 1.5;
    proton.update();
    stats.end();
  });
}
