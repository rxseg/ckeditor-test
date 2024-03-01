import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [editorData, setEditorData] = useState("");
  const [editor, setEditor] = useState<ClassicEditor | null>(null);

  const handleSave = () => {
    // Implement your saving logic here, for example, sending a request to a server
    localStorage.setItem("editorData", editorData);
    alert("¡Datos guardados exitosamente!"); // Temporary placeholder to indicate saving
  };

  const handleExportToHtml = () => {
    if (editor) {
      const htmlData = editor.getData(); // Obtener el contenido HTML del editor
      console.log(htmlData);

      // Descargar el contenido como archivo HTML
      const blob = new Blob([htmlData], { type: "text/html" });
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = "editor-content.html";
      downloadLink.click();
    }
  };

  useEffect(() => {
    // Load the editor data from local storage on initial render
    const storedData = localStorage.getItem("editorData");
    if (storedData) {
      setEditorData(storedData);
    }
  }, []);

  return (
    <>
      <div className="container">
        <div
          style={{
            height: "100%",
            width: "50%",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            padding: "16px",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Editor CKEditor en React con Vite
          </h2>
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "|",
                "alignment",
                "|",
                "numberedList",
                "bulletedList",
                "|",
                "link",
                "blockquote",
                "|",
                "imageUpload",
                "insertTable",
                "mediaEmbed",
                "|",
                "undo",
                "redo",
                "|",
                "sourceEditing",
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
            }}
            onReady={(editor) => {
              setEditor(editor); // Store editor reference in state
              editor.plugins.get("FileRepository").createUploadAdapter = (
                loader
              ) => {
                return {
                  upload: async () => {
                    const file = await loader.file;

                    // Convertir la imagen a base64
                    const reader = new FileReader();
                    reader.readAsDataURL(file as Blob);
                    const base64String = await new Promise((resolve) => {
                      reader.onload = () => resolve(reader.result);
                    });

                    // Reemplazar la URL simulada con la cadena base64
                    return { default: base64String };
                  },
                };
              };
            }}
          />
          <div className="buttonContainer">
            <button onClick={handleSave} className="button">
              Guardar
            </button>
            <button onClick={handleExportToHtml} className="button">
              Exportar a HTML
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
