export const authConfig = {
  domain: 'dev-mrobiwankenobi.auth0.com',
  clientId: 'VeXwPFydq4Czt4Z54p8H8b05HOT552oe',
  callbackUrl: 'http://localhost:3000/callback'
}

export const userApiBase = "http://localhost:8080";
export const chatApiBase = "http://localhost:8081";

export const apiConfig = {
    "contacts" : {
        apiEndpoint : `${userApiBase}/api/v0/contacts`
    },
    "user" : {
      apiEndpoint : `${userApiBase}/api/v0/user`
    },
    "chat" : {
      apiEndpoint : `${chatApiBase}/api/v0/chat`
    }
}
