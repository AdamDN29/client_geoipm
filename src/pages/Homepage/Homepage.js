import React from 'react';

//import component Bootstrap React
import { Container, Row, Col, Button } from 'react-bootstrap'

import ImgAsset from '../../assets'
import styles from './styles.module.css';
import Navbars from '../../components/fragments/Navbars';
import Footers from '../../components/fragments/Footers/Footers.js';

export default function Homepage() {
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
                                <h1 className={styles.title}>IPM</h1>
                            </Row>
                            <Row><h5 className={styles.subtitle}>Indeks Pembangunan Manusia</h5></Row>
                            <Row>
                                <p>
                                    <b className={styles.boldP}>Indeks Pembangunan Manusia (IPM)</b>  atau <i className={styles.boldP}>Human Development Index </i> 
                                    adalah ukuran rangkuman pencapaian rata-rata dalam dimensi utama pembangunan manusia yaitu 
                                    <b className={styles.boldP}> umur panjang dan hidup sehat </b> (<i>a long and healthy life</i>), 
                                    <b className={styles.boldP}> pengetahuan</b> (<i>knowledge</i>), serta 
                                    <b className={styles.boldP}> standar hidup layak</b> (<i>decent standard of living</i>). <br/><br/>
                                    
                                    IPM dihitung berdasarkan <b className={styles.boldP}> nilai indeks </b> dari perhitungan <b className={styles.boldP}>indikator</b> masing - masing dimensi utama. Di Indonesia, 
                                    <b className={styles.boldP}> indeks umur harapan hidup</b> mewakili dimensi umur panjang dan hidup sehat,
                                    <b className={styles.boldP}> indeks pengetahuan</b> mewakili dimensi pengetahuan, dan
                                    <b className={styles.boldP}> indeks pengeluaran</b> mewakili dimensi standar hidup layak. <br/><br/>

                                    IPM dapat menentukan tingkat <b className={styles.boldP}>pembangunan kualitas hidup manusia </b> pada suatu wilayah. 
                                    Sehingga IPM dapat digunakan untuk menentukan <b className={styles.boldP}>pengelompokan wilayah</b>  di Indonesia.
                                    Pengelompokan wilayah tersebut dapat ditemukan pada <a href="/peta_ipm" className={styles.linkText} >Peta IPM</a>
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
                        <Col>
                            <Row> <h5 className={styles.subtitle}>Komponen Penyusun IPM</h5></Row>
                            <Row>
                                <ul className={styles.ulStyles}>
                                    <li><b className={styles.boldP}>Indeks Umur Harapan Hidup</b></li>
                                        <ul>
                                            <li>Indikator Umur Harapan Hidup Saat Lahir (UHH)</li>
                                        </ul>
                                    <li><b className={styles.boldP}>Indeks Pengetahuan</b></li>
                                        <ul>
                                            <li>Indikator Angka Harapan Lama Sekolah (AHLS)</li>
                                            <li>Indikator Angka Rata-rata Lama Sekolah (ARLS)</li>
                                        </ul>
                                    <li><b className={styles.boldP}>Indeks Pengeluaran</b></li>
                                        <ul>
                                            <li>Indikator Pengeluaran Riil Per Kapita yang Disesuaikan per tahun</li>
                                        </ul>
                                </ul>
                            </Row>
                        </Col>
                        <Col>
                            <Row><h5 className={styles.subtitle}>Pentingnya IPM</h5> </Row>
                            <Row>
                                <ul className={styles.ulStyles}>
                                    <li>Indikator pengukur keberhasilan upaya pembangunan kualitas hidup masyarakat</li>
                                    <li>Penentu peringkat atau level pembangunan suatu wilayah/negara</li>
                                    <li>Ukuran kinerja pemerintah</li>
                                    <li>Alokator penentuan Dana Alokasi Umum (DAU)</li>
                                    <li>Data strategis untuk pemerintah</li>
                                </ul>
                            </Row>
                        </Col>
                    </Row>
                    
                    {/* <Row className={styles.rowContent}>
                        <Col className={styles.colButton}>
                            <Button  variant="light" className={styles.buttons} href='/peta_ipm'>  
                                    Peta IPM
                            </Button>
                        </Col>
                    </Row> */}
                    {/* Content 2 Diagram IPM*/}
                    <Row className={styles.rowContent}>
                        <Col>
                            <Row>
                                <h5 className={styles.semiTitle}>Diagram Perhitungan IPM</h5>
                            </Row>
                            <Row>
                                <img
                                     src = {ImgAsset.Diagram_IPM} 
                                    width="700"
                                    height="400"
                                    className={`d-inline-block ${styles.ipm_image}`}
                                    alt="Diagram Perhitungan IPM"
                                />
                            </Row>
                        </Col>
                    </Row>
                    {/* Content 3 GWR*/}
                    <Row>
                        <Col>
                            
                            <Row>
                                <Col>
                                <Row>
                                    <h5 className={styles.title2}><i>Geographycally Weighted Regression</i> (GWR)</h5>
                                </Row>
                                    <Row>
                                        <p>
                                            <i className={styles.boldP}>Geographycally Weighted Regression</i> (GWR) adalah 
                                            metode yang digunakan dalam mengeksplorasi dan menganalisis data spasial (data geografis),
                                            serta memodelkan hubungan data spasial. Hal ini dilakukan untuk mengetahui pengaruh suatu wilayah terhadap
                                            wilayah lainnya berdasarkan data spasial seperti kedekatan letak geografisnya. <br/><br/>
                                            Metode GWR ini digunakan untuk mengetahui bagaimana pengaruh suatu wilayah terhadap wilayah lainnya berkaitan 
                                            dengan indeks pembangunan manusia di Indonesia pada tingkat provinsi dan tingkat kabupaten/kota.<br/><br/>
                                            Metode GWR ini juga digunakan untuk melakukan <i>regression</i> atau prediksi nilai IPM untuk tahun berikutnya. 
                                            Nilai hasil prediksi tersebut dapat dikelompokan seperti pada data IPM. 
                                            Hasil pengelompokan nilai Prediksi IPM berdasarkan hasil GWR dapat ditemukan pada <a href="/peta_gwr" className={styles.linkText} >Peta GWR</a>
                                        </p>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <img
                                            src = {ImgAsset.GWR_Image}
                                            width="300"
                                            height="350"
                                            className={`d-inline-block ${styles.ipm_image}`}
                                            alt="Foto GWR"
                                        />
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* <Row className={styles.rowContent}>
                        <Col className={styles.colButton}>
                            <Button  variant="light" className={styles.buttons} href='/peta_gwr'>  
                                    Peta GWR
                            </Button>
                        </Col>
                    </Row> */}
                </div>
            </section>        
        </Container>
        <Footers/>
        </div>
    );
}
