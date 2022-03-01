<template>
    <div id="moveBar" class="fab">
    <span class="fab-action-button" @click="showToolbar = !showToolbar">
      <i class="material-icons fab-action-button-icon">
        create
      </i>
    </span>
    <transition name="fade">
      <div class='toolbar' v-if="showToolbar">
        <ul class="items">
          <li class="item">
            <a class="menu-item" data-tooltip="Draw" v-bind:class="{ active: accessibilityStates.pen }" @click="toggleState('pen')" :aria-label="pen">
              <span class="material-icons menu-item-icon">
                brush
              </span>
            </a>
          </li>
          <li>
            <a class="menu-item" data-tooltip="Erase" v-bind:class="{ active: accessibilityStates.erase }" @click="toggleState('erase')" :aria-label="Eraser">
              <i class="material-icons menu-item-icon">
                backspace
              </i>
            </a>
          </li>
          <li>
            <a class="menu-item" data-tooltip="Text" v-bind:class="{ active: accessibilityStates.text }" @click="toggleState('text')" :aria-label="Text">
              <i class="material-icons menu-item-icon">
                font_download
              </i>
            </a>
          </li>
           <li>
            <a class="menu-item" data-tooltip="Delete" v-bind:class="{ active: accessibilityStates.deleteTool}" @click="toggleState('deleteTool')" :aria-label="Delete">
              <i class="material-icons menu-item-icon">delete</i>
            </a>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'ToolBar',
  props: {
    pen: {
      type: String,
      default: "Invert Colors"
    },
    erase: {
      type: String,
      default: "Highlight Links"
    },
    done: {
      type: String,
      default: "Done"
    },
    textText: {
      type: String,
      default: "Increase Text Size"
    },
    toolCode: {
      type: Number,
      default: "ToolCode"
    }
  },
  data() {
    return {
      accessibilityStates: {
        pen: false,
        erase: false,
        text: false,
        done: false
      },
      showToolbar: false,
      toolCode: 0,
      pos1 : 0, 
      pos2 : 0, 
      pos3 : 0, 
      pos4 : 0
    }
  },
  methods: {
    toggleState(state) {
      this.accessibilityStates[state] = !this.accessibilityStates[state];
      this.applyState(state)
      if (this.accessibilityStates.pen = true) {
        this.accessibilityStates.erase = false;
        this.accessibilityStates.text = false;
      }
      else if (this.accessibilityStates.erase = true) {
        this.accessibilityStates.pen = false;
        this.accessibilityStates.text = false;
      }
      
      



      
      
    },
    applyState(state) {
      if (state === "pen") {
        toolCode = 0
      } else if (state === "erase") {
        toolCode = 1
      } else if (state === "text") {
        toolCode = 2
      }},
      



    dragElement(moveBar) {
  if (document.getElementById("moveBar")) {
    moveBar.onmousedown = dragMouseDown;
  }},

  dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  },

  elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    moveBar.style.top = (moveBar.offsetTop - pos2) + "px";
    moveBar.style.left = (moveBar.offsetLeft - pos1) + "px";
  },

  closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

},
  computed: {
    links() {
      return [...document.querySelectorAll('a')]
    }
  },
  mounted() {
    if (localStorage.getItem('settings')) {
      this.accessibilityStates = JSON.parse(localStorage.getItem('settings'))
      for (var state in this.accessibilityStates) {
        if (this.accessibilityStates[state]) this.applyState(state)
      }
    }
  },
  watch: {
    accessibilityStates: {
      handler() {
        localStorage.setItem('settings', JSON.stringify(this.accessibilityStates));
      },
      deep: true,
    },
  }
}
</script>

<style scoped>
  ul {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }
  [data-tooltip] {
    position: relative;
    z-index: 2;
    cursor: pointer;
  }

  /* Hide the tooltip content by default */
  [data-tooltip]:before,
  [data-tooltip]:after {
    visibility: hidden;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
    opacity: 0;
    pointer-events: none;
  }

  /* Position tooltip above the element */
  [data-tooltip]:before {
    position: absolute;
    bottom: 105%;
    left: 50%;
    margin-bottom: 5px;
    margin-left: -80px;
    padding: 7px;
    width: 160px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color: #000;
    background-color: hsla(0, 0%, 20%, 0.9);
    color: #fff;
    content: attr(data-tooltip);
    text-align: center;
    font-size: 14px;
    line-height: 1.2;
  }

  /* Triangle hack to make tooltip look like a speech bubble */
  [data-tooltip]:after {
    position: absolute;
    bottom: 105%;
    left: 50%;
    margin-left: -5px;
    width: 0;
    border-top: 5px solid #000;
    border-top: 5px solid hsla(0, 0%, 20%, 0.9);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    content: " ";
    font-size: 0;
    line-height: 0;
  } 
 

  /* Show tooltip content on hover */
  [data-tooltip]:hover:before,
  [data-tooltip]:hover:after {
    visibility: visible;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
    filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
    opacity: 1;
  }

  .items {
    list-style-type: none;
  }
  .toolbar {
    width: 300px;
    position: absolute;
    left: 65px;
    bottom: 50%;
    margin-bottom: 2px;
  } 

  .menu-item-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .menu-item {
    border-radius: 100px;
    border: 2px solid #2196F3;
    text-align: center;
    float: left;
    width: 50px;
    height: 50px;
    transition: all 0.3s ease;
    background: white;
    color: black;
    font-size: 30px;
    cursor: pointer;
    margin-right: 10px;
  }

  .menu-item:hover {
    background: #2196F3;
  }

  .active {
    background-color: #2196F3;
  }
</style>

<style>
  .font {
    font-size: 1.25em;
    font-size: 1.25rem;
  }

</style>


<style scoped>

  .fab {
    position: fixed;
    width: 56px;
    left: 3vw;
    bottom: 4vh;
    z-index: 999;
  }
  .fab-action-button {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    display: block;
    width: 56px;
    height: 56px;
    background-color: #2196F3;
    border-radius: 50%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  }
  .fab-action-button-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 37px !important;
    color: white;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<style scoped>
  /* fallback */
  @font-face {
    font-family: "Material Icons";
    font-style: normal;
    font-weight: 400;
    src: local("Material Icons"), local("MaterialIcons-Regular"),
      url(https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2)
        format("woff2");
  }
  .material-icons {
    font-family: "Material Icons";
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: "liga";
    -webkit-font-smoothing: antialiased;
  }
</style>
