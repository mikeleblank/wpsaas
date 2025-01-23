import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid"; 
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import Container from "@material-ui/core/Container";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
//import logo from "../../assets/logo.png";

const customStyle = {
    borderRadius: 0,
    margin: 1,
    boxShadow: "none", 
    backgroundColor: '#755ace',
    color: 'white',
    fontSize: '12px',
};

const customStyle2 = {
    borderRadius: 0,
    margin: 1,
    boxShadow: "none", 
    backgroundColor: '#75bfe6',
    color: 'white',
    fontSize: '12px',

};

const Copyright = () => {
	return (
		<Typography variant="body2" color="primary" align="center">
			{"Copyright "}
 			<Link color="primary" href="#">
 				Core Sistemas
 			</Link>{" "}
 			{new Date().getFullYear()}
 			{"."}
 		</Typography>
 	);
 };

const useStyles = makeStyles(theme => ({
	root: {
		width: "100vw",
		height: "100vh",
                backgroundImage: "url(https://coresistemas.com/imagens/fundo06.jpg)",
		backgroundRepeat: "no-repeat",
		backgroundSize: "100% 100%",
		backgroundPosition: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
	},
	paper: {
		backgroundColor: '#ffffff',
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "55px 30px",
		borderRadius: "12.5px",
	},
	avatar: {
		margin: theme.spacing(1),  
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
                boxShadow: 'none',
                borderRadius: 0,
                margin: 1, 
                backgroundColor: '#188ad6',
                color: 'white',
                '&:hover': {
                boxShadow: 'none',
                borderRadius: 0,
                backgroundColor: '#0b66a3',
                },
	},
	powered: {
		color: "white"
	}
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });


	const { handleLogin } = useContext(AuthContext);
	const [viewregister, setviewregister] = useState('disabled');

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};
	
	    useEffect(() => {
    	fetchviewregister();
  	}, []);
	
		const fetchviewregister = async () => {
  
 
    try {
    	const responsev = await api.get("/settings/viewregister");
      	const viewregisterX = responsev?.data?.value;
      	// console.log(viewregisterX);
      	setviewregister(viewregisterX);
    	} catch (error) {
    		console.error('Error retrieving viewregister', error);
    	}
  	};


	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};
	
	const logo = `${process.env.REACT_APP_BACKEND_URL}/public/logotipos/login.png`;
    const randomValue = Math.random(); // Generate a random number
  
    const logoWithRandom = `${logo}?r=${randomValue}`;

	return (
		<div className={classes.root}>
		<Container component="main" maxWidth="xs">
			<CssBaseline/>
			<div className={classes.paper}>
				<div>
					<img style={{ margin: "0 auto", width: "80%" }} src={logoWithRandom} alt={`${process.env.REACT_APP_NAME_SYSTEM}`} />
				</div>
				{/*<Typography component="h1" variant="h5">
					{i18n.t("login.title")}
				</Typography>*/}
				<form className={classes.form} noValidate onSubmit={handlSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label={i18n.t("login.form.email")}
						name="email"
						value={user.email}
						onChange={handleChangeInput}
						autoComplete="email"
						autoFocus
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label={i18n.t("login.form.password")}
						type="password"
						id="password"
						value={user.password}
						onChange={handleChangeInput}
						autoComplete="current-password"
					/>
					
					<Grid container justify="flex-end">
					  <Grid item xs={6} style={{ textAlign: "right" }}>
						<Link component={RouterLink} to="/forgetpsw" variant="body2">
						  Esqueceu sua senha?
						</Link>
					  </Grid>
					</Grid>
				         <Button
                                          type="submit"
                                          fullWidth
                                          variant="contained"
                                          className={classes.submit}
                                          style={customStyle}
                                        >
                                          {i18n.t("login.buttons.submit")}
                                       </Button>
				         <Button
                                          fullWidth
                                          variant="contained"
                                          component={RouterLink}
                                          style={customStyle2}
                                          to="/signup"
                                       >
                                          {i18n.t("login.buttons.register")}
                                       </Button>
                                          {viewregister === "enabled" && (
                                       <>
                                          <Grid container>
 					
                                       <Button
                                          fullWidth
                                          variant="contained"
                                          component={RouterLink}
                                          style={customStyle2}
                                          to="/signup"
                                       >
                                          {i18n.t("login.buttons.register")}
                                       </Button>
					</Grid>
                    </>
                    )}
				
					
				</form>
			
			</div>
			<Box mt={8}><Copyright /></Box>
		</Container>
		</div>
	);
};

export default Login;
