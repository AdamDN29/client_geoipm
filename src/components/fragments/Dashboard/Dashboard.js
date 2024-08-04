import React, { useEffect, useState } from 'react';

import styles from './styles.module.css'

import calculationAPI from '../../../api/calculationAPI';

//import component Bootstrap React
import { Container, Row, Col, Card } from 'react-bootstrap'

export default function Dashboard() {

    const [totalData, setTotalData] = useState();

    useEffect(() => {
        fetchData();
    },[])
    
    const fetchData = async () => {
        const res = await calculationAPI.getDataTotal();
        setTotalData(res.data);
        console.log(res.data)
    }

    return (
        <section>
            <Container >
                <Row>
                    <h2>Dashboard</h2>
                </Row>
                <Row xs={3} md={5} className={`g-4 ${styles.rowBox}`}>
                    <Col key={1}>
                        <Card>
                            <Card.Body>
                                <center>
                                    <Card.Text><i>Total Data <br/> IPM</i></Card.Text>
                                    <Card.Title><p className={styles.textData}>{totalData?.total}</p></Card.Title>
                                </center>   
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={2}>
                        <Card>
                            <Card.Body>
                                <center>
                                    <Card.Text><i>Jumlah Data IPM <br/> Provinsi</i></Card.Text>
                                    <Card.Title><p className={styles.textData}>{totalData?.dataProv}</p></Card.Title>
                                </center> 
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={3}>
                        <Card>
                            <Card.Body>
                                <center>
                                    <Card.Text><i>Jumlah Data IPM <br/> Kabupaten/Kota</i></Card.Text>
                                    <Card.Title><p className={styles.textData}>{totalData?.dataKabkot}</p></Card.Title>
                                </center> 
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={4}>
                        <Card>
                            <Card.Body>
                                <center>
                                    <Card.Text><i>Jumlah <br/> Provinsi</i></Card.Text>
                                    <Card.Title><p className={styles.textData}>{totalData?.prov}</p></Card.Title>
                                </center> 
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col key={5}>
                        <Card>
                            <Card.Body>
                                <center>
                                    <Card.Text><i>Jumlah <br/> Kabupaten/Kota</i></Card.Text>
                                    <Card.Title><p className={styles.textData}>{totalData?.kabkot}</p></Card.Title>
                                </center> 
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <p><b>Data Wilayah:</b> Mengelola Data Wilayah Provinsi dan Kabupaten/Kota</p>
                    <p><b>Data IPM:</b> Mengelola Data IPM Provinsi dan Kabupaten/Kota</p>
                    <p><b>Unggah data IPM:</b> Unggah Data melalui file Excel berdasarkan template yang telah disediakan</p>
                    <p><b>Data Admin:</b> Mengelola Data Akun Admin yang sedang digunakan</p>
                </Row>
                
            </Container>
        </section>
    );
}
