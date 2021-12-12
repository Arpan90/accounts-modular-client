import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from './TableYear.module.css';
import axios from '../../axios';
import AddButton from '../../UI/AddButton/AddButton';
import EditButton from '../../UI/EditButton/EditButton';
import DeleteButton from '../../UI/DeleteButton/DeleteButton';
import GenerateFile from '../GenerateFile/GenerateFile';
// import GeneratePdf from '../FileGenerators/GeneratePdf/GeneratePdf';
import WithLoadingInfo from '../../HOC/WithLoadingInfo/WithLoadingInfo';
import { dayWithMonthNameHandler } from '../../utils';
import { Container, 
         Row, 
         Col,
         Table,
        } from 'react-bootstrap';

const TableYear = (props) => {
    
    const [ data, setData ] = useState([]);
    const [ creditFileData, setCreditFileData ] = useState([]);
    const [ debitFileData, setDebitFileData ] = useState([]);
    const [ creditTableRow, setCreditTableRow ] = useState(null);
    const [ debitTableRow, setDebitTableRow ] = useState(null);
    const [ creditSum, setCreditSum ] = useState(0);
    const [ debitSum, setDebitSum ] = useState(0);
    const [ noData, setNoData ] = useState(false);

    const { setShowLoader, setMsg, setSuccess, showLoader, success, setDeletedYear } = props;

    let { year, name } = props.formData;
    const refContainer = useRef();
    
    const updateTableHandler = useCallback((id, op, item ) =>{
        let temp = [];
        console.log("data updated1");
        switch(op){
            case 'del':
                console.log("data updated2");
                temp = data.filter((element, index) => element.id !== id );
                if(!temp.length){
                    console.log("test del");
                    if(props.dataAll){
                        setDeletedYear(year);
                        return;
                    }
                    else{
                        setNoData(true);
                    }
                }
                setMsg("Deletion successful !");
                setSuccess(true);
                console.log("data updated3");
                break;

            case 'edit':
                temp = data;
                temp[temp.findIndex((element)=> element.id === id)] = item;
                break;

            case 'add':
                temp = data;
                temp.push(item);
                if(temp.length === 1 && noData ){
                    setNoData(false);
                }
                break;

            default:
                break;
        }
        console.log("culprit temp is: ", temp);
        setData(temp);

    }, [data, noData, props.dataAll, setMsg, setSuccess, setDeletedYear, year ]);


    useEffect(() =>{

        const getDataHandler = () => {

            console.log("updateTableHandler hit");
            setShowLoader(true);
            axios.get('/api/items', { params: { name: name, year: year } }) 
            .then(res => {
                setShowLoader(false);
                console.log("table result: ", res);
                if(Array.isArray(res.data)){
                    if(res.data.length){
                        if(noData){
                            setNoData(false);
                        }
                        console.log("table updated");
                        setData(res.data[0].entries);
                    }
                    else{
                        setNoData(true);
                    }
                }
                
                else if(res.data.message){
                    setMsg("Could not load data. Please check your network connection"); // connection error from backend
                    console.log("error in then is: ", res.data.message, year);
                    setSuccess(false);
                }
            })
            .catch(err =>{ 
                setShowLoader(false);
                setMsg("Could not load data. Please check your network connection"); // axios timeout exceeded
                console.log("error in catch is: ", err, year);
                setSuccess(false);
            })
            // .finally(() => {
            //     setShowLoader(false);
            // });
        }

        if(props.dataAll){
            console.log("dataAll given");
            setData(props.dataAll);
            return;
        }

        getDataHandler();
       
    },[props.formData, props.dataAll, name, setMsg, setShowLoader, setSuccess, year, noData ]) 

    useEffect(() => {
        let inFileData = [];
        let outFileData = [];
        console.log("second effect");
        let i = 0;
        let j = 0;
        let creditSum = 0;
        let debitSum = 0;
        console.log("culprit data: ", data);
        let creditData = data.map((item, index) =>{
                                console.log("item: ", item)
                                if(item.direction === 'credit'){
                                    i += 1;
                                    inFileData.push(item);
                                    creditSum += item.amount;
                                    item.year = year;
                                    item.name = name;
                                    return (
                                                <tr key = {index} >
                                                    <td>{ i }</td>
                                                    <td className={styles.date} >{ !item.noDate ? dayWithMonthNameHandler(item.date) : null  }</td>
                                                    <td className={styles.description} >{ item.description }</td>
                                                    <td>{ item.amount }</td>
                                                    <td className={styles.actions} > 
                                                        <EditButton formData = {item} 
                                                                    toUpdate={ item.id }
                                                                    showLoader={ showLoader }
                                                                    setShowLoader={setShowLoader}
                                                                    setMsg={setMsg}
                                                                    setSuccess={setSuccess}
                                                                    success={success}
                                                                    updateTableHandler={updateTableHandler} />

                                                        <DeleteButton   formData = {item} 
                                                                        toUpdate={ item.id }
                                                                        showLoader={ showLoader }
                                                                        setShowLoader={setShowLoader}
                                                                        setMsg={setMsg}
                                                                        setSuccess={setSuccess}
                                                                        updateTableHandler={updateTableHandler} />
                                                    </td>
                                                </tr>
                                            )
                                }
                                return null; 
                                
                            });

        let debitData = data.map((item, index) =>{
                                console.log("item: ", item)
                                if(item.direction === 'debit'){
                                    j += 1;
                                    outFileData.push(item);
                                    debitSum += item.amount;
                                    item.year = year;
                                    item.name = name;
                                    return (
                                                <tr key = {index} >
                                                    <td>{ j }</td>
                                                    <td>{ !item.noDate ? dayWithMonthNameHandler(item.date) : null }</td>
                                                    <td className={styles.description} >{ item.description }</td>
                                                    <td>{ item.amount }</td>
                                                    <td className={styles.actions} > 
                                                        <EditButton formData = {item} 
                                                                    toUpdate={ item.id }
                                                                    showLoader={ showLoader }
                                                                    setShowLoader={setShowLoader}
                                                                    setMsg={setMsg}
                                                                    setSuccess={setSuccess}
                                                                    success={success}
                                                                    updateTableHandler={updateTableHandler} />
                                                                    
                                                        <DeleteButton   formData = {item} 
                                                                        toUpdate={ item.id }
                                                                        showLoader={ showLoader }
                                                                        setShowLoader={setShowLoader}
                                                                        setMsg={setMsg}
                                                                        setSuccess={setSuccess}
                                                                        updateTableHandler={updateTableHandler} />
                                                    </td>
                                                </tr>
                                            )
                                }
                                return null;
                                
                            });

        setCreditTableRow(creditData);
        setDebitTableRow(debitData);
        setCreditFileData(inFileData);
        setDebitFileData(outFileData);
        setCreditSum(creditSum);
        setDebitSum(debitSum);

    }, [data, name, year, updateTableHandler, noData, setMsg, setShowLoader, setSuccess, showLoader, success ]);

    return( data.length || (noData && !props.dataAll) ?
        <Container fluid className="bg-light" ref={refContainer} id="printable" >
            {/* {
              data.length || (noData && !props.dataAll) ? */}
                <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                    <Col className={styles.year} >{ year }</Col>    
                 </Row> 
            {/* } */}
            
            { noData ? 
                <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                    <Col className={styles.noDataStyles} >No entries for this year.</Col>    
                    {/* <Col className={styles.noDataStyles} >{`No entries for this ${props.dataAll ? 'person' : 'year'}.`}</Col>     */}
                </Row> :<>
            <Row  className="ps-5 pe-5 col-lg-11">
                <Table striped bordered hover className={styles.tableWidth} >
                    <thead>
                        <tr>
                            <th  colSpan="5" >Credit</th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { creditTableRow }
                        <tr>
                            <td colSpan="5" >       <AddButton     
                                                            formData = {{name: name, year: year, direction: "credit" }} 
                                                            showLoader={ showLoader }
                                                            setShowLoader={setShowLoader}
                                                            setMsg={setMsg}
                                                            setSuccess={setSuccess}
                                                            success={success}
                                                            updateTableHandler={updateTableHandler} />
                            </td>
                        </tr>
                        
                    </tbody>
                </Table>
                <Table striped bordered hover  className={styles.tableWidth} >
                    <thead>
                        <tr  >
                            <th  colSpan="5" >Debit</th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { debitTableRow }
                        <tr>
                            <td colSpan="5" >        <AddButton     
                                                            formData = {{name: name, year: year, direction: "debit" }} 
                                                            showLoader={ showLoader }
                                                            setShowLoader={setShowLoader}
                                                            setMsg={setMsg}
                                                            setSuccess={setSuccess}
                                                            success={success}
                                                            updateTableHandler={updateTableHandler} />
                            </td>
                        </tr>
                        
                    </tbody>
                </Table>
            </Row>

            {/* <Row className="pt-5 ps-5 pe-5  col-lg-11" >
                <GenerateCsv 
                            creditData={creditFileData}
                            debitData={debitFileData} />

                <GeneratePdf 
                            creditData={creditFileData}
                            debitData={debitFileData} />
            </Row> */}

            <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                <Table striped bordered hover className={styles.tableWidth} >
                    <thead>
                        <tr>
                            <th>Total Credit</th>
                            <th>Total Debit</th>
                            <th>Difference (I - O)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{ creditSum }</td>
                            <td>{ debitSum }</td>
                            <td>{ creditSum - debitSum }</td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
            <Table  className={styles.tableWidth} >
                <thead>
                    <tr>
                        <th>
                            <GenerateFile 
                                name={name}
                                year={year}
                                extension={'csv'}
                                creditData={creditFileData}
                                debitData={debitFileData} />
                        </th>
                        <th>
                            <GenerateFile
                                name={name}
                                year={year}
                                extension={'pdf'}
                                refContainer={refContainer}
                                creditData={creditFileData}
                                debitData={debitFileData} />
                        </th>
                    </tr>
                </thead>
            </Table>
             </> }
            
        </Container> : null
    );
}

export default WithLoadingInfo(React.memo(TableYear));