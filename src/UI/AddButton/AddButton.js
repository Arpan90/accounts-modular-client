import React, { useEffect, useState } from 'react';
import styles from './AddButton.module.css';
import axios from '../../axios';
import { ExclamationIcon } from '../ExclamationIcon/ExclamationIcon';
import { AddIcon } from './AddIcon/AddIcon';
import {   
        Form,
        Button,
        Popover,
        OverlayTrigger
    } from 'react-bootstrap';
import { determineYearWithDate, monthAndDay } from '../../utils';

const AddButton = ( props ) => {
    
    const { name, year, direction } = props.formData;  

    const [ newNarration, setNarration ] = useState();
    const [ newAmount, setAmount ] = useState(0);
    const [ newDirection, setDirection ] = useState();
    const [ newDate, setDate ] = useState();
    const [ newNoDate, setNoDate] = useState(true);

    const [ narrationValidationFail, setNarrationValidationFail ] = useState(false);
    const [ amountValidationFail, setAmountValidationFail ] = useState(false);

    const hidePopoverHandler = () =>{
        document.body.click();
    }

    const { showLoader, setShowLoader, success, setMsg, setSuccess } = props; 

    const min = `${year.split('-')[0]}-04-01`;
    const max = `${year.split('-')[1]}-03-31`;

    useEffect(() => {
        if(!showLoader && success ){
            hidePopoverHandler();
        }
    }, [showLoader, success] )

    const resetHandler = () => {
        setAmount(0);
        setNarration("");
        setDirection(direction);
        setNoDate(true);
        setDate(determineYearWithDate(year, new Date().toISOString().split('T')[0]));

        if(narrationValidationFail){
            setNarrationValidationFail(false);
        }
        if(amountValidationFail){
            setAmountValidationFail(false);
        }
    }

    function validationHandler(){
        console.log("validationhandler hit");
        if(newAmount > 0 && newNarration.trim() !== ""){
            console.log("validation successful");
            if(amountValidationFail){
                setAmountValidationFail(false);
            }
            if(narrationValidationFail){
                setNarrationValidationFail(false);
            }
            return true;
        }
        if(Number(newAmount) <= 0 ){
            console.log("amount validation fail");
            setAmountValidationFail(true);
        }
        else if(amountValidationFail){
            setAmountValidationFail(false);
        }
        if(newNarration.trim() === ""){
            console.log("description error hit")
            setNarrationValidationFail(true);
        }
        else if(narrationValidationFail){
            setNarrationValidationFail(false);
        }
        return false;
    }

    const addHandler = (event) => {

        event.preventDefault();

        if(!validationHandler()){
            return;
        }

        let newFormData = {
                name: name,
                year: year,
                date: monthAndDay(newDate, -1),
                noDate: newNoDate,
                description: newNarration,
                amount: newAmount,
                direction: newDirection,
            }

        setShowLoader(true);
        
        axios.post('/api/items', newFormData )
             .then((res) =>{
                console.log("item added: ", res); 
                setMsg("Entry added successfully !");
                setSuccess(true);
                newFormData["id"]= res.data.id;
                props.updateTableHandler('_', 'add', newFormData);
            })
             .catch(err => {
                setMsg("Entry could not be added. Please check your network connection")
                setSuccess(false);
                console.log(err);
             })
             .finally(() =>{
                // props.setShowLoader(false);
                setShowLoader(false);
              });
    }

    const changeHandler = (event) => {

        switch(event.target.id){

            case "formBasicDate":
                setDate(event.target.value);
                break;

            case "formBasicNoDate":
                setNoDate(event.target.checked)
                break;

            case "formBasicAmount":
                let val = Number(event.target.value);
                console.log("amount is: ", val);
                setAmount(val);
                break;

            case "formBasicNarration":
                setNarration(event.target.value);
                break;

            default:
                setDirection(event.target.id);
        }
    }

    const popover = (
        <Popover id="popover-basic" className={styles.popover}>
          <Popover.Header as="h3">New Data Form</Popover.Header>
          <Popover.Body>
           <Form onSubmit={addHandler} >
                <Form.Group className="mb-3" controlId="formBasicDate"> 
                    <Form.Label>Date</Form.Label>
                    <Form.Control name="date" type="date" value={newDate} onChange={changeHandler} min={min} max={max} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicNoDate"> 
                    <Form.Check name="noDate" label="No Date" type="checkbox" checked={newNoDate} onChange={changeHandler}  />
                </Form.Group>
                <Form.Group controlId="credit" >
                    <Form.Label>Type</Form.Label>
                    <Form.Check name="direction" type="radio" label="Credit" checked={newDirection === "credit"} onChange={changeHandler} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="debit" >
                    <Form.Check name="direction" type="radio" label="Debit" checked={newDirection === "debit"} onChange={changeHandler} />
                </Form.Group>  

                <Form.Group className="mb-4" controlId="formBasicAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="number" placeholder="Enter amount" onChange={changeHandler} value={Number(newAmount)} />
                    { amountValidationFail ? <div className={styles.validationFail} ><span> { ExclamationIcon } </span><span> Amount must be greater than zero </span> </div> : null }
                </Form.Group> 

                <Form.Group className="mb-3" controlId="formBasicNarration">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter description" onChange={changeHandler} value={newNarration} />
                    { narrationValidationFail ? <div className={styles.validationFail} ><span> { ExclamationIcon } </span><span>Description must contain some descriptive text</span></div> : null }
                </Form.Group> 
                <Button type="submit" className={styles.buttonGrp}  variant='success' onClick={addHandler} >Confirm</Button>
                <Button className={ [ styles.buttonGrp, styles.buttonCancel ].join(" ") } onClick={hidePopoverHandler} variant='danger' >Cancel</Button>
            </Form>
          </Popover.Body>
        </Popover>
      );

    return(
        <OverlayTrigger
            trigger="click"
            rootClose={!showLoader} 
            transition 
            placement="right" 
            onToggle={resetHandler}
            overlay={popover} >

            <span className={styles.clickable} >{ AddIcon }</span>

        </OverlayTrigger>
    );

      
   
}

export default AddButton;