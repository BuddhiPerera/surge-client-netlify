import React, {useEffect, useState} from "react";
import Helmet from "react-helmet";
import Navbar from "./Layout/Navbar";
import Box from "@mui/material/Box";
import {Button, CircularProgress, FormGroup, LinearProgress} from "@mui/material";
import TextField from "@mui/material/TextField";
import AuthActions from "../actions/AuthActions";
import {Redirect} from "react-router-dom";
import jwt_decode from "jwt-decode";

import userData from "../utils/userData";
import axios from "axios";
import Keys from "../config/Keys";

const user = userData();

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [backend, setBackend] = useState(true);

    if (errors.server) {
        console.log(errors.server);
    }

    function fetchData() {
        let API_URL = Keys.API_URL;
        axios.get(API_URL + "auth/init", {}).then(r => {
            if (r.status === 200 && r.data === "init") {
                setBackend(false);
            }
            console.log("Backend initialized");
        }).catch(err => {
            console.log(err);
            setBackend(false);
        })
    }

    const onChange = e => {
        if (e.target.id === "email") {
            setEmail(e.target.value)
        }
        if (e.target.id === "password") {
            setPassword(e.target.value)
        }
    };

    const onSubmit = e => {
        setLoading(true);
        e.preventDefault();
        AuthActions.LoginUser(email, password).then(res => {
            localStorage.setItem("jwt", JSON.stringify(res.data));
            let jsonPayload = jwt_decode(res.data);
            if (jsonPayload.role === "user") {
                if (jsonPayload.status === true) {
                    document.location.href = '/notes/1';
                } else if (jsonPayload.status === false) {
                    document.location.href = '/reset';
                }
            } else if (jsonPayload.role === "admin") {
                document.location.href = '/users';
            }
            setLoading(false);
        }).catch(e => {
            setErrors(e.response.data);
            setLoading(false);
        })
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            {user.role === "user" || user.role === "admin" ?
                user.role === "user" ?
                    user.status === true ?
                        <Redirect to="/notes/1"/> :
                        <Redirect to="/reset"/> :
                    <Redirect to="/users"/>
                : ""}

            {backend === true ? <div className={"backend-loading con-mid"}>
                <div>
                    <CircularProgress size="1rem" color={"inherit"} style={{marginBottom: "20px"}}/>
                    <p style={{
                        marginBottom: "0",
                        fontFamily: "Segoe UI,SegoeUI,Helvetica Neue,Helvetica,Arial,sans-serif"
                    }}>The backend is loading at Heroku</p>
                    <span style={{
                        color: "#606060",
                        fontSize: "10px",
                        fontFamily: "Segoe UI,SegoeUI,Helvetica Neue,Helvetica,Arial,sans-serif"
                    }}>Surge Global Assignment by Buddhi Perera</span>
                </div>
            </div> : ""}

            {loading === true ? <LinearProgress/> : ""}
            <Navbar/>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className={"form-container con-mid"}>
                <div className={"form-card con-mid"}>
                    {/*<form noValidate onSubmit={this.onSubmit}>*/}
                    <Box
                        component="form"
                        sx={{'& > :not(style)': {m: 1, width: '25ch'},}}
                        noValidate
                        // autoComplete="off"
                        onSubmit={onSubmit}
                    >
                        <FormGroup>
                            <h5>Login</h5>
                        </FormGroup>
                        <FormGroup>
                            <TextField
                                onChange={onChange}
                                id="email"
                                label="Email"
                                variant="filled"
                                style={{margin: "10px 0", width: "410px"}}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <TextField
                                onChange={onChange}
                                id="password"
                                label="Password"
                                variant="filled"
                                type={"password"}
                                error={!!errors.password}
                                style={{margin: "10px 0", width: "410px"}}
                                helperText={errors.password}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Button
                                type="submit"
                                style={{margin: "10px 0", width: "410px"}}
                                variant="contained">{loading === true ?
                                <CircularProgress size="1rem" color={"inherit"} style={{
                                    marginBottom: "-2px",
                                }}/>
                                : "Login"}</Button>
                        </FormGroup>
                    </Box>
                    <div style={{marginTop: "20px", textAlign: "left"}}>
                        <h6>Admin login credentials</h6>
                        <span style={{fontSize: "12px"}}><strong>Email:</strong> admin@admin.com</span>
                        <br/>
                        <span style={{fontSize: "12px"}}><strong>Password:</strong> admin123</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
