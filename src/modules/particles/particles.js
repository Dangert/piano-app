import noteA from './note_a.png'
import noteB from './note_b.png'
import clef from './clef.png'

var ParticlesParams = {
  "particles": {
      "number": {
          "value": 8,
          "density": {
              "enable": true,
              "value_area": 800
          }
      },
      "line_linked": {
          "enable": false
      },
      "move": {
          "speed": 1,
          "out_mode": "out"
      },
      "shape": {
          "type": [
              "image",
              "circle"
          ],
          "image": [
              {
                  "src": noteA,
                  "height": 20,
                  "width": 20
              },
              {
                  "src": noteB,
                  "height": 20,
                  "width": 20
              },
              {
                  "src": clef,
                  "height": 20,
                  "width": 20
              }
          ]
      },
      "color": {
          "value": "#CCC"
      },
      "size": {
          "value": 10,
          "random": false,
          "anim": {
              "enable": true,
              "speed": 4,
              "size_min": 10,
              "sync": false
          }
      }
  },
  "retina_detect": false
}

export default ParticlesParams;
