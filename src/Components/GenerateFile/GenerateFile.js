import React from 'react';
import styles from './GenerateFile.module.css';
import xlsx from 'json-as-xlsx';
// import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {  Button } from 'react-bootstrap';
import { dayWithMonthNameHandler } from '../../utils';

const GenerateFile = (props) => {

    const { name, year, creditData, debitData, extension } = props;

    const textCurationHandler = (val) =>{
        return `"${val}"`;
    }

    const downloadFileHandler = () =>{
        if(extension === 'csv'){
            downloadCsvHandler();
        }
        else if(extension === 'pdf'){
            downloadPdfHandler();
        }
    }


    const downloadCsvHandler = () =>{
        const headers = `,,,,${name.toUpperCase()} ${year},,,,\nCredit,,,,, Debit,,  \n S.No., Date, Description, Amount,, S.No., Date, Description, Amount\n`;
        console.log(creditData);
        let csvString = headers;
        let creditItem = "";
        let debitItem = "";
        for(let i = 0; i < (creditData.length >= debitData.length ? creditData.length : debitData.length); i++){
            if(creditData[i]){
                creditItem = `${i + 1}, ${dayWithMonthNameHandler(creditData[i].date)},${textCurationHandler(creditData[i].description)},${creditData[i].amount},,`
            }
            else{
                creditItem = `,,,,,`
            }

            if(debitData[i]){
                debitItem = `${i + 1}, ${dayWithMonthNameHandler(debitData[i].date)},${textCurationHandler(debitData[i].description)},${debitData[i].amount}\n`
            }
            else{
                debitItem = `,,,,\n`
            }

            csvString += creditItem + debitItem;
        }
        console.log("csvString: ", csvString);

        const blob = new Blob([csvString], {type: 'text/csv'});
        let url = window.URL.createObjectURL(blob);
        console.log("url is: ", url);
        console.log("blob is: ", blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${name}_${year}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }


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

    const downloadCsvHandler1 = (creditData, debitData) =>{ // unused function to create .xlsx file. Use exceljs library instead of json-as-xlsx
        // let xlsx = require('json-as-xlsx')
        let content = [];
        console.log("initial data is: ", creditData, debitData);
        let debitData1 = debitData.map((item,index) =>{
                            let item1 = {...item};
                            for(const key of Object.keys(item)){
                                item1[`${key + '1'}`] = item1[key];
                                delete item1[key];
                            }
                            item1["index1"] = index + 1;
                            return item1;
                        });

        console.log("dataData1: ", debitData1);    

        for(let i = 0; i < (creditData.length >= debitData1.length ? creditData.length : debitData1.length); i++){
            if(creditData[i]){
                content[i] = creditData[i];
                content[i]["index"] = i + 1;
            }
            else{
                content[i] = {index:"", date: "", description: "", amount: ""};
            }

            if(debitData1[i]){
                
                content[i] = {...content[i], ...debitData1[i]};
            }
            else{
                content[i] = {...content[i], ...{index1:"", date1: "", description1: "", amount1: ""} };
            }
        }

        // console.log("content: ", content);str.replace(/(.{5})/g,"$1\n ");

        content.unshift({ 'index':'S.No.', 'date':'Date', 'description':'Description', 'amount': 'Amount', 'index1':'S.No.', 'date1':'Date', 'description1':'Description', 'amount1': 'Amount' });
        content.unshift({ 'index':' ', 'date':' ', 'description':'Credit', 'amount': ' ', 'index1':' ', 'date1':' ', 'description1':'Debit', 'amount1': ' ' });
        let data = [
        {
            sheet: `${name.toUpperCase()} ${year}`,
            columns: [
                { label: ' ', value: 'index' }, // Top level data
                { label: '   ', value: 'date' }, // Run functions
                { label: '    ', value: 'description' }, 
                { label: '     ', value: 'amount' }, 
                { label: 'Name. ', value: 'index1' }, 
                { label: '      ', value: 'date1' }, 
                { label: '       ', value: 'description1' }, 
                { label: '        ', value: 'amount1' }, 
            ],

            // columns: [
            //     { label: 'S.No.', value: 'index' }, // Top level data
            //     { label: 'Date', value: row => ( dayWithMonthNameHandler(row.date)) }, // Run functions
            //     { label: 'Description', value: 'description' }, 
            //     { label: 'Amount', value: 'amount' }, 
            //     { label: 'S.No. ', value: 'index1' }, 
            //     { label: 'Date ', value: row => ( dayWithMonthNameHandler(row.date1)) }, 
            //     { label: 'Description ', value: 'description1' }, 
            //     { label: 'Amount ', value: 'amount1' }, 
            // ],
            content: content
        }
        ]

        let settings = {
        fileName: `${name}_${year}`, // Name of the spreadsheet
        extraLength: 0, // A bigger number means that columns will be wider
        writeOptions: {alignment: "wrapText"} // Style options from https://github.com/SheetJS/sheetjs#writing-options
        }

        xlsx(data, settings) // Will download the excel file
    }

    return(
        <Button onClick={downloadFileHandler} variant = {`${extension === 'csv' ? 'primary' : 'dark'}`} >
            {`Download as ${extension.toUpperCase()}`}
        </Button>
    );
}

export default GenerateFile;