import React, { useCallback, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import './Message.css';

const Message = (props) => {

    const { msg, success, setMsg } = props;

    const closeHandler = useCallback(() =>{
        setMsg("");
    },[setMsg]);

    useEffect(() => {
            let timer = setTimeout(() => {
                closeHandler();
                clearTimeout(timer);
            }, 5000);

            return function cleanup(){
                clearTimeout(timer);
            }

    }, [msg, closeHandler]);

    useEffect(() => {
        console.log("message.js: ", msg, success, props);
    })

    return( msg ?
        <div className="alertBox" >
            <Alert variant={ success ? "success" : "danger" }   >
                { msg }
            </Alert> 
        </div> : null
         
    );
}

export default React.memo(Message);