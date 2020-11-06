'use babel';

import TerminalView from './terminal-view';
import { CompositeDisposable } from 'atom';

// import { uuidv4 } from 'uuid';
import { spawn } from 'child_process';
const kill = require('tree-kill');

let svgTerminal = `<svg  viewBox="0 0 109 94" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="0.5" x="2.5" y="2.5" width="104" height="89" rx="7.5" stroke="white" stroke-width="5"/>
<rect x="4" y="5" width="100" height="21" fill="white"/>
<ellipse cx="17" cy="15.5" rx="6" ry="5.5" fill="#010000"/>
<ellipse cx="54" cy="15.5" rx="6" ry="5.5" fill="#010000"/>
<ellipse cx="35" cy="15.5" rx="6" ry="5.5" fill="#010000"/>
<rect x="32" y="53" width="29" height="3" fill="white"/>
<path d="M14 55.9406L28.9071 48.425C30.3534 47.6959 30.3784 45.6398 28.9503 44.8757L14.2302 37" stroke="white" stroke-width="3"/>
</svg>
`;

export default {

  terminalView: null,
  modalPanel: null,
  subscriptions: null,

  states: [ ],

  activate(state) {
    this.terminalView = new TerminalView(state.terminalViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.terminalView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'terminal:toggle': () => this.toggle()
    }));

    this.buildButton();
    this.traverse_treeView();
  } ,

  buildButton ( ) {

      let target = document.querySelector('.status-bar-left');

      let element = document.createElement('div');
          element.classList.add('terminal__package');
          element.innerHTML = `
              <div class="terminal__new">
                  ${ svgTerminal }
              </div>
      `;

      target.prepend( element );

      let terminal__addButton = document.querySelector('.terminal__new');

      terminal__addButton.addEventListener('click' , ( e ) => {
          // generate a cmd terminal and a new div element.
          this.openCMD();
      });
  } ,

  traverse_treeView () {
      let tree = document.querySelector('.item-views > .tree-view > .tree-view-root');
      //
      let tree_test = atom.project;
      console.log( tree_test );
  } ,

  openCMD( ) {
      let editor = atom.workspace.getActiveTextEditor();
      let path = editor.getPath();
      let file = editor.getTitle();
      let correctPath = path.replace( file , "" );
      spawn('cmd', ['/C', 'start cmd.exe'] , { cwd: correctPath });
  } ,

  deactivate() {
      this.modalPanel.destroy();
      this.subscriptions.dispose();
      this.terminalView.destroy();
  },

  serialize() {
      return {
        terminalViewState: this.terminalView.serialize()
      };
  },

  toggle() {
        console.log('Terminal was toggled!');
        // return (
        //   this.modalPanel.isVisible() ?
        //   this.modalPanel.hide() :
        //   this.modalPanel.show()
        // );
        // let editor;
        // if ( editor = atom.workspace.getActiveTextEditor() ) {
        //     let selection = editor.getSelectedText()
        //     let reversed = selection.split('').reverse().join('')
        //     editor.insertText(reversed);
        // }

   }
};
