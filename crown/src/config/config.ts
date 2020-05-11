export const authConfig = {
  domain: 'dev-mrobiwankenobi.auth0.com',
  clientId: 'VeXwPFydq4Czt4Z54p8H8b05HOT552oe',
  callbackUrl: 'http://localhost:3000/callback'
}

export const billApiBase = "http://localhost:8080";
export const keelApiBase = "http://localhost:8080";
export const mantleApiBase = "http://localhost:8080";

export const apiConfig = {
    "contacts" : {
        apiEndpoint : `${billApiBase}/api/v0/contacts`
    },
    "user" : {
      apiEndpoint : `${billApiBase}/api/v0/user`
    },
    "chat" : {
      apiEndpoint : `${keelApiBase}/api/v0/chat`
    },
    "message" : {
      apiEndpoint : `${mantleApiBase}/api/v0/message`
    }
}
