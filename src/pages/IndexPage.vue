<template>

	<q-page>
		<div class="row" style="min-height: inherit;">
			<div class="col flex flex-center" v-if="images.length" style="min-height: inherit;">
				<div class="col" v-for="(image, index) in images" :key="index">
					<img fit="contain" style="width:100%" :src="'file:/' + selectedFolder+'\\'+image.name+image.ext" alt="">
				</div>
			</div>

			<div class="col bg-dark-separator" v-if="txtFile.length" style="min-height: inherit;">
				<div class="q-pa-lg">
					{{ txtFile[0].content }}
				</div>
			</div>
		</div>
	</q-page>

</template>

<script>
import { defineComponent } from 'vue'

const fs = window.electronFs;
const path = window.electronPath;
const mime = window.mimeTypes;
const url = window.NodeUrl;

export default defineComponent({
	name: 'IndexPage',

	props: {
		selectedFolder: {
			default: null
		},

		selectedFiles: {
			default: null
		}
	},

	data() {
		return {
			images: [],
			txtFile: []
		}
	},

	watch: {
		selectedFiles() {
			this.images = []
			this.txtFile = []

			// Ciclo tutti i file e divido le immagini dal txt
			// { name: 'name of the file', ext: '.txt' }
			this.selectedFiles.forEach(element => {
				var mimeType = mime.lookup(element.ext)
				// Se è un immagine (qualsiasi)
				if (mimeType.startsWith('image/')) {
					this.images.push(element);
				
				} else if (mimeType == 'text/plain') {
					this.txtFile.push({
						file: element,
						content: fs.readFileSync(this.selectedFolder +'\\' + element.name + element.ext, 'utf-8')
					});
				}
			});
		}
	},

	methods: {
		
	}

})
</script>
