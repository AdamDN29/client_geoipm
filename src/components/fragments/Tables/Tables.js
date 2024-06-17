import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Row, Col} from "react-bootstrap";
import separatorNumber from "../../../hook/separatorNumber";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator'
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import ipm_provinsiAPI from "../../../api/ipm_provinsiAPI";
import ipm_kab_kotAPI from "../../../api/ipm_kab_kotAPI";
import provinsiAPI from "../../../api/provinsiAPI";
import kab_kotAPI from "../../../api/kab_kotAPI";

export default function Tables({contentChanger, dataChanger, tableFlag, textTingkat, textTahun, dataTable, actionFlag, refreshFlag}) {
    
    const [data, setData] = useState(true)
    const [flag1, setFlag1] = useState(true)
    const [flag2, setFlag2] = useState(true)
    const [flag3, setFlag3] = useState(true)
    const [flag4, setFlag4] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect (() => {
        
        if (textTingkat === "Nasional"){
            setFlag1(false);
            setFlag2(true);
        }else{
            setFlag2(false);
            setFlag1(true); 
        }
        if(textTahun === "all"){
            setFlag3(false);
        }else{
            setFlag3(true);
        }
        if (actionFlag){
            setFlag4(false);
        }else{
            setFlag4(true);
        }

        var temp = [];
        if(dataTable[0] === undefined){
            temp = [dataTable];
        }else{
            temp = dataTable;
        }
        setData(temp);     
    },[])

    const styleHeader = () => {
        return {
            textAlign: "center", backgroundColor: "#B8D9A0"
        }
    }
    // Tabel IPM
    const column1 = [
        {
            dataField: 'no',
            text: 'No ',
            headerStyle: styleHeader,
            formatter: (cell, row, rowIndex) => {
                let rowNumber = (currentPage - 1) * 10 + (rowIndex + 1);
                return <span>{rowNumber}</span>;
            }
        },
        {
            dataField: 'id',
            text: 'Id ',
            hidden: flag4,
            headerStyle: styleHeader
        },
        {
            dataField:"Provinsi.nama_provinsi",
            text:"Nama Wilayah ",
            hidden: flag1,
            sort: true,
            style: {textAlign: "left"},
            headerStyle: styleHeader
        },
        {
            dataField:"Kabupaten_Kotum.nama_kabupaten_kota",
            text:"Nama Wilayah ",
            hidden: flag2,
            sort: true,
            style: {textAlign: "left"},
            headerStyle: styleHeader
        },
        {
            dataField:"tahun",
            text:"Tahun ",
            hidden: flag3,
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"uhh",
            text:"UHH ",
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"ahls",
            text:"AHLS ",
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"arls",
            text:"ARLS ",
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"ppd",
            text:"PPD",
            sort: true,
            formatter: (cell) => {
                return  "Rp." + separatorNumber(cell * 1000);
            },
            headerStyle: styleHeader
        },
        {
            dataField:"iuhh",
            text:"IUHH ",
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"ipthn",
            text:"IPTHN ",
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"iplrn",
            text:"IPLRN ",
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"ipm",
            text:"IPM ",
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"gwr",
            text:"GWR ",
            sort: true,
            headerStyle: styleHeader
        },
        {
            dataField:"id",
            text:"Action",
            hidden: flag4,
            formatter: (cell, row, rowIndex) => {
                return(
                    <Row className={styles.action}>
                        <Col className={styles.action}>
                            <button className={styles.buttons} onClick={() => EditData(cell)} >
                                    <FontAwesomeIcon icon={faEdit} />
                            </button>
                        </Col>
                        <Col className={styles.action}>
                            <button className={styles.buttons} onClick={() => DeleteData(cell)} >
                                    <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </Col>
                    </Row>
                )
            },
            headerStyle: styleHeader
        },
    ]
    // Tabel Wilayah
    const column2 = [
        {
            dataField: 'no',
            text: 'No ',
            headerStyle: styleHeader,
            formatter: (cell, row, rowIndex) => {
                let rowNumber = (currentPage - 1) * 10 + (rowIndex + 1);
                return <span>{rowNumber}</span>;
            }
        },
        {
            dataField: 'id',
            text: 'Id ',
            headerStyle: styleHeader
        },
        {
            dataField:"nama_provinsi",
            text:"Nama Provinsi ",
            hidden: flag1,
            sort: true,
            style: {textAlign: "left"},
            headerStyle: styleHeader
        },
        {
            dataField:"nama_kabupaten_kota",
            text:"Nama Kabupaten/Kota ",
            hidden: flag2,
            sort: true,
            style: {textAlign: "left"},
            headerStyle: styleHeader
        },
        {
            dataField:"latitude",
            text:"Latitude",
            headerStyle: styleHeader
        },
        {
            dataField:"longitude",
            text:"Longitude",
            headerStyle: styleHeader
        },
        {
            dataField:"id",
            text:"Action",
            hidden: flag4,
            formatter: (cell, row, rowIndex) => {
                return(
                    <Row className={styles.action}>
                        <Col>
                            <button className={styles.buttons} onClick={() => EditData(cell)} >
                                    <FontAwesomeIcon icon={faEdit} />
                            </button>
                        </Col>
                        {/* <Col className={styles.action}>
                            <button className={styles.buttons} onClick={() => DeleteData(cell)} >
                                    <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </Col> */}
                    </Row>
                )
            },
            headerStyle: styleHeader
        },
    ]

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

    const alertDelete = (res) => {
        if (res.success === true) {
            alert("Data Berhasil Dihapus!")
        }else if(res.success === false && res.flag === true){
          alert(res.message)
        }
    }

    const options = {
        paginationSize : 10,
        hideSizePerPage : true,
        showTotal: true,
        onPageChange: page => {
            setCurrentPage(page);
        },
        page: currentPage
        // firstPageText: "First",
    }

    return (
        <>
            {tableFlag === "showIPM" ? (
                <BootstrapTable 
                    keyField="no" 
                    data={data} 
                    columns={column1} 
                    classes={styles.tableStyles}
                    pagination={paginationFactory(options)}
                    striped hover condensed
                    style={{paddingLeft: "0px"}}
                />
            ):(
                <BootstrapTable 
                    keyField="no" 
                    data={data} 
                    columns={column2} 
                    classes={styles.tableStyles}
                    pagination={paginationFactory(options)}
                    striped hover condensed
                    style={{paddingLeft: "0px"}}
                />
            )}
        </>
    );
}

  // <Table striped bordered hover responsive="sm" className={styles.tableStyles} maxHeight="40px">
                                        //     <thead>
                                        //         <tr className={styles.centerText}>
                                        //             <th xs={1}>No</th>
                                        //             <th xs={5}>
                                        //                 { textTingkat === "Nasional" ?
                                        //                     (<>Provinsi</>):
                                        //                     (<>Kabupaten/Kota</>)   
                                        //                 }
                                        //             </th>
                                        //             { textTahun === "all" ?(<th>Tahun</th>):(<></>)}
                                        //             <th>UHH
                                        //                 <p className={styles.subText}>(Tahun)</p>
                                        //             </th>
                                        //             <th>AHLS
                                        //                 <p className={styles.subText}>(Tahun)</p>
                                        //             </th>
                                        //             <th>ARLS
                                        //                 <p className={styles.subText}>(Tahun)</p>
                                        //             </th>
                                        //             <th>PPD
                                        //                 <p className={styles.subText}>(Rp/Tahun)</p>
                                        //             </th>
                                        //             <th>IUHH</th>
                                        //             <th>IPTHN</th>
                                        //             <th>IPLRN</th>
                                        //             <th>IPM</th>
                                        //         </tr>
                                        //     </thead>
                                        //     <tbody>
                                        //         {status && dataTable &&
                                        //             dataTable.map((data,i) =>{
                                        //                 return(
                                        //                     <tr key={i} className={styles.centerText}>
                                        //                         <td>{i + 1}</td>
                                        //                         <td className={styles.leftText}> 
                                        //                             { textTingkat === "Nasional" ?
                                        //                                 (<>{data.Provinsi.nama_provinsi}</>):
                                        //                                 (<>{data.Kabupaten_Kotum.nama_kabupaten_kota}</>)   
                                        //                             }
                                        //                         </td>
                                        //                         { textTahun === "all" ?(<td>{data.tahun}</td>):(<></>)}
                                        //                         <td>{data.uhh}</td>
                                        //                         <td>{data.ahls}</td>
                                        //                         <td>{data.arls}</td>
                                        //                         <td>{separator(data.ppd * 1000)}</td>
                                        //                         <td>{data.iuhh}</td>
                                        //                         <td>{data.ipthn}</td>
                                        //                         <td>{data.iplrn}</td>
                                        //                         <td>{data.ipm}</td>
                                        //                     </tr>  
                                        //                 )
                                        //             })
                                        //         }    
                                        //     </tbody>
                                        // </Table>
