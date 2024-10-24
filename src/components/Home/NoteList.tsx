import { useMemo, useState } from "react";
// import component
import {
  Row,
  Col,
  Stack,
  Button,
  Form,
  Card,
  Badge,
  Modal,
} from "react-bootstrap";
import ReactSelect from "react-select";
import { Link } from "react-router-dom";
// import types
import { Tag } from "../../App";
import styles from "../../styles/NotesList.module.css";

// NoteCard
type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  updateTag: (id: string, label: string) => void;
  deleteTag: (id: string) => void;
};

// EditTag
type EditTagsModalProps = {
  availableTags: Tag[];
  show: boolean;
  handleClose: () => void;
  updateTag: (id: string, label: string) => void;
  deleteTag: (id: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  deleteTag,
  updateTag,
}: NoteListProps) {
  const [selectTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [toggleEditModal, setToggleEditModal] = useState(false);

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
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={"/new"}>
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              onClick={() => setToggleEditModal(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
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
      <EditTagsModal
        show={toggleEditModal}
        handleClose={() => setToggleEditModal(!toggleEditModal)}
        availableTags={availableTags}
        deleteTag={deleteTag}
        updateTag={updateTag}
      />
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
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  show,
  handleClose,
  deleteTag,
  updateTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => updateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => deleteTag(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
