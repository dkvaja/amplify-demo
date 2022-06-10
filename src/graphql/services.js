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
    await API.graphql(graphqlOperation(apiRoute, { variables }))
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        resolve(false);
      });
  });
