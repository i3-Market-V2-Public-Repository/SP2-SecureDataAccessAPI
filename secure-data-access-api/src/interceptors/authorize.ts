import { Interceptor } from "@loopback/core";
import { UnauthorizedException } from '../exceptions/unauthorized_exception';

export const authorize: Interceptor = async (invocationCtx, next) => {
    console.log('authorize request: ', invocationCtx.methodName);
    
    const replacerFunc = () => {
      const visited = new WeakSet();
      return (key:string, value:object) => {
        if (typeof value === "object" && value !== null) {
          if (visited.has(value)) {
            return;
          }
          visited.add(value);
        }
        return value;
      };
    };
   
    let headers  = JSON.parse(JSON.stringify(invocationCtx.target, replacerFunc())).request.headers
    console.log(headers)

    //check if auth header is in the request
    if (! Object.keys(headers).includes('authorization')){
      throw new UnauthorizedException("Authorization header missing from request. Consumer is not allowed to  access data. Exiting now...")
    }
    else{
      console.log('Authorization token found. ')
    }


    const result = await next();
    return result;
  };
  