import './style.css'
import { gsap } from 'gsap'
import { Rendering } from './rendering'
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { palettes, sinPalettes } from './palettes'
import { getPaletteFromParams, setupControls } from './utils'

// Colors
const paletteKey = getPaletteFromParams('blue')

const palette = palettes[paletteKey]
const sinPalette = sinPalettes[paletteKey]

const sinUniforms = {
  c0: new THREE.Uniform(sinPalette.c0),
  c1: new THREE.Uniform(sinPalette.c1),
  c2: new THREE.Uniform(sinPalette.c2),
  c3: new THREE.Uniform(sinPalette.c3)
}

class Demo {
  constructor () {
    this.rendering = new Rendering(document.querySelector('#canvas'), palette)
    this.controls = new OrbitControls(this.rendering.camera, this.rendering.canvas)

    this.uTime = new THREE.Uniform(0)
    this.init()
  }

  init () {
    const box = new THREE.PlaneGeometry()
    const pos = [
      [0, 0.1],
      [0.2, 0.1],
      [-0.2, 0.15],
      [-0.2, -0.1],
      [-0.4, -0.3]
    ]

    // Draw all the meshes onto the stencil. Each draw inverts the stencil from 1 to 0.
    for (let i = 0; i < 5; i++) {
      const ni = i / 4
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(ni, ni, ni),
        colorWrite: false,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilRef: i,
        stencilWrite: true,
        stencilFail: THREE.InvertStencilOp,
        stencilZFail: THREE.InvertStencilOp,
        stencilZPass: THREE.InvertStencilOp
      })
      const mesh = new THREE.Mesh(box, mat)
      mesh.position.x += pos[i][0]
      mesh.position.y += pos[i][1]
      mesh.position.z += i * 0.01 + 0.01
      this.rendering.scene.add(mesh)
    }

    // Draw the color background only if the stencil matches the stencilRef
    // If you wanted colors, create one mesh for the 0 ref and one mesh for the 1 ref
    const mat = new THREE.MeshBasicMaterial({
      colorWrite: true,
      stencilRef: 0,
      stencilFunc: THREE.EqualStencilFunc,
      stencilWrite: true,
      depthTest: false
    })

    const mesh = new THREE.Mesh(box, mat)
    // This mesh needs to be drawn after all the other meshes. depthTest:false renderOrder = 10
    mesh.renderOrder = 10
    mesh.scale.setScalar(2)

    this.rendering.scene.add(mesh)

    this.addEvents()
  }

  addEvents () {
    gsap.ticker.add(this.tick)
  }

  tick = (time, delta) => {
    this.uTime.value += delta
    this.rendering.render()
  }
}

const demo = new Demo()

setupControls(paletteKey)
