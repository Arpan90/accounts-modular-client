import React from 'react';
import styles from './DeleteButton.module.css';
import axios from '../../axios';
import {   
         Button,
         Popover,
         OverlayTrigger
        } from 'react-bootstrap';

const DeleteButton = ( props ) => {

    const hidePopoverHandler = () =>{
        document.body.click();
    }

    // const [ showLoader, setShowLoader ] = useState(false); // only declared to capture loader state for rootclose
    const { showLoader, setShowLoader } = props;
    const deleteHandler = () => {
        // props.setShowLoader(true);
        setShowLoader(true);
        axios.post(`/api/items/${props.toUpdate}`, { ...props.formData , del: true })
             .then((res) =>{
                console.log(res); 
                // setMsg("Deletion successful !");
                // setSuccess(true);
                hidePopoverHandler();
                props.updateTableHandler(props.toUpdate, 'del');
            })
             .catch(err => {
              // setMsg("Deletion failed. Please check your network connection")
              // setSuccess(false);
              console.log(err);
             })
             .finally(() =>{
                // props.setShowLoader(false);
                setShowLoader(false);
              });
    }

    const popover = (
        <Popover id="popover-basic" className={styles.popover} >
          <Popover.Header as="h3">Confirm Deletion</Popover.Header>
          <Popover.Body>
            <p>Please confirm that you want to delete this entry: </p>
            <Button  variant='success' onClick={deleteHandler} >Confirm</Button>
            <Button className={ styles.buttonCancel } onClick={hidePopoverHandler} variant='danger' >Cancel</Button>
          </Popover.Body>
        </Popover>
      );

    return(
        <OverlayTrigger
          trigger="click"
          rootClose={!showLoader} 
          transition placement="right" 
          overlay={popover} >
            <Button className={styles.button} variant='danger' >Delete</Button>
        </OverlayTrigger>
    );
}

export default DeleteButton;