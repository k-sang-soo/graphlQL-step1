import gql from "graphql-tag";
import { ApolloServer} from "@apollo/server";

const server = new ApolloServer({});

server.listen().theh(({ url}) => {
    console.log(`Running on ${url}`)
})