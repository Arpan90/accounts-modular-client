import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Controls from './Components/Controls/Controls';
import React, { useEffect, useRef, useState } from 'react';
import TableYear from './Components/TableYear/TableYear';
import WithLoadingInfo from './HOC/WithLoadingInfo/WithLoadingInfo';
import axios from './axios';
import { 
        Row, 
        Col,
      } from 'react-bootstrap';

function App(props) {

  console.log("app hit");
  const [ formData, setFormData ] = useState( { name:"", year: "" } );
  const [ dataAll, setDataAll ] = useState([]);
  const [ noData, setNoData ] = useState(false);
  const [deletedYear, setDeletedYear] = useState("");

  const isMounted = useRef(false);
  // const preventRefire = useRef(false);

  const { setShowLoader, setMsg, setSuccess, showLoader } = props;
  
  useEffect(() =>{

    const getAllDataHandler = (name, year) =>{
      console.log("getalldata hit");
      setDeletedYear("");
      setShowLoader(true);
  
      axios.get('/api/items', { params: { name: name, year: year } })
             .then((res) =>{
               console.log("response is: ", res.data, name, year);
               if(Array.isArray(res.data)){
                 let arrangedData = res.data;
                  if(arrangedData.length){
                      arrangedData.sort((a, b) =>{
                      return -(Number(a.year.split('-')[0]) - Number(b.year.split('-')[0]));
                    });
                    setDataAll(arrangedData);
                    if(noData){
                      setNoData(false);
                    }
                  }
                  else{
                    setNoData(true);
                  }
                  // preventRefire.current = true;
               }
               else if(res.data.message){
                setMsg("Could not load data. Please check your network connection"); // connection error from backend
                console.log("error in then is: ", res.data.message, year);
                setSuccess(false);
            }
             })
             .catch((err) =>{
                setMsg("Could not load data. Please check your network connection"); // axios timeout exceeded
                console.log("error in catch is: ", err, year);
                setSuccess(false);
             })
             .finally(()=>{
               setShowLoader(false);
             })
    };

    
    if(formData.year === 'all'){
      // if(preventRefire.current){
        // console.log("culprit???")
        // preventRefire.current = false;
        // return;
      // }
      let { name, year } = formData;
      getAllDataHandler(name, year);
    }
  }, [formData, setMsg, setSuccess, setShowLoader, noData ]);

  useEffect(()=>{
    if(!isMounted.current){
      isMounted.current = true;
      return;
    }
    if(deletedYear){
      let newData = dataAll.filter((element, index) => element.year !== deletedYear)
      if(!newData.length){
        console.log('culprit ???');
        // setDataAll([]);
        setNoData(true);
      }
      else{
        setDataAll(newData)
      }
      setMsg("Deletion successful !");
      setSuccess(true);
    }
    
  }, [ setMsg, setSuccess, deletedYear]);

  const stateUpdateHandler = (val) => {
      console.log("stateupdatehandler app.js", dataAll, noData);
      setFormData(val);
  }
  console.log('culprit app rendered')
  return (
    <div className="App"  >


            <Controls setFormData = {stateUpdateHandler}  /> 
            <div className="nameStyle" >{ formData.name.toUpperCase() }</div>
            { formData.year === 'all' && !showLoader  ? 
              ! noData ?
              dataAll.map((item, index) =>{
                  return <TableYear key={index} formData={{...formData, year: item.year }} dataAll={item.entries} setDeletedYear={setDeletedYear} />
                
              })
              : <Row className="pt-5 ps-5 pe-5  col-lg-11"  > 
                  <Col className="noDataStyles" >No entries for this person.</Col>    
                </Row>

            : formData.year && !showLoader ? <TableYear formData={ formData }  /> : null
            }
      
    </div>
  );
}

export default WithLoadingInfo(App);