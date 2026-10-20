
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes") || "[]");
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content!");
      return;
    }

    if (editId !== null) {
      setNotes(notes.map(note =>
        note.id === editId
          ? { ...note, title: title.trim(), content: content.trim() }
          : note
      ));
      setEditId(null);
    } else {
      setNotes([
        {
          id: Date.now(),
          title: title.trim(),
          content: content.trim()
        },
        ...notes
      ]);
    }

    setTitle("");
    setContent("");
  }

  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id) {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter(note => note.id !== id));

      if (editId === id) {
        setTitle("");
        setContent("");
        setEditId(null);
      }
    }
  }

  return (
    <div className="app">
      <header>
        <h1>My Notes</h1>
        <p>Create, edit and manage your notes</p>
      </header>

      <main className="container">
        <section className="form-box">
          <h2>{editId !== null ? "Update Note" : "Add New Note"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows="4"
              required
            />

            <button type="submit">
              {editId !== null ? "Update Note" : "Add Note"}
            </button>

            {editId !== null && (
              <button
                type="button"
                className="cancel"
                onClick={() => {
                  setTitle("");
                  setContent("");
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section>
          <h2>My Notes ({notes.length})</h2>

          {notes.length === 0 ? (
            <p className="empty">No notes yet. Add your first note!</p>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <article className="note-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>

                  <button onClick={() => editNote(note)}>
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>Notes Manager | Built with React.js</footer>
    </div>
  );
}

export default App;
