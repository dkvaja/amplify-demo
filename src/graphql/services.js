import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";

export const MUTATIONS = async (apiRoute, payLoad) =>
  new Promise(async (resolve, reject) => {
    await API.graphql(graphqlOperation(apiRoute, payLoad))
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        resolve(false);
      });
  });

export const QUERIES = async (apiRoute, variables) =>
  new Promise(async (resolve, reject) => {
    await API.graphql(
      graphqlOperation(
        apiRoute,
        { variables },
        { authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS }
      )
    )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        resolve(false);
      });
  });
