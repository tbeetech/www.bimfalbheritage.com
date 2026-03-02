import { useEffect, useRef } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value || '';
    }
  }, [value]);

  const runCommand = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    const html = editorRef.current?.innerHTML || '';
    onChange(html);
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (!url) return;
    runCommand('createLink', url);
  };

  return (
    <div className="rte-shell">
      <div className="rte-toolbar">
        <button type="button" onClick={() => runCommand('bold')}><strong>B</strong></button>
        <button type="button" onClick={() => runCommand('italic')}><em>I</em></button>
        <button type="button" onClick={() => runCommand('underline')}><u>U</u></button>
        <button type="button" onClick={() => runCommand('insertUnorderedList')}>Bullets</button>
        <button type="button" onClick={() => runCommand('insertOrderedList')}>Numbers</button>
        <button type="button" onClick={() => runCommand('formatBlock', 'blockquote')}>Quote</button>
        <button type="button" onClick={addLink}>Link</button>
        <button type="button" onClick={() => runCommand('removeFormat')}>Clear</button>
      </div>
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder || 'Write your story...'}
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
