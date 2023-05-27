<template>
	<q-layout view="hHh lpR fFf">

		<q-header bordered class="bg-primary text-white" height-hint="98">
			<q-bar class="q-electron-drag">
				<q-icon name="laptop_chromebook" />
				<div>SD Prompt Editor</div>

				<q-space />

				<q-btn dense flat icon="minimize" @click="minimize" />
				<q-btn dense flat icon="crop_square" @click="toggleMaximize" />
				<q-btn dense flat icon="close" @click="closeApp" />
			</q-bar>

			<div class="q-pa-sm q-pl-md row items-center">
				<div class="cursor-pointer non-selectable">
					File
					<q-menu>
						<q-list dense style="min-width: 100px">
							<q-item clickable v-close-popup @click="openFileExplorer">
								<q-item-section>Open folder...</q-item-section>
							</q-item>

							<q-item clickable v-close-popup>
								<q-item-section>Save all</q-item-section>
							</q-item>

							<q-separator />

							<q-item clickable v-close-popup @click="closeApp">
								<q-item-section>Quit</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</div>
			</div>
		</q-header>

		<q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
			<div class="q-pa-md-12">
				<q-list bordered class="rounded-borders text-primary">
					<q-item v-for="(file, index) in txtFiles"
						clickable
						v-ripple
						:key="index"
					>
						<q-item-section>{{file}}</q-item-section>
					</q-item>
				</q-list>
			</div>
		</q-drawer>

		<q-page-container>
		  <!-- <router-view /> -->
		</q-page-container>

	  </q-layout>
</template>

<script>
import { ref } from 'vue'
const fs = window.electronFs;
const path = window.electronPath;

export default {
  components: {},

  setup () {
	const leftDrawerOpen = ref(false)
	const selectedFolder = ref({})

	/**
	 * Window bar
	 */

	function minimize () {
	  if (process.env.MODE === 'electron') {
		window.myWindowAPI.minimize()
	  }
	}

	function toggleMaximize () {
	  if (process.env.MODE === 'electron') {
		window.myWindowAPI.toggleMaximize()
	  }
	}

	function closeApp () {
	  if (process.env.MODE === 'electron') {
		window.myWindowAPI.close()
	  }
	}

	/**
	 * File explorer
	 */
	function openFileExplorer() {
		window.dialogApi
			.openDialog()
			.then((directory) => {
				selectedFolder.value = directory;
			})
	}

	return {
	  leftDrawerOpen,

	  minimize,
	  toggleMaximize,
	  closeApp,

	  openFileExplorer,
	  selectedFolder,

	  toggleLeftDrawer () {
		leftDrawerOpen.value = !leftDrawerOpen.value
	  }
	}
  },

  data() {
	return {
		fileList: [],
		txtFiles: []
	}
  },

  watch: {
	selectedFolder() {
		this.fileList = []
		this.txtFiles = []

		this.fileList = fs.readdirSync(this.selectedFolder.filePaths[0])
		this.fileList.forEach(element => {
			if (path.extname(element) == ".txt")
    			this.txtFiles.push(element)
		});
	},
  }
}
</script>