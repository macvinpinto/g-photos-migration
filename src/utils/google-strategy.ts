import GoogleStrategy from 'passport-google-oauth20';

export default function googleStrategyBuilder (user: number) {
    return new GoogleStrategy.Strategy(
        {
            clientID: process.env['GOOGLE_CLIENT_ID'] || '',
            clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || '',
            // callbackURL: 'http://localhost:8080/auth/google/callback',
            callbackURL: 'https://literate-xylophone-pgjv4r5gjw7f7x6x-8080.app.github.dev/auth/google/callback/user'+user,
        },
        (accessToken, refreshToken, profile, done) => {
            // You can handle user data and store it in a database
            
            const tokens = {
                accessToken,
                refreshToken
            }

            console.log(profile);


            return done(null, profile, tokens);
        }
    )
}