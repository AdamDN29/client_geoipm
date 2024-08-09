import React from 'react';

//import component Bootstrap React
import { Container, Row, Col, Button } from 'react-bootstrap'

import ImgAsset from '../../assets'
import styles from './styles.module.css';
import Navbars from '../../components/fragments/Navbars';
import Footers from '../../components/fragments/Footers/Footers.js';

export default function About() {
    return (
        <div>
        <Container fluid>
            <Navbars/>

            {/* Content Section */}
            <section>
                <div>
                    {/* Content 1 IPM */}
                    <Row className={styles.rowContent}>
                        <Col>
                            <Row>
                                <h1 className={styles.title}>Tentang</h1>
                            </Row>
                            <Row><h5 className={styles.subtitle}>GeoIPM</h5></Row>
                            <Row>
                                <p>
                                    <b className={styles.boldP}>GeoIPM</b> adalah website yang menyajikan data Indeks Pembangunan Manusia di Indonesia pada tingkat Provinsi dan Kabupaten/Kota.
                                    GeoIPM pun dapat menyajikan peta pengelompokan wilayah data IPM dan pemodelan MGWR. <br></br><br></br>

                                    Data IPM pada website ini berasal dari data <a href="https://www.bps.go.id/id" target="_blank" className={styles.linkText} >Badan Pusat Statistik (BPS)</a> Indonesia yang telah dilakukan pengolahan agar dapat ditampilkan pada peta. <br></br><br></br>

                                    Website ini dikembangkan untuk memberikan informasi mengenai tingkat pembangunan kualitas hidup manusia dan pengelompokan wilayahnya.
                                    Website ini pun dikembangkan untuk memenuhi tugas akhir prodi S1 Teknik Informatika Unpad. <br></br><br></br>

                                    Dikembangkan oleh: <br></br>
                                    Adam Din Naufan - 140810190045
                                </p>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <img
                                    src = {ImgAsset.IPM_Image}
                                    width="400"
                                    height="350"
                                    className={`d-inline-block ${styles.ipm_image}`}
                                    alt="Foto IPM"
                                />
                            </Row>
                        </Col>
                    </Row>
                      <Row className={styles.rowContent}>
                        <Col className={styles.colButton}>
                            <Button  variant="light" className={styles.buttons} href='/homepage'>  
                                    Homepage
                            </Button>
                        </Col>
                    </Row>
                    
                    
                </div>
            </section>        
        </Container>
        <Footers/>
        </div>
    );
}
