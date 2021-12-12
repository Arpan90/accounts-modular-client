import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from './Controls.module.css';
import { ExclamationIcon } from '../../UI/ExclamationIcon/ExclamationIcon';
import { convertToFy, determineFy, determineYearWithDate, monthAndDay } from '../../utils';

import { 
    Container, 
    Row, 
    Col,
    ListGroup, 
    Button, 
    Modal, 
    Form 
} from 'react-bootstrap';
import axios from '../../axios';
import WithLoadingInfo from '../../HOC/WithLoadingInfo/WithLoadingInfo';

const Controls = (props) => {

    const { setShowLoader, setMsg, setSuccess } = props;

    const [ narrationValidationFail, setNarrationValidationFail ] = useState(false);
    const [ amountValidationFail, setAmountValidationFail ] = useState(false);

    const START_YEAR = 2015;
    const END_YEAR = new Date().getFullYear();

    let yearRange = Array(END_YEAR - START_YEAR + 1).fill().map((_, idx) => convertToFy(START_YEAR + idx) ).reverse(); // generates an array of consecutive integers from START_YEAR to END_YEAR .

    const [ year, setYear ] = useState(`${END_YEAR}-${END_YEAR + 1}`);
    const [ date, setDate ] = useState(new Date().toISOString().split('T')[0]);
    const [ noDate, setNoDate ] = useState(false);
    const [ name, setName ] = useState("narayan");
    const [ direction, setDirection ] = useState("credit");
    const [ amount, setAmount ] = useState(0);
    const [ description, setNarration ] = useState('');  

    const [ blink , setBlink ] = useState(false);

    const didMount = useRef(false);

    const users = ['narayan', 'savita', 'sakshi', 'arpan'];

    const [ searchStr, setSearchStr ] = useState('');

    const { setFormData } = props;

    const searchHandler = (event) =>{
        setSearchStr(event.target.value.toString().toLowerCase());
    }

    const setTableParametersHandler = useCallback( () =>{
        let formData = {
            name: name.toLowerCase(),
            year: year
        }
        setFormData(formData);
        setBlink(false);
    }, [ name, year, setFormData ] );

    useEffect(() => {
        if(!didMount.current){
            didMount.current = true;
            setTableParametersHandler();
        }
    }, [setTableParametersHandler])

    const clickHandler = (event, id) => {
        switch(id){
            case "year":
                setYear(event.target.id);
                setDate(determineYearWithDate(event.target.id, date));
                break;

            case "name":
                setName(event.target.id);
                break;

            case "direction":
                setDirection(event.target.id);
                break;

            default:
                return null;
        }

        setBlink(true);
    }

    const [show, setShow] = useState(false);

    const closeHandler = () => setShow(false);
    const showHandler = () => {
        setAmount(0);
        setNarration("");
        setNoDate(true);
        if(narrationValidationFail){
            setNarrationValidationFail(false);
        }
        if(amountValidationFail){
            setAmountValidationFail(false);
        }

        if(year === "all"){
            setYear(`${END_YEAR}-${END_YEAR + 1}`);
            setDate(new Date().toISOString().split('T')[0]);
        }

        setShow(true);
    }

    const changeHandler = (event) => {

        switch(event.target.id){

            case "formBasicDate":
                setDate(event.target.value);
                setYear(determineFy(event.target.value));
                console.log('selected date: ', event.target.value);
                break;

            case "formBasicNoDate":
                setNoDate(event.target.checked)
                break;

            case "formBasicName":
                setName(event.target.value);
                break;

            case "formBasicAmount":
                let val = event.target.value;
                setAmount(val);
                break;

            case "formBasicNarration":
                setNarration(event.target.value);
                break;

            default:
                setDirection(event.target.id);
        }
    }

    const validationHandler = () =>{
            if(users.includes(name) && Number(amount) > 0 && description.trim() !== ""){
                if(amountValidationFail){
                    setAmountValidationFail(false);
                }
                if(narrationValidationFail){
                    setNarrationValidationFail(false);
                }
                return true;
            }
            if(Number(amount) <= 0 ){
                setAmountValidationFail(true);
            }
            else if(amountValidationFail){
                setAmountValidationFail(false);
            }
            if(description.trim() === ""){
                setNarrationValidationFail(true);
            }
            else if(narrationValidationFail){
                setNarrationValidationFail(false);
            }
            return false;
    }

    const submitHandler = () =>{

        if(!validationHandler()){
            console.log("validation failed");
            return;
        }

        const formData = {
                name: name.toLowerCase(),
                year: year,
                date: monthAndDay(date, -1),
                noDate: noDate,
                amount: Number(amount),
                direction: direction,
                description: description
            }

            console.log("formData in controls = ", formData);
        
        setShowLoader(true);
        axios.post('/api/items', formData)
             .then((res => {
                setShowLoader(false);
                console.log("control post successful: ", res);
                setTableParametersHandler();
                closeHandler();
                setBlink(false);
                setMsg("Entry added successfully ! Fetching updated table...");
                setSuccess(true);
             }))
             .catch(err => {
                 setShowLoader(false);
                setMsg("Entry could not be added. Please check your network connection");
                setSuccess(false);
                 console.log('error is: ', err);
             })
    }

    let min = `${START_YEAR}-04-01`;
    let max = `${END_YEAR + 1}-03-31`;

    return(
        <Container fluid="lg" className="p-5 bg-light" >
            <Row className={styles.rowHeight} >
                <Col lg={4} >
                    <ListGroup  >
                        <ListGroup.Item style={{postion: "fixed"}}  ><input type="text" onChange={searchHandler} value={searchStr} ></input></ListGroup.Item>
                    </ListGroup>
                    <ListGroup className={styles.colHeight} >
                        { "all".toString().includes(searchStr) ?
                        <ListGroup.Item key="all" id="all" action onClick={(event)=>clickHandler(event, "year")} variant="light" active={ year === "all" } >ALL  </ListGroup.Item>
                        : null }
                        {yearRange.map((yr, index)=>{
                            if(yr.toString().includes(searchStr)){
                                return <ListGroup.Item key={index} id={yr} action onClick={(event)=>clickHandler(event, "year")} variant="light" active={ year === yr.toString() } >{ yr }</ListGroup.Item>;
                            }
                            return null;
                        })} 
                    </ListGroup>
                </Col>

                <Col lg={4}>
                    <ListGroup >
                        <ListGroup.Item id='narayan' action variant="light" onClick={(event)=>clickHandler(event, "name")}  active={ name === 'narayan' } > Naryan</ListGroup.Item>
                        <ListGroup.Item id='savita' action variant="light" onClick={(event)=>clickHandler(event, "name")} active={ name === 'savita' } >Savita</ListGroup.Item>
                        <ListGroup.Item id='arpan' action variant="light" onClick={(event)=>clickHandler(event, "name")} active={ name === 'arpan' } >Arpan</ListGroup.Item>
                        <ListGroup.Item id='sakshi' action variant="light" onClick={(event)=>clickHandler(event, "name")} active={ name === 'sakshi' } >Sakshi</ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col lg={4}>
                    <ListGroup >
                        <ListGroup.Item id="credit" action variant="light" onClick={(event)=>clickHandler(event, "direction")}  active={ direction === 'credit' } >Credit</ListGroup.Item>
                        <ListGroup.Item id="debit" action variant="light" onClick={(event)=>clickHandler(event, "direction")}  active={ direction === 'debit' } >Debit</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row >
                <Button variant="outline-secondary" size='lg' onClick={setTableParametersHandler} className={[styles.button, ( blink ? styles.blink : "")].join(" ")} >Get Data</Button>
                {/* <Button variant="outline-secondary" size='lg' onClick={showHandler} disabled={ year === "all" } className={[styles.button, (year === "all" ? styles.notAllowed : "")].join(" ")} >Enter New Data</Button>  */}
                <Button variant="outline-secondary" size='lg' onClick={showHandler} className={styles.button} >Enter New Data</Button> 
            </Row>



                <Modal show={show} onHide={closeHandler} className={styles.modal}  >
                    <Modal.Header closeButton>
                    <Modal.Title>New Data Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicDate"> 
                                <Form.Label>Date</Form.Label>
                                <Form.Control name="date" type="date" value={date} onChange={changeHandler} min={min} max={max} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicNoDate"> 
                                <Form.Check name="noDate" label="No Date" type="checkbox" checked={noDate} onChange={changeHandler}  />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicYear"> 
                                <Form.Label>Year</Form.Label>
                                <Form.Control name="year" type="text" value={year} disabled />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="name" type="text" defaultValue={name.toUpperCase()} disabled  />
                            </Form.Group>

                            <Form.Group controlId="credit" >
                                <Form.Label>Type</Form.Label>
                                <Form.Check name="direction" type="radio" label="Credit" checked={direction === "credit"} onChange={changeHandler} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="debit" >
                                <Form.Check name="direction" type="radio" label="Debit" checked={direction === "debit"} onChange={changeHandler} />
                            </Form.Group>  

                            <Form.Group className="mb-3" controlId="formBasicAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="number" placeholder="Enter amount" onChange={changeHandler} value={Number(amount)} />
                                { amountValidationFail ? <div className={styles.validationFail} ><span> { ExclamationIcon } </span><span> Amount must be greater than zero </span> </div> : null }
                            </Form.Group> 

                            <Form.Group className="mb-3" controlId="formBasicNarration">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" placeholder="Enter description" onChange={changeHandler} value={description} />
                                { narrationValidationFail ? <div className={styles.validationFail} ><span> { ExclamationIcon } </span><span>Description must contain some descriptive text</span></div> : null }
                            </Form.Group> 
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={closeHandler}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={submitHandler}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Container>
    );
}

export default WithLoadingInfo(React.memo(Controls));