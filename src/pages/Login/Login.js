import React, { createContext, useContext, useState, useReducer } from 'react';

import styles from './styles.module.css';
import ImgAsset from '../../assets';
import adminAPI from '../../api/adminAPI';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

//import component Bootstrap React
import { Card, Container, Alert, Form, Button, Spinner } from 'react-bootstrap'

const UserContext = createContext("");

const loginSchema = yup.object().shape({
    email: yup.string().email().required('Email wajib diisi'),
    password: yup.string().required('Password wajib diisi')
})

const initialState = {
    email: "",
    password: "",
  };
  
  const reducer = (currentState, action) => {
    switch (action.type) {
      case "email":
        return { ...currentState, email: action.payload };
      case "password":
        return { ...currentState, password: action.payload };
      default:
        return currentState;
    }
  };

export default function Login() {
    const {user, setUser} = useContext(UserContext)

    const { formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const [data, dispatch] = useReducer(reducer, initialState);

    const [alert, setAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    
    const submitForm = async (e) => {
        e.preventDefault();
        console.log(data)
        setIsLoading(true);
        try {
            if(data.email === "" || data.password === ""){
                setMessage("Silahkan Lengkapi Form!")
                setAlertVariant("warning")
                setAlert(true)
                return setIsLoading(false);;
            }

            const dataKu = new URLSearchParams({
                "email": data.email,
                "password": data.password,
            })
            const res = await adminAPI.login(dataKu);
            if(res.success){
            //   setUser(res.data.data);
              setMessage(res.message)
              setAlertVariant("success")
              setAlert(true);
              toDashboard(res);
              
            }else if(!res.success){
                setMessage(res.message)
                setAlertVariant("danger")
                setAlert(true);
            }
          } catch (error) {
            setMessage(error.response.data.message)
            setAlertVariant("danger")
            setAlert(true)
          }
        setIsLoading(false);
    }

    const toDashboard = (res) =>{
        sessionStorage.setItem("id", res.data.idAdmin);
        sessionStorage.setItem("user", res.data.username);
        window.location.href = "/admin";
    }

    return (
        <div>
        <Container fluid className={styles.containerlogin}>
            <center>
                
                <div className={styles.loginField}>
                    <a  href="/homepage">
                        <img
                            src = {ImgAsset.GeoIPM}
                            width="175"
                            height="75"
                            className={`d-inline-block align-center ${styles.navbar_brand}`}
                            alt="GeoIPM logo"
                        
                        />
                    </a>

                    {alert && (
                        <Alert variant={alertVariant} className={styles.alert}>
                            {message}
                        </Alert>
                    )}
                    

                    <Card className={`rounded shadow-sm ${styles.loginForm}`} >
                        <Card.Header><h4 className={styles.loginTitle}>Login Admin</h4></Card.Header>
                        <Card.Body className={`p-4 ${styles.formBody}`}>
                        
                            <Form onSubmit={submitForm}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    {/* <Form.Label className={styles.labelForm}>Email/Username</Form.Label> */}
                                    <p  className={styles.labelForm}>Email/Username</p>
                                    <Form.Control 
                                        type="email"
                                        name="email" 
                                        error={errors?.email?.message}
                                        placeholder="Masukkan Email/Username" 
                                        onBlur={(e) =>
                                            dispatch({ type: "email", payload: e.target.value })
                                        }
                                    
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    {/* <Form.Label>Password</Form.Label> */}
                                    <p  className={styles.labelForm}>Password</p>
                                    <Form.Control 
                                        type="password" 
                                        name="password"
                                        error={errors?.password?.message}
                                        placeholder="Masukkan Password" 
                                        onBlur={(e) =>
                                            dispatch({ type: "password", payload: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <p className={styles.divider}></p>
                                <Button
                                    variant="light"
                                    disabled={isLoading}
                                    className={styles.buttons}
                                    type="submit"
                                    // onClick={submitForm}
                                >
                                    {isLoading === false ? (
                                    <>Login</>           
                                    ) : (
                                    <>
                                        <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        />{" "}
                                        Loading...{" "}
                                    </>
                                    )}
                                </Button>
                            </Form>
                            <p className={styles.link}>Kembali ke <a href='/homepage'>Homepage</a></p>
                        
                        </Card.Body>
                    </Card>
                </div>
            </center>
            {/* <Row>
                <Col md="{60}">
                    <Card className="border-0 rounded shadow-sm">
                        <Card.Body className="p-4">
                        <h1>Login</h1>
                        <p class="lead">Test Login <strong>GeoIPM</strong></p>
                        
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}
            
        </Container>
        </div>
    );
}
