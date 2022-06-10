import React, { useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import { useUser } from "../src/context/authContext";
import { toast } from "react-toastify";
import { checkUserLoggedIn } from "../src/utils/auth";
import { HOME, SIGNUP } from "../src/constants/routes";
import { STORAGE_KEYS, toastMessages } from "../src/constants/keywords";

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { user, setUser } = useUser();

  useEffect(() => {
    const localUser = checkUserLoggedIn();
    if (localUser) Router.push(HOME);
  }, []);

  const onSubmit = async (formData) => {
    await signIn(formData);
  };
  async function signIn(formData) {
    const { username, password } = formData;
    try {
      const amplifyUser = await Auth.signIn(username, password);
      if (amplifyUser) {
        setUser(amplifyUser);
        localStorage.setItem(
          STORAGE_KEYS.AMPLIFY_USER,
          JSON.stringify(amplifyUser)
        );
        Router.push(HOME);
        toast.success(toastMessages.LOG_IN_SUCCESS);
      }
    } catch (error) {
      toast.error(toastMessages.GENERAL_ERROR);
    }
  }

  return (
    <div>
      <Head>
        <title>Amplify Demo - Log In</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Amplify Demo Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              type="text"
              label="username"
              name="username"
              autoFocus
              {...register("username", {
                required: "username is required",
              })}
              error={errors.username}
              helperText={errors.username ? errors.username.message : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
              })}
              error={errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link href={SIGNUP} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
