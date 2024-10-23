import { useMemo, useState } from "react";
// import component
import { Row, Col, Stack, Button, Form, Card, Badge } from "react-bootstrap";
import ReactSelect from "react-select";
import { Link } from "react-router-dom";
// import types
import { Tag } from "./App";
import styles from "./styles/NotesList.module.css";

// NoteCard
type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
};

export function NoteList({ availableTags, notes }: NoteListProps) {
  const [selectTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  // update everytimes we change title, selectedTags, notes
  const filteredNote = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectTags.length === 0 ||
          selectTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectTags, notes]);

  return (
    <>
      {/* title + buttons  */}
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Note</h1>
        </Col>
        <Col>
          <Stack gap={2} direction="horizontal">
            <Link to={"/new"}>
              <Button variant="primary">Create</Button>
            </Link>
            <Button variant="outline-secondary">Edit Tags</Button>
          </Stack>
        </Col>
      </Row>
      {/* inputs  */}
      <Form>
        <Row className="mb-4">
          {/* Title  */}
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          {/* Tags  */}
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                value={selectTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} className="g-3">
        {filteredNote.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
    </>
  );
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack className="align-items-center justify-center h-100" gap={2}>
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
              {tags.map(tag => (
                <Badge key={tag.id} className="text-truncate">{tag.label}</Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}
