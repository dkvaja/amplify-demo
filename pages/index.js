/* eslint-disable react-hooks/exhaustive-deps */
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../src/context/authContext";
import { API, Auth } from "aws-amplify";
import { toast } from "react-toastify";
import { checkUserLoggedIn, getToken } from "../src/utils/auth";
import { LOGIN } from "../src/constants/routes";
import { STORAGE_KEYS, toastMessages } from "../src/constants/keywords";
import { MUTATIONS, QUERIES } from "../src/graphql/services";
import { listTodos } from "../src/graphql/queries";
import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { createTodo, deleteTodo } from "../src/graphql/mutations";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";

export default function Home() {
  const [todos, setTodos] = useState(null);
  const [isTodoAdding, setIsTodoAdding] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const { user } = useUser();

  useEffect(() => {
    const localUser = checkUserLoggedIn();
    if (!localUser) Router.push(LOGIN);
  }, []);

  useEffect(() => {
    fetchToDo();
  }, []);

  const fetchToDo = async () => {
    const userToken = getToken();
    try {
      const payLoad = {
        limit: 10,
        nextToken: userToken,
      };
      const res = await QUERIES(listTodos, payLoad);
      if (res.data) {
        const { listTodos } = res.data;
        if (listTodos.items && listTodos.items.length > 0) {
          setTodos(listTodos.items);
        }
      }
    } catch (error) {}
  };

  const handleAddTodo = async (todoData) => {
    const { title, description } = todoData;
    const payLoad = {
      name: title,
      description,
    };
    setIsTodoAdding(true);
    try {
      const res = await API.graphql({
        query: createTodo,
        variables: { input: payLoad },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      });
      if (res.data) {
        setTodos((prevState) =>
          prevState
            ? [...prevState, res.data.createTodo]
            : [res.data.createTodo]
        );
        setValue("title", null);
        setValue("description", null);
      }
    } catch (error) {
      toast.error(error?.message || toastMessages.GENERAL_ERROR);
    } finally {
      setIsTodoAdding(false);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
      localStorage.removeItem(STORAGE_KEYS.AMPLIFY_USER);
      toast.success(toastMessages.LOG_OUT_SUCCESS);
      Router.push(LOGIN);
    } catch (error) {
      toast.error(toastMessages.GENERAL_ERROR);
    }
  };

  const handleLogOut = async (e) => {
    e?.preventDefault();
    await signOut();
  };

  const handleDeleteTodo = async (todoId) => {
    if (!todoId) return;
    try {
      const res = await API.graphql({
        query: deleteTodo,
        variables: { input: { id: todoId } },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      });
      if (res.data) {
        let updatedTodos = [...todos];
        updatedTodos = updatedTodos.filter(
          ({ id }) => id !== res.data.deleteTodo.id
        );
        setTodos(updatedTodos);
      }
    } catch (error) {
      toast.error(toastMessages.GENERAL_ERROR);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="relative">
          <Toolbar>
            <CameraIcon sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              I - Todo
            </Typography>
            <Button variant="contained" onClick={handleLogOut}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Hello, {user?.username}!
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Welcome to I-Todo
            </Typography>
            <Stack sx={{ pt: 4 }} direction="column" justifyContent="center">
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                component="form"
                onSubmit={handleSubmit(handleAddTodo)}
              >
                <TextField
                  id="outlined-basic"
                  label="Todo Title"
                  variant="outlined"
                  {...register("title", {
                    required: "Title is required",
                  })}
                  error={errors.title}
                  helperText={errors.title ? errors.title.message : ""}
                />
                <TextField
                  id="outlined-basic"
                  label="Todo Description"
                  variant="outlined"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  error={errors.description}
                  helperText={
                    errors.description ? errors.description.message : ""
                  }
                />
                <IconButton type="submit" disabled={isTodoAdding}>
                  <SendRoundedIcon />
                </IconButton>
              </Stack>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                {todos &&
                  todos.length > 0 &&
                  todos.map(({ name, description, id }) => {
                    const labelId = `checkbox-list-label-${name}`;
                    return (
                      <ListItem
                        key={id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="comments"
                            onClick={() => handleDeleteTodo(id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                        disablePadding
                      >
                        <ListItemButton role={undefined} dense>
                          <ListItemText
                            id={labelId}
                            primary={name}
                            secondary={description}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
              </List>
            </Stack>
          </Container>
        </Box>
      </main>
    </>
  );
}
