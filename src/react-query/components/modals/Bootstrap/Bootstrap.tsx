import React from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "@src/app-bootstrap/scss/main.scss";

interface Props {
  // For assigning dynamic keys (string)
  [key: string]: string | number | Date | undefined;

  // For assigning dynamic indexes (number)
  [index: number]: string | number | Date | undefined;
}

export default () => {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  return (
    <div className="App">
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
