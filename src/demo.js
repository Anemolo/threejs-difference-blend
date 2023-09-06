import "./style.css"
import { gsap } from "gsap"
import { Rendering } from "./rendering"
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { palettes, sinPalettes } from "./palettes";

// Colors 
let paletteKey = getPaletteFromParams("blue")

let palette = palettes[paletteKey]
let sinPalette = sinPalettes[paletteKey]

class Demo {
  constructor(){
    this.rendering = new Rendering(document.querySelector("#canvas"), palette)
    this.controls = new OrbitControls(this.rendering.camera, this.rendering.canvas)

    this.init()
  }
  init(){
    const box = new THREE.BoxGeometry()
    const mat = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(box, mat)

    this.rendering.scene.add(mesh)

    this.addEvents()
  }
  addEvents(){
    gsap.ticker.add(this.tick)
  }
  tick = ()=>{
    this.rendering.render()
  }
}

let demo = new Demo()

setupControls(paletteKey)
