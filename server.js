import gql from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

//apollo 서버에 data type을 꼭 명시해줘야함
// GET은 Query 안에 나머지 POST,PUT,DELETE 같은 것들은 Mutation 에 적어줘야함
// ! 는 값이 required 라는 뜻이다. 만약 없다면 설정된 타입 또는 Null 이라는 뜻

//dumy data
const tweets = [
    {
        id: '1',
        text: 'test1',
    },
    {
        id: '2',
        text: 'test2',
    },
];

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
    }
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        //ApolloServer가 실행되면 resolvers함수들에게 자동으로 2개의 arg를 전달해줌
        //브라우저에서 요청을 보낼 때 args들은 항상 resolvers의 func중 2번째 args가 됨
        tweet(root, { id }) {
            return tweets.find((tweet) => tweet.id === id);
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
