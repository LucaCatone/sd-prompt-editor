<template>
  <q-layout view="hHh lpR fFf">

    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          SD Prompt Editor
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="q-pa-md bg-grey-12">
        <h6 class="q-my-none">Select files</h6>
        <p class="text-blue-grey-14">To open a folder, select one of the file in it.</p>
        <q-file outlined multiple display-value="Select the images and txts" counter v-model="projectFolder" label="Select multiple files">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const projectFolder = ref('');

    return {
      projectFolder: projectFolder,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },

  data() {
    return {
      
    }
  },

  watch: {
    projectFolder() {
      console.log(this.projectFolder)
    },
  }
}
</script>