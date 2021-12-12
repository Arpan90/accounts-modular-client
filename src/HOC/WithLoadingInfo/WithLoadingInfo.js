import React, { useState } from 'react';
import Loader from '../../UI/Loader/Loader';
import Message from '../../UI/Message/Message';

const WithLoadingInfo = (WrappedComponent)  =>  {
    const HOC = (props) => {
        const [ showLoader, setShowLoader ] = useState(false);
        const [ msg, setMsg ] = useState("");
        const [ success, setSuccess ] = useState(true);

        return(<> 
            <Loader show={showLoader} /> 

            <Message msg={msg}
                    setMsg={setMsg}
                    success={success} />

            <WrappedComponent 
                            {...props} 
                            showLoader={showLoader} 
                            setShowLoader={setShowLoader}
                            msg={msg}
                            setMsg={setMsg}
                            success={success}
                            setSuccess={setSuccess} />
        </>);
    };
    return HOC ;
};

export default WithLoadingInfo;