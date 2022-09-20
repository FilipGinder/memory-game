import 'bootstrap/dist/css/bootstrap.min.css'
import { Button} from 'react-bootstrap';
import { useState, useEffect, useContext } from "react";
import Modal from 'react-bootstrap/Modal';
import {  Link } from 'react-router-dom';


function Modal_nova_partija(props:any) {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const novaPartija = () => {
        props.resetRef.current.click();
    }

    

    return (
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header /*closeButton*/>
                <Modal.Title>Čestitamo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Da li želiš da novu partiju?</Modal.Body>
                <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button> */}
                
                    <Link to="/" id="nazad1"><Button variant="dark">Nazad</Button></Link>

                <Button variant="primary"  onClick={ (event) => { novaPartija(); setShow(false) } }>
                    Start
                </Button>
                </Modal.Footer>
            </Modal>
    )
}


export default Modal_nova_partija;