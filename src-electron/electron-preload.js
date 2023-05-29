// src-electron/main-process/electron-preload.js

import { contextBridge } from 'electron'
import { BrowserWindow, dialog } from '@electron/remote'

const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const url = require('url')
window.electron = require('electron')

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize () {
    BrowserWindow.getFocusedWindow().minimize()
  },

  toggleMaximize () {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  },

  close () {
    BrowserWindow.getFocusedWindow().close()
  }
}),

contextBridge.exposeInMainWorld('dialogApi', {
    openDialog () {
      return dialog.showOpenDialog({
        properties: ['openDirectory']
      })
    }
}),

contextBridge.exposeInMainWorld('electronPath', {
  extname: path.extname,
  basename: path.basename,
  join: path.join
})

contextBridge.exposeInMainWorld('mimeTypes', {
  lookup: mime.lookup,
})

contextBridge.exposeInMainWorld('NodeUrl', {
  pathToFileURL(path) {
    return url.pathToFileURL(path).href
  }
})

contextBridge.exposeInMainWorld('electronFs', {
  readFileSync: fs.readFileSync,
  existsSync: fs.existsSync,
  readdirSync: fs.readdirSync,
  writeFileSync: fs.writeFileSync,

  IsDirectory(path) {
    return fs.lstatSync(path).isDirectory()
  }
  // Other fs methods here
})