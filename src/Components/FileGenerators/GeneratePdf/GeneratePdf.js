import React from 'react';
// import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import styles from './GeneratePdf.module.css';
import {  Button } from 'react-bootstrap';
import { dayWithMonthNameHandler } from '../../../utils';

const GeneratePdf = (props) => {

    const { name, year, creditData, debitData, refContainer } = props;

    // const downloadPdfHandler1 = () =>{ // preserved for cases where webpage needs to be snapshotted programmatically.
    //     let element = refContainer.current;
    //     html2canvas(element).then(function(canvas){
    //         const docImage = canvas.toDataURL("image/png");
    //         let pdf =  new jsPDF('l', 'mm', "a4");
    //         let width = pdf.internal.pageSize.getWidth() ;
    //         let height = canvas.offsetHeight;
    //         pdf.addImage(docImage, 'PNG', 0 ,0, width, height);
    //         pdf.save(`${name}_${year}.pdf`);
    //     });
    // }

    const downloadPdfHandler = () =>{

        const head = [
            ["","", "", "", `${name.toUpperCase()}_${year}`,"", "", ""],
            ["","", "Credit","","","", "Debit","", ""],
            ["S.No", "Date", "Description", "Amount", "","Date", "Description", "Amount"]
        ];

        let dataBody = [];

        for(let i = 0; i < (creditData.length >= debitData.length ? creditData.length : debitData.length); i++){
            dataBody[i] = [];
            if(creditData[i]){
                dataBody[i].push(`${i + 1}`, `${dayWithMonthNameHandler(creditData[i].date)}`, creditData[i].description, `${creditData[i].amount}`, "");
            }
            else{
                dataBody[i].push(`${i + 1}`,"","","","");
            }

            if(debitData[i]){
                dataBody[i].push( `${dayWithMonthNameHandler(creditData[i].date)}`, debitData[i].description, `${debitData[i].amount}`, "");
            }
            else{
                dataBody[i].push("","","","");
            }
        }

        let doc = new jsPDF('l', 'mm', "a4");
        
        doc.autoTable({
            head: head,
            body: dataBody,
            theme: "grid",
            headStyles: { fontStyle: 'bold', fontSize: 12, fillColor: "#5e5959" }
          })
          
          doc.save(`${name}_${year}.pdf`)
    }
    

    return(<>

        <Button onClick={()=>downloadPdfHandler()} variant="dark" >
            Download as Pdf
        </Button>
    </>);
}

export default GeneratePdf;