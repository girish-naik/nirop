import { verify, decode } from 'jsonwebtoken'
import Axios from 'axios'
import {AxiosResponse} from 'axios'
import { Jwt } from '../models/Jwt'
import { JwtPayload } from '../models/JwtPayload'

const jwksUrl = 'https://dev-mrobiwankenobi.auth0.com/.well-known/jwks.json'

export async function fetchSigningKeys() : Promise<any>{
    const response: AxiosResponse = await Axios.get(jwksUrl);
    var keys = response.data.keys;
    if (!keys || !keys.length) {
        throw new Error('The JWKS endpoint did not contain any keys');
    }
    const signingKeys = keys.filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                && key.kty === 'RSA' // We are only supporting RSA (RS256)
                && key.kid           // The `kid` must be present to be useful for later
                && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
    ).map(key => {
        return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
    });
    return Promise.resolve(signingKeys);
}

function certToPEM(cert) {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}

export function verifyToken(signingKeys: any, authHeader: string): JwtPayload {
    const token = getToken(authHeader)
    const jwt: Jwt = decode(token, { complete: true }) as Jwt
    if (!jwt || !jwt.payload || !jwt.header) {
        throw new Error('Invalid or Expired token.')
    }
    const kid = jwt.header.kid;
    const signingKey = signingKeys.find(key => key.kid === kid);
    const certificate:{publicKey:string} = signingKey;
    try {
        verify(token, certificate.publicKey, { algorithms : ["RS256"]});
        return jwt.payload;
    } catch (err) {
        throw new Error(err);
    }
}

function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    if (!token || token.length == 0) {
        throw new Error('Blank token')
    }

    return token
}