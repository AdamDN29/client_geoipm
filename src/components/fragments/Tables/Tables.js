import React, { useEffect, useState, useMemo } from "react";
import styles from "./styles.module.css";
import { Row, Col, Table} from "react-bootstrap";
import separatorNumber from "../../../hook/separatorNumber";

import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import ipm_provinsiAPI from "../../../api/ipm_provinsiAPI";
import ipm_kab_kotAPI from "../../../api/ipm_kab_kotAPI";
import provinsiAPI from "../../../api/provinsiAPI";
import kab_kotAPI from "../../../api/kab_kotAPI";

export default function Tables({contentChanger, dataChanger, tableFlag, textTingkat, textTahun, dataTable, actionFlag, refreshFlag}) {
    
    // const [currentPage, setCurrentPage] = useState(1)

    useEffect (() => {
        console.log(dataTable)
    },[])

    // const styleHeader = () => {
    //     return {
    //         textAlign: "center", backgroundColor: "#B8D9A0"
    //     }
    // }
    // Tabel IPM
    // const column1 = [
    //     {
    //         dataField: 'no',
    //         text: 'No ',
    //         headerStyle: styleHeader,
    //         formatter: (cell, row, rowIndex) => {
    //             let rowNumber = (currentPage - 1) * 10 + (rowIndex + 1);
    //             return <span>{rowNumber}</span>;
    //         }
    //     },
    //     {
    //         dataField: 'id',
    //         text: 'Id ',
    //         hidden: !actionFlag,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"nama_wilayah",
    //         text:"Nama Wilayah ",
    //         sort: true,
    //         style: {textAlign: "left"},
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"tahun",
    //         text:"Tahun ",
    //         // hidden: flag3,
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"uhh",
    //         text:"UHH ",
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"ahls",
    //         text:"AHLS ",
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"arls",
    //         text:"ARLS ",
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"ppd",
    //         text:"PPD",
    //         sort: true,
    //         formatter: (cell) => {
    //             return  "Rp." + separatorNumber(cell * 1000);
    //         },
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"iuhh",
    //         text:"IUHH ",
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"ipthn",
    //         text:"IPTHN ",
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"iplrn",
    //         text:"IPLRN ",
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"ipm",
    //         text:"IPM ",
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"gwr",
    //         text:"GWR ",
    //         sort: true,
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"id",
    //         text:"Action",
    //         hidden: !actionFlag,
    //         formatter: (cell, row, rowIndex) => {
    //             return(
    //                 <Row className={styles.action}>
    //                     <Col className={styles.action}>
    //                         <button className={styles.buttons} onClick={() => EditData(cell)} >
    //                                 <FontAwesomeIcon icon={faEdit} />
    //                         </button>
    //                     </Col>
    //                     <Col className={styles.action}>
    //                         <button className={styles.buttons} onClick={() => DeleteData(cell)} >
    //                                 <FontAwesomeIcon icon={faTrash} />
    //                         </button>
    //                     </Col>
    //                 </Row>
    //             )
    //         },
    //         headerStyle: styleHeader
    //     },
    // ]
    // Tabel Wilayah
    // const column2 = [
    //     {
    //         dataField: 'no',
    //         text: 'No ',
    //         headerStyle: styleHeader,
    //         formatter: (cell, row, rowIndex) => {
    //             let rowNumber = (currentPage - 1) * 10 + (rowIndex + 1);
    //             return <span>{rowNumber}</span>;
    //         }
    //     },
    //     {
    //         dataField: 'id',
    //         text: 'Id ',
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"nama_wilayah",
    //         text:"Nama Wilayah ",
    //         sort: true,
    //         style: {textAlign: "left"},
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"latitude",
    //         text:"Latitude",
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"longitude",
    //         text:"Longitude",
    //         headerStyle: styleHeader
    //     },
    //     {
    //         dataField:"id",
    //         text:"Action",
    //         hidden: !actionFlag,
    //         formatter: (cell, row, rowIndex) => {
    //             return(
    //                 <Row className={styles.action}>
    //                     <Col>
    //                         <button className={styles.buttons} onClick={() => EditData(cell)} >
    //                                 <FontAwesomeIcon icon={faEdit} />
    //                         </button>
    //                     </Col>
    //                     {/* <Col className={styles.action}>
    //                         <button className={styles.buttons} onClick={() => DeleteData(cell)} >
    //                                 <FontAwesomeIcon icon={faTrash} />
    //                         </button>
    //                     </Col> */}
    //                 </Row>
    //             )
    //         },
    //         headerStyle: styleHeader
    //     },
    // ]
    // const options = {
    //     paginationSize : 10,
    //     hideSizePerPage : true,
    //     showTotal: true,
    //     onPageChange: page => {
    //         setCurrentPage(page);
    //     },
    //     page: currentPage
    //     // firstPageText: "First",
    // }

    function EditData (value) {
        console.log(value)  
        dataChanger(value)
        contentChanger("edit")
    }

    const DeleteData = async (value) => {
        console.log(value)
        if (window.confirm('Apakah Anda Yakin Ingin Menghapus Data?')) {
            fetchDeleteData(value);
        }       
    }

    const fetchDeleteData = async(value) => {
        var res;
        try{ 
            if (tableFlag === "showIPM"){
                if(textTingkat === "Nasional"){
                    res = await ipm_provinsiAPI.deleteDataIPM(parseInt(value));
                }else{
                    res = await ipm_kab_kotAPI.deleteDataIPM(parseInt(value));
                }    
            }else{
                if(textTingkat === "Nasional"){
                    res = await provinsiAPI.deleteData(parseInt(value));
                }else{
                    res = await kab_kotAPI.deleteData(parseInt(value));
                }    
            }  
            console.log(res)
            if (res.data.success === true) {
                alert("Data Berhasil Dihapus!")
                refreshFlag(true)
            }else if(res.data.success === false && res.data.flag === true){
              alert(res.message)
            }
        }catch(error){
            alert("Data Gagal Dihapus")
        }
    }

    

    const columnsIPM = ["Nama Wilayah", "Tahun", "UHH", "AHLS", "ARLS", "PPD","IUHH","IPTHN", "IPLRN", "IPM", "GWR"]
    const columnsWilayah = ["ID", "Nama Wilayah", "Latitude", "Longitude"]

    const stylesTable = {maxHeight: '510px', overflowY: "scroll"}
    const stylesHeaderBody = {position: "sticky", top: "-5px" }
    const stylesHeader = {textAlign: 'center', backgroundColor: '#B8D9A0'}
    const stylesNameRow = {textAlign: 'left'}

    return (
        <>
            {tableFlag === "showIPM" ? (
                <div className="table_container" >
                    <div style={stylesTable}> 
                    <Table striped bordered hover responsive="sm" className={styles.tableStyles} >
                        <thead style={stylesHeaderBody}>
                            <tr style={stylesHeader}>
                                <th style={stylesHeader}>No</th>
                                {
                                    actionFlag ? (<th style={stylesHeader}>ID</th>):(<></>)
                                }
                                {
                                    columnsIPM.map((column, i) =>
                                        (<th key={i} style={stylesHeader}>{column}</th>) )
                                }
                                {
                                    actionFlag ? (<th style={stylesHeader} colSpan={2}>Action</th>):(<></>)
                                }
                            </tr>
                        </thead>    
                        <tbody>  
                            {
                                dataTable.map((data,i) =>(
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        {actionFlag ? (<td>{data.id}</td>):(<></>)}
                                        <td style={stylesNameRow}>{data.nama_wilayah} </td>                         
                                        <td>{data.tahun}</td>
                                        <td>{data?.uhh}</td>
                                        <td>{data?.ahls}</td>
                                        <td>{data?.arls}</td>
                                        <td>Rp. {separatorNumber(data?.ppd * 1000)}</td>  
                                        <td>{data?.iuhh}</td>
                                        <td>{data?.ipthn}</td>
                                        <td>{data?.iplrn}</td>
                                        <td>{data?.ipm}</td>
                                        <td>{data?.gwr}</td>
                                        {
                                            actionFlag ? (
                                            <>
                                                <td>
                                                    <button className={styles.buttons} onClick={() => EditData(data.id)} >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className={styles.buttons} onClick={() => DeleteData(data.id)} >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </>):(<></>)
                                        }
                                    </tr>
                                ))
                            } 
                        </tbody>                   
                    </Table>  
                    </div>
                    <p> Menampilkan {dataTable.length} Data</p>
                </div>
                
                // <BootstrapTable 
                //     keyField="no" 
                //     data={dataTable} 
                //     columns={column1} 
                //     classes={styles.tableStyles}
                //     pagination={paginationFactory(options)}
                //     striped hover condensed
                //     style={{paddingLeft: "0px"}}
                // />
             
            ):(
                <div className="table_container" >
                <div style={stylesTable}> 
                <Table striped bordered hover responsive="sm" className={styles.tableStyles} >
                    <thead style={stylesHeaderBody}>
                        <tr style={stylesHeader}>
                            <th style={stylesHeader}>No</th>
                            {
                                columnsWilayah.map((column, i) =>
                                    (<th key={i} style={stylesHeader}>{column}</th>) )
                            }
                            {
                                actionFlag ? (<th style={stylesHeader} >Action</th>):(<></>)
                            }
                        </tr>
                    </thead>    
                    <tbody>  
                        {
                            dataTable.map((data,i) =>(
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    {actionFlag ? (<td>{data.id}</td>):(<></>)}
                                    <td style={stylesNameRow}>{data.nama_wilayah} </td>                         
                                    <td>{data?.latitude}</td>
                                    <td>{data?.longitude}</td>
                                    {
                                        actionFlag ? (
                                        <>
                                            <td>
                                                 <button className={styles.buttons} onClick={() => EditData(data.id)} >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </td>
                                        </>):(<></>)
                                    }
                                </tr>
                            ))
                        } 
                    </tbody>                   
                </Table>  
                </div>
                <p> Menampilkan {dataTable.length} Data</p>
            </div>
                // <BootstrapTable 
                //     keyField="no" 
                //     data={dataTable} 
                //     columns={column2} 
                //     classes={styles.tableStyles}
                //     pagination={paginationFactory(options)}
                //     striped hover condensed
                //     style={{paddingLeft: "0px"}}
                // />
            )}
        </>
    );
}