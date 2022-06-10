import React, { useEffect, useState } from "react";
import Head from "next/head";
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
import Router from "next/router";
import { checkUserLoggedIn } from "../src/utils/auth";
import { toast } from "react-toastify";
import { HOME, LOGIN } from "../src/constants/routes";
import { toastMessages } from "../src/constants/keywords";
import LoadingButton from "@mui/lab/LoadingButton";

const Signup = () => {
  const [showCode, setShowCode] = useState(false);
  const [isUserSigningUp, setIsUserSigningUp] = useState(false);

  useEffect(() => {
    const localUser = checkUserLoggedIn();
    if (localUser) Router.push(HOME);
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const signInWithEmailAndPassword = async (userData) => {
    const { username, password, email } = userData;
    setIsUserSigningUp(true);
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      toast.success(toastMessages.CODE_SENT_SUCCESS);
      setShowCode(true);
    } catch (error) {
      toast.error(error?.message || toastMessages.GENERAL_ERROR);
    } finally {
      setIsUserSigningUp(false);
    }
  };

  async function confirmSignUp({ username, code }) {
    setIsUserSigningUp(true);
    try {
      await Auth.confirmSignUp(username, code);
      toast.success(toastMessages.VERIFY_CODE_SUCCESS);
      Router.push(LOGIN);
    } catch (error) {
      toast.error(error?.message || toastMessages.GENERAL_ERROR);
    } finally {
      setIsUserSigningUp(false);
    }
  }

  const onSubmit = async (formData) => {
    if (showCode) {
      await confirmSignUp(formData);
    } else {
      await signInWithEmailAndPassword(formData);
    }
  };

  return (
    <div>
      <Head>
        <title>Amplify Demo - Sign Up</title>
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
            Amplify Demo Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 16,
                      message: "Username must be at most 16 characters",
                    },
                  })}
                  error={errors.username}
                  helperText={errors.username ? errors.username.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  error={errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
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
              </Grid>
              {showCode && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="Code"
                    label="Code"
                    type="number"
                    id="code"
                    {...register("code", {
                      required: "Verification Code is required",
                    })}
                    error={errors.code}
                    helperText={errors.code ? errors.code.message : ""}
                  />
                </Grid>
              )}
            </Grid>
            <LoadingButton
              loading={isUserSigningUp}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {showCode ? "Confirm Code" : "Sign Up"}
            </LoadingButton>
            <Button></Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={LOGIN} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Signup;
