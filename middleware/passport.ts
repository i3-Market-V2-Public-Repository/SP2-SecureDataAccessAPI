import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Issuer, Strategy as OidcStrategy, TokenSet } from 'openid-client';
import { findByUsername } from '../sqlite/sqlite';
import { DigestStrategy } from 'passport-http';
import * as passport from 'passport';
import config from '../config/config';

export default async (): Promise<typeof passport> => {
    const issuer = await Issuer.discover(config.oidc.providerUri)
    console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata)

    const client = new issuer.Client(config.oidc.client)

    /**
     * JWT strategies differ in how the token is got from the request:
     * either cookies or the HTTP bearer authorization header
     */
    passport.use('jwtBearer', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwt.secret
        },
        (jwtPayload, done) => {
            return done(null, jwtPayload)
        }
    ))

    passport.use('oidc',
        new OidcStrategy({
            client,
            usePKCE: false
        }, (token: TokenSet, done: Function) => {
            return done(null, token)
        }))

    passport.use(new DigestStrategy({ qop: 'auth' },
        async function (username, cb) {
            await findByUsername(username, function (err, user) {
                if (err) { return cb(err); }
                if (!user) { return cb(null, false); }
                return cb(null, user, user.Password);
            })
        }));

    return passport
}
