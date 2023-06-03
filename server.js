import gql from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fetch from 'node-fetch';

//apollo 서버에 data type을 꼭 명시해줘야함
// GET은 Query 안에 나머지 POST,PUT,DELETE 같은 것들은 Mutation 에 적어줘야함
// ! 는 값이 required 라는 뜻이다. 만약 없다면 설정된 타입 또는 Null 이라는 뜻

//dumy data
let tweets = [
    {
        id: '1',
        text: 'first one!',
        userId: '2',
    },
    {
        id: '2',
        text: 'second one',
        userId: '1',
    },
];

let users = [
    {
        id: '1',
        firstName: 'nico',
        lastName: 'las',
    },
    {
        id: '2',
        firstName: 'Elon',
        lastName: 'Mask',
    },
];

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        """
        Is the sum of firstName + lastName as a string
        """
        fullName: String!
    }
    """
    Tweet object represents a resource for  a Tweet
    """
    type Tweet {
        id: ID!
        text: String!
        author: User
    }
    type Query {
        allMovies: [Movie!]!
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        movie(id: String!): Movie
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        """
        Deletes a Tweet if found, else returns false
        """
        deleteTweet(id: ID!): Boolean!
    }
    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
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
        allUsers() {
            console.log('allUsers called!');
            return users;
        },
        allMovies() {
            return fetch('https://yts.mx/api/v2/list_movies.json')
                .then((r) => r.json())
                .then((json) => json.data.movies);
        },
        movie(_, { id }) {
            return fetch(
                `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`,
            )
                .then((r) => r.json())
                .then((json) => json.data.movie);
        },
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text,
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, { id }) {
            const tweet = tweets.find((tweet) => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter((tweet) => tweet.id !== id);
            return true;
        },
    },
    User: {
        fullName({ firstName, lastName }) {
            return `${firstName} ${lastName}`;
        },
    },
    Tweet: {
        author({ userId }) {
            return users.find((user) => user.id === userId);
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
