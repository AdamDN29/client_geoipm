import React from 'react';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

import styles from '../pages/Table_Data/styles.module.css'
import { Button} from 'react-bootstrap'

const exportData = ({excelData, fileName, flag}) =>{

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const convertData = async (excelData) => {
        const dataKu = excelData.map((data,i) => {
            return  {
                "No": i + 1,
                "Nama Wilayah": data.Wilayah.nama_wilayah,
                "Tahun": data.tahun,
                "UHH": data.uhh,
                "AHLS": data.ahls,
                "ARLS": data.arls,
                "PPD": data.ppd,
                "IUHH": data.iuhh,
                "IPTHN": data.ipthn,
                "IPLRN": data.iplrn,
                "IPM": data.ipm,
                "Model MGWR": data.mgwr
            }
        })
        console.log(dataKu);

        return dataKu;
    }

    const saveFile = async (dataConvert) => {
        const ws = XLSX.utils.json_to_sheet(dataConvert);
        const wb = { Sheets: { 'data': ws}, SheetNames: ['data']};
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], { type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension)
    }

    const exportToExcel = async () => {
        console.log(excelData)
        console.log(fileName)

       const dataConvert = await convertData(excelData);
       console.log("Data :", dataConvert)

       const saveProcess = await saveFile(dataConvert); 
    }

    return (
        <Button variant="light" className={styles.buttons} 
            onClick={(e) => exportToExcel(fileName)}>
            Unduh {flag}
        </Button> 
    )

}

export default exportData;