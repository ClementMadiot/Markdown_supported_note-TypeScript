import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";
// import web page
import { useLocalStorage } from "./data/useLocalStrorage";
import { NewNote } from "./components/Create/NewNote";
import { NoteList } from "./components/Home/NoteList";
import { NoteLayout } from "./components/Show/NoteLayout";
import { Note } from "./components/Show/Note";
import { EditNote } from "./components/Edit/EditNote";
// style
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

export type Note = {
  id: string;
} & NoteData;

// update the note and tag -> Raw..
export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [tags, notes]);

  // handle creation of the note
  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  // handle tag creation to store them
  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  // update the "Edit Note"
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  // delete note
  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  // update "Edit tags" modal
  function updateTag(id: string, label: string): Tag {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id === id){
          return {...tag, label}
        } else {
          return tag
        }
      })
    })
  }

  // delete tag "Edit tags" modal
  function deleteTag(id: string) {
    setTags(prevTag => {
      return prevTag.filter(tag => tag.id !== id)
    })
  }


  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<NoteList notes={notesWithTags} availableTags={tags} deleteTag={deleteTag} updateTag={updateTag} />}
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note deleteNote={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
