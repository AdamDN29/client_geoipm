import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {Row, Col, Table} from 'react-bootstrap';
import styles from './styles.module.css';
import separatorNumber from '../../../hook/separatorNumber';

export default function Modal_Result(props) {
    const { max, min, Q1, Q2, Q3, Q4, data, tingkat, tahun, textDataType, dataType } = props;

    let roundedMax, roundedMin, roundedQ1, roundedQ2, roundedQ3, roundedQ4;

    if(max !== 0){
        roundedMax = max.toFixed(2);
        roundedMin = min.toFixed(2);
      }else{
        roundedQ1 = Q1.toFixed(5);
        roundedQ2 = Q2.toFixed(5);
        roundedQ3 = Q3.toFixed(5);
        roundedQ4 = Q4.toFixed(5);
    }

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

    const stylesTable = {maxHeight: '400px', overflowY: "scroll", marginBottom: "10px"}
    const stylesHeaderBody = {position: "sticky", top: "-5px" }
    const stylesHeader = {textAlign: 'center', backgroundColor: '#B8D9A0'}
    const stylesNameRow = {textAlign: 'left'}

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
                <p className={styles.dataTitle}><b>Data {max === 0? (<>Estimasi Parameter Model GWR</>):<>{textDataType}</>} Tingkat {tingkat === "Nasional" ? (<>Provinsi</>):(<>Kabupaten/Kota</>)} Tahun {tahun}</b></p>
                <p><Row classNames={styles.row1} >
                    <Col>Total Data : {data.length} </Col>
                    {max !== 0?(<>
                        <Col>Nilai Batas Atas  : {text1}{roundedMax}{text2}</Col>
                        <Col>Nilai Batas Bawah  : {text1}{roundedMin}{text2}</Col>
                    </>):(<>
                        <Col xs={3}>Parameter pada Peta  : {text1}{dataType}{text2}</Col>
                        <Col>Nilai Q1  : {text1}{roundedQ1}{text2}</Col>
                        <Col>Nilai Q2 : {text1}{roundedQ2}{text2}</Col>
                        <Col>Nilai Q3  : {text1}{roundedQ3}{text2}</Col>
                        <Col>Nilai Q4  : {text1}{roundedQ4}{text2}</Col>

                    </>)}
                </Row></p>
                {/* <p>Total Data : {data.length} </p>
                <p>Nilai Max  : {roundedMax}</p>
                <p>Nilai Min  : {roundedMin}</p> */}
                {
                    max !== 0? (<>
                        <Row classNames={styles.row1}>
                            <Col>
                                <Row><p className={styles.kel1}><b> Kelompok 1</b></p></Row>
                                <div className={styles.listField}>
                                    {
                                        kel1.map((data, i) => {
                                            let nama_wilayah;
                                            let value = data.value;
            
                                            if(dataType === "PPD"){
                                                value = separatorNumber(data.value*1000);
                                            }
                                            if(tingkat === "Nasional"){
                                                nama_wilayah = data.Provinsi.nama_provinsi;
                                            }else{
                                                nama_wilayah = data.Kabupaten_Kotum.nama_kabupaten_kota;
                                            }
                                            return(
                                                <><p className={styles.list}>{i+1}. {nama_wilayah} ({text1} {value} {text2})</p></>            
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
                                                <><p className={styles.list}>{rowIndex+1}. {nama_wilayah} ({text1} {value} {text2})</p></>   
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
                                                <><p className={styles.list}>{rowIndex+1}. {nama_wilayah} ({text1} {value} {text2})</p></>   
                                            )
                                        })
                                    }
                                </div>
                                <Row><p className={styles.totalList}>{dataType} <span>{`< ${text1}${roundedMax}` || '...'}{text2}</span> </p></Row>
                                <Row><p className={styles.totalList}>Total : {kel3.length} ({percenKel3}%)</p></Row>   
                            </Col>
                        </Row>
                    </>):(<>
                        <Row classNames={styles.row1}>
                            <div style={stylesTable}>
                            <Table striped bordered hover responsive="sm" className={styles.tableStyles} >
                                <thead style={stylesHeaderBody}>
                                    <tr style={stylesHeader}>
                                        <th style={stylesHeader}>No</th>
                                        <th style={stylesHeader}>Nama Wilayah</th>
                                        <th style={stylesHeader}>Model GWR</th>
                                        <th style={stylesHeader}>Est Intercept</th>
                                        <th style={stylesHeader}>Est IUHH</th>
                                        <th style={stylesHeader}>Est IPTHN</th>
                                        <th style={stylesHeader}>Est IPLRN</th>
                                        <th style={stylesHeader}>IPM Prediksi</th>
                                        <th style={stylesHeader}>IPM</th>
                                        <th style={stylesHeader} >Selisih</th>
                                    </tr>
                                </thead>    
                                <tbody>  
                                    {
                                        data.map((data,i) =>{
                                            let nama_wilayah
                                            if(tingkat === "Nasional"){
                                                nama_wilayah = data.Provinsi.nama_provinsi;
                                            }else{
                                                nama_wilayah = data.Kabupaten_Kotum.nama_kabupaten_kota;
                                            }
                                            return(
                                            <tr key={i}>
                                                <td>{i+1}</td>
                                                <td style={stylesNameRow}>{nama_wilayah} </td>      
                                                <td>{data?.intercept + "+" + data?.iuhh + "+" + data?.ipthn + "+" + data?.iplrn}</td>                  
                                                <td>{data?.intercept}</td>
                                                <td>{data?.iuhh}</td>
                                                <td>{data?.ipthn}</td>
                                                <td>{data?.iplrn}</td>
                                                <td>{(data.intercept + (data.iuhh * data.iuhh_r) + (data.ipthn* data.ipthn_r) + (data.iplrn * data.iplrn_r)).toFixed(5)}</td>
                                                <td>{data?.ipm}</td>
                                                <td>{((data.intercept + (data.iuhh * data.iuhh_r) + (data.ipthn* data.ipthn_r) + (data.iplrn * data.iplrn_r)) - data.ipm).toFixed(5)}</td>
                                                
                                            </tr>
                                        )})
                                    } 
                                </tbody>                   
                            </Table>  
                            </div>
                        </Row>
                        <Row>
                            <p>Perhitungan IPM Prediksi berdasarkan model GWR <br/>
                            IPM Prediksi = Intercept + (IUHH * Estimasi IUHH) + (IPTHN * Estimasi IPTHN) + (IPLRN * Estimasi IPLRN)
                            </p>   
                        </Row>
                    </>)
                }
                
            </Modal.Body>
       
        
        <Modal.Footer >
         
             
        </Modal.Footer>
        </Modal>
    );
}