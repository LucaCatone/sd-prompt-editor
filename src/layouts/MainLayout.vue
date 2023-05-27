<template>
	<q-layout view="hHh lpR fFf">

		<q-header bordered class="bg-red text-white" height-hint="98">
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
			<div class="">
				<q-list class="rounded-borders text-primary">
					<q-item v-for="(files, index) in groupedFiles"
						clickable
						v-ripple
						active-class="my-menu-link"
						:active="selectedFiles === files"
						@click="ChangeSelectedFile(files)"
						:key="index"
					>
						<q-item-section>{{ files[0].name }}</q-item-section>
					</q-item>
				</q-list>
			</div>
		</q-drawer>

		<q-page-container>
		  <router-view :selectedFolder="selectedFolder" :selectedFiles="selectedFiles" />
		</q-page-container>

	  </q-layout>
</template>

<script>
import { ref } from 'vue'
import natsort from 'natsort'
import { useQuasar } from 'quasar'
import "core-js";

const fs = window.electronFs;
const path = window.electronPath;

export default {
	components: {},

	setup () {
		const leftDrawerOpen = ref(false)
		const selectedFolder = ref({})
		const $q = useQuasar()

		// set status
		$q.dark.set(true) // or false or "auto"

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
					if (!directory.canceled) {
						selectedFolder.value = directory.filePaths;
					}
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
			groupedFiles: [],
			selectedFiles: ''
		}
	},

	watch: {
		selectedFolder() {
			this.fileList = []
			this.groupedFiles = []

			if (Object.keys(this.selectedFolder).length) {
				this.selectedFiles = '';
				this.fileList = fs.readdirSync(this.selectedFolder[0])
				 
				// Creo un array in cui ogni file è classificato
				// in modo tale da poter raggruppare file successivamente
				let classifiedFilesList = []
				this.fileList.forEach(element => {
					// Trovo il nome del file
					let fileName = path.basename(element, path.extname(element))
					let extName = path.extname(element)
					// Aggiungo il file all'array con le classificazioni
					classifiedFilesList.push({ name: fileName, ext: extName })
				});

				// Raggruppo l'array per filename
				this.groupedFiles = classifiedFilesList.group(file => {
					return file.name;
				});
				
				// Converto tuto in un array per poterlo ordinare
				this.groupedFiles = Object.values(this.groupedFiles);
				
				var sorter = natsort();
				this.groupedFiles = this.groupedFiles.sort(function(a, b) {
					return sorter(a[0].name, b[0].name);
				});
			}
		}
	},

	methods: {
		ChangeSelectedFile(files) {
			this.selectedFiles = files;
		}
	}
  
}
</script>