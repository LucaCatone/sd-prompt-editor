// src-electron/main-process/electron-preload.js

import { contextBridge } from 'electron'
import { BrowserWindow, dialog } from '@electron/remote'

const fs = require('fs')
const path = require('path')
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
  // Other fs methods here
})

contextBridge.exposeInMainWorld('electronFs', {
  readFileSync: fs.readFileSync,
  existsSync: fs.existsSync,
  readdirSync: fs.readdirSync
  // Other fs methods here
})