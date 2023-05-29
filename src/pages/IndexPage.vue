<template>

	<q-page>
		<div class="row" style="min-height: inherit;">
			<div class="col flex flex-center" v-if="images.length" style="min-height: inherit;">
				<div class="col" v-for="(image, index) in images" :key="index">
					<img fit="contain" style="width:100%" :src="ImageUrlBuilder(image)" alt="">
				</div>
			</div>

			<div class="col bg-dark-separator" v-if="selectedFiles != ''" style="min-height: inherit;">
				<div class="q-pa-lg">
					<q-input
						v-model="txtContent"
						filled
						autogrow
						type="textarea"
					/>
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
			txtFile: [],
			txtContent: ''
		}
	},

	watch: {
		selectedFiles() {
			this.images = []
			this.txtFile = []
			this.txtContent = ''

			// Ciclo tutti i file e divido le immagini dal txt
			// { name: 'name of the file', ext: '.txt' }
			this.selectedFiles.forEach(element => {
				var mimeType = mime.lookup(element.ext)
				// Se è un immagine (qualsiasi)
				if (mimeType) {
					if (mimeType.startsWith('image/')) {
						this.images.push(element);
					
					} else if (mimeType == 'text/plain') {
						var content = fs.readFileSync(path.join(this.selectedFolder, element.name + element.ext), 'utf-8')
	
						this.txtFile.push({
							file: element,
							content: content
						});
	
						this.txtContent = content
					}
				}
			});
		},

		txtContent() {
			if (this.txtFile.length) {
				fs.writeFileSync(path.join(this.selectedFolder, this.txtFile[0].file.name + this.txtFile[0].file.ext), this.txtContent)
			} else {
				if (this.images.length) {
					fs.writeFileSync(path.join(this.selectedFolder, this.images[0].name + '.txt'), this.txtContent)
				}
			}
		}
	},

	methods: {
		ImageUrlBuilder(image) {
			return url.pathToFileURL(path.join(this.selectedFolder, image.name + image.ext))
		}
	}

})
</script>
