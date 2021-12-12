import React from 'react';
import  './Loader.css';
import { Modal, ModalBody } from 'react-bootstrap';

const Loader = (props) => {

    console.log("show loader", props.show)

    return( 
    <Modal show={props.show}
           backdrop="static"
           dialogClassName="borderStyle" > 
           <ModalBody className="spinner"> </ModalBody>
    </Modal> 

    );
}

export default React.memo(Loader);