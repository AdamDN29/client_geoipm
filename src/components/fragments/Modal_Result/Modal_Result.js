import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {Row, Col, Divider} from 'react-bootstrap';
import styles from './styles.module.css';
import separatorNumber from '../../../hook/separatorNumber';

export default function Modal_Result(props) {
    const { max, min, data, tingkat, tahun, textDataType, dataType } = props;

    let roundedMax = max.toFixed(2);
    let roundedMin = min.toFixed(2);

    let text1 = "";
    let text2 = "";
  
    if(dataType === "PPD"){
      text1 = "Rp. "
      roundedMax = separatorNumber(roundedMax*1000);
      roundedMin = separatorNumber(roundedMin*1000);
    }
    else if(dataType === "UHH" || dataType === "AHLS" || dataType === "ARLS"){
      text1 = ""; text2= " Tahun";
    }

    let kel1 = [];
    let kel2 = [];
    let kel3 = [];

    data.sort( (a,b) => b.value - a.value );

    data.forEach(element => {
        if(element.value > max){
            kel1.push(element)
        }
        else if(element.value < min){
            kel3.push(element);
        }
        else{
            kel2.push(element);
        }
    });

    // kel1.sort( (a,b) => b.value - a.value );
    // kel2.sort( (a,b) => b.value - a.value );
    // kel3.sort( (a,b) => b.value - a.value );

    let percenKel1 = ((kel1.length / data.length)*100).toFixed(2);
    let percenKel2 = ((kel2.length / data.length)*100).toFixed(2);
    let percenKel3 = ((kel3.length / data.length)*100).toFixed(2);

    const showprediksiData = (nama_wilayah, value, ipmvalue, index) => {
        return(
            <>
            <p className={styles.list}>
                {index}. {nama_wilayah} <br></br>&nbsp;&nbsp;
                {"  - "}IPM {tahun}: {value} {text2} <br></br>&nbsp;&nbsp;
                {"  - "}IPM {tahun-1}: {ipmvalue} {text2} <br></br>&nbsp;&nbsp;
                {"  - "}Selisih : {(value-ipmvalue).toFixed(3)} <br></br>
            </p>   
            </>
        )
    }

    return (
        <Modal
        {...props}
        size="lg"
        dialogClassName={styles.modal}
        aria-labelledby="contained-modal-title-vcenter"
        
        centered 
        >
        <Modal.Header className={styles.header} closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Hasil
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.header}>
            <p className={styles.dataTitle}><b>Data {textDataType === "Prediksi"? (<>Hasil Prediksi IPM</>):<>{textDataType}</>} Tingkat {tingkat === "Nasional" ? (<>Provinsi</>):(<>Kabupaten/Kota</>)} Tahun {tahun}</b></p>
            <p><Row classNames={styles.row1} >
                <Col>Total Data : {data.length} </Col>
                <Col>Nilai Batas Atas  : {text1}{roundedMax}{text2}</Col>
                <Col>Nilai Batas Bawah  : {text1}{roundedMin}{text2}</Col>
            </Row></p>
            {/* <p>Total Data : {data.length} </p>
            <p>Nilai Max  : {roundedMax}</p>
            <p>Nilai Min  : {roundedMin}</p> */}

            <Row classNames={styles.row1}>
                <Col>
                    <Row><p className={styles.kel1}><b> Kelompok 1</b></p></Row>
                    <div className={styles.listField}>
                        {
                            kel1.map((data, i) => {
                                let nama_wilayah;
                                let value = data.value;
                                let ipmvalue = data.ipm;

                                if(dataType === "PPD"){
                                    value = separatorNumber(data.value*1000);
                                }
                                if(tingkat === "Nasional"){
                                    nama_wilayah = data.Provinsi.nama_provinsi;
                                }else{
                                    nama_wilayah = data.Kabupaten_Kotum.nama_kabupaten_kota;
                                }
                                return(
                                    <>
                                    {textDataType === "Prediksi" ? 
                                        (<>{showprediksiData(nama_wilayah, value, ipmvalue, i+1)} </>):                   
                                        (<><p className={styles.list}>{i+1}. {nama_wilayah} ({text1} {value} {text2})</p></>)
                                    }      
                                    </>              
                                )
                            })
                        }
                    </div>
                    <Row><p className={styles.totalList}>{dataType} <span>{`> ${text1}${roundedMax}` || '...'}{text2}</span> </p></Row>
                    <Row><p className={styles.totalList}>Total : {kel1.length} ({percenKel1}%)</p></Row>   
                </Col>
                <Col>
                    <Row><p className={styles.kel2}><b> Kelompok 2</b></p></Row>
                    <div className={styles.listField}>
                        {
                            kel2.map((data, i) => {
                                let nama_wilayah;
                                let value = data.value;
                                let ipmvalue = data.ipm;

                                if(dataType === "PPD"){
                                    value = separatorNumber(data.value*1000);
                                }
                                if(tingkat === "Nasional"){
                                    nama_wilayah = data.Provinsi.nama_provinsi;
                                }else{
                                    nama_wilayah = data.Kabupaten_Kotum.nama_kabupaten_kota;
                                }
                                let rowIndex = kel1.length + i;
                                return(
                                    <>
                                    {textDataType === "Prediksi" ? 
                                        (<>{showprediksiData(nama_wilayah, value, ipmvalue, rowIndex+1)} </>):                   
                                        (<><p className={styles.list}>{rowIndex+1}. {nama_wilayah} ({text1} {value} {text2})</p></>)
                                    }    
                                    </>   
                                )
                            })
                        }
                    </div>    
                    <Row><p className={styles.totalList}><span>{text1}{roundedMin || '...'} ≤ {dataType} ≤ {text1}{roundedMax || '...'}{text2}</span> </p></Row>
                    <Row><p className={styles.totalList}>Total : {kel2.length} ({percenKel2}%)</p></Row>   
                </Col>
                <Col>
                    <Row><p className={styles.kel3}><b> Kelompok 3</b></p></Row>
                    <div className={styles.listField}>
                        {
                            kel3.map((data, i) => {
                                let nama_wilayah;
                                let value = data.value;
                                let ipmvalue = data.ipm;

                                if(dataType === "PPD"){
                                    value = separatorNumber(data.value*1000);
                                }
                                if(tingkat === "Nasional"){
                                    nama_wilayah = data.Provinsi.nama_provinsi;
                                }else{
                                    nama_wilayah = data.Kabupaten_Kotum.nama_kabupaten_kota;
                                }
                                let rowIndex = kel1.length + kel2.length + i;
                                return(
                                    <>
                                    {textDataType === "Prediksi" ? 
                                        (<>{showprediksiData(nama_wilayah, value, ipmvalue, rowIndex+1)} </>):                   
                                        (<><p className={styles.list}>{rowIndex+1}. {nama_wilayah} ({text1} {value} {text2})</p></>)
                                    }    
                                    </>   
                                )
                            })
                        }
                    </div>
                    <Row><p className={styles.totalList}>{dataType} <span>{`< ${text1}${roundedMax}` || '...'}{text2}</span> </p></Row>
                    <Row><p className={styles.totalList}>Total : {kel3.length} ({percenKel3}%)</p></Row>   
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
        </Modal>
    );
}