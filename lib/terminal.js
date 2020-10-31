'use babel';

import TerminalView from './terminal-view';
import { CompositeDisposable } from 'atom';

import { spawn } from 'child_process';

export default {

  terminalView: null,
  modalPanel: null,
  subscriptions: null,

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
  },

  buildButton ( ) {
    let target = document.querySelector('.status-bar-left');
    let button = document.createElement('div');
        button.innerHTML = 'terminal';
        button.classList = 'terminal__package';
        target.prepend( button );

        button.addEventListener('click' , ( event ) => {
            this.runFunction( );
        });
  },

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

  runFunction( ) {
    let editor = atom.workspace.getActiveTextEditor();
    let path = editor.getPath();
    let file = editor.getTitle();
    let string = path.replace( file , "" ); 
    spawn('cmd', ['/C', 'start cmd.exe'] , { cwd: string } , function(error,stdout,stderr){
      console.log( error );
    });
  } ,

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
