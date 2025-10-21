<script setup>
import Settings from '~/components/interactive_editor/settings.vue'
</script>

<template>
  <div class="interactive_editor">
    <div class="intreractive_editor_header">
      <img src="/public/images/interactive_editor/logo.svg" id="interactive_editor_logo" />
      <div>
        <div class="intreractive_editor_header_back_text">
        Управление интерактивами
      </div>
      <img src="/public/images/interactive_editor/Vector.svg" id="interactive_editor_back" />
      </div>
      
    </div>
    <Settings />
  </div>
</template>

<style>
.intreractive_editor_header {
  background-color: #853CFF;
  height: calc((71/832)*100dvh);
  width: 100dvw;
  position: relative;
}

#interactive_editor_logo {
  height: calc((50/832)*100dvh);
  width: calc((123/1280)*100dvw);
  position: absolute;
  top: calc((21 / 1664) * 100dvh);
  right: calc((40 / 1280) * 100dvw);
}

.intreractive_editor_header_back_text {
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-style: Medium;
  color: white;
  line-height: 120%;
  letter-spacing: 0.2px;
  vertical-align: middle;
  position: absolute;
  bottom: calc((5 / 832) * 100dvh);
  left: calc((38 / 1280) * 100dvw);

  font-size: clamp(12px, calc((20 / 1280) * 100dvw), 34px);
  cursor: pointer;

}

#interactive_editor_back {
 
  width: calc((10 / 1280) * 100dvw);
  position: absolute;
  bottom: calc((8 / 832) * 100dvh);
  left: calc((23 / 1280) * 100dvw);
  cursor: pointer;
}


</style>
