import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Note } from "../../App";

type NoteLayoutProps = {
  notes: Note[];
};

export function NoteLayout({ notes }: NoteLayoutProps) {
  const { id } = useParams();
  // take the current note id
  const note = notes.find((n) => n.id === id);

  // if not navigate to the home page
  if (note == null) return <Navigate to={"/"} replace />;

  // render whatever is inside the note
  return <Outlet context={note} />;
}
// export info from the current note
export function useNote() {
  return useOutletContext<Note>();
}
