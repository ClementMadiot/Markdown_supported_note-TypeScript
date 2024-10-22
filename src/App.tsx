import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStrorage";

export type Note = {
  id: string
} & NoteData

// update the note and tag -> Raw..
export type RawNote = {
  id: string
}

export type RawNoteData = {
  title: string
  markdown: string
  tagId: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tag: Tag[]
}

export type Tag = {
  id: string
  label: string
}


function App() {
  const [note, setNote] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])
  return (
    <Container className="my-4">

    <Routes>
      <Route path="/" element={<h1>Home</h1>}/>
      <Route path="/new" element={<NewNote/>}/>
      <Route path="/:id">
        <Route index element={<h1>Show</h1>}/>
        <Route path="edit" element={<h1>Edit</h1>}/>
      </Route>
      <Route path="*" element={<Navigate to="/"/>}/>

    </Routes>
    </Container>
  );
}

export default App;
