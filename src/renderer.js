const { remote, ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;
const mainProcess = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
const fs = require('fs');

const { subParser, generateTSV } = require('./utils/sub-parser');
const { msNormalizer } = require('./utils/msNormalizer');

const chooseFile = document.querySelector('#choose-file');
const normalizeFile = document.querySelector('#normalize-file');
const saveTo = document.querySelector('#save-file');
const execute = document.querySelector('#execute');
const dragContainer = document.querySelector('#drag-container');

let filePathForSub = null;
let dirPathForOutput = null;
let subtitleFileName = null;
let defaultDirPath = null;

/**
 *
 * @param {string} filePath - Accepts a filepath of the subtitle
 * @return {string} defaultDirPath - Returns a default directory for saving
 *
 */

const getDefaultDirPath = filePath => {
  let parsedDirPath = filePath.replace(/[^\/]*$/, '');
  defaultDirPath = parsedDirPath;
  return parsedDirPath;
};

/**
 * ChooseFile button event listener
 *  -updates filePathForSub variable with path info
 *  -onClick adds 'completed' class to DOM element
 */

chooseFile.addEventListener('click', e => {
  const files = dialog.showOpenDialog({
    properties: ['openFile']
  });
  filePathForSub = files[0];
  subtitleFileName = filePathForSub.replace(/^.*[\\\/]/, '');
  subtitleFileName = subtitleFileName.replace(/(.srt)/, '');

  console.log(files);
  chooseFile.classList.add('completed');
});

/**
 * NormalizeFile button event listener
 *  -looks for filePath
 *  -if present normalizes MS values
 *  -updates subtitle object
 */

normalizeFile.addEventListener('click', e => {});

/**
 * SaveTo button event listener
 *  -updated dirPathForOutput variable with output path
 *  -onClick adds 'completed' class to DOM element
 */

saveTo.addEventListener('click', e => {
  const directoryOfChoice = dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  dirPathForOutput = directoryOfChoice[0];
  console.log(`dirPathForOutput:${dirPathForOutput}`);
  saveTo.classList.add('completed');
});

execute.addEventListener('click', e => {
  if (filePathForSub && dirPathForOutput) {
    generateTSV(
      subParser(filePathForSub),
      dirPathForOutput,
      subtitleFileName
    );
  }
  if (!filePathForSub) {
    alert('Please provide a subtitle.');
  }
  if (!dirPathForOutput) {
    alert('Please provide a directory to output to.');
  }
  saveTo.classList.remove('completed');
  chooseFile.classList.remove('completed');
});

/**
 * DragOver Logic
 *  -Prevents Electron from showing the .srt when dragging in
 *  -Saves and updates filePathForSub variable on drag
 * TODO: Make drag take both directory and single subtitle
 * TODO: Add default folder location (origin path)
 */

document.addEventListener(
  'dragover',
  e => {
    e.preventDefault();
    return false;
  },
  false
);

document.addEventListener(
  'drop',
  e => {
    e.preventDefault();
    filePathForSub = e.dataTransfer.files[0].path;
    subtitleFileName = filePathForSub.replace(/^.*[\\\/]/, '');
    subtitleFileName = subtitleFileName.replace(/(.srt)/, '');
    console.log(
      `FilePathForSub${filePathForSub} \n subtitleFileName:${subtitleFileName}`
    );
    return false;
  },
  false
);
