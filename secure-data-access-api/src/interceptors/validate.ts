import { Interceptor } from "@loopback/core";

export const validate: Interceptor = async (invocationCtx, next) => {
    console.log('validate input parameters for: ', invocationCtx.methodName);
    
    const body = invocationCtx.args
    console.log(body)

    //validate input   --> throw BadRequestException when a parameter is found invalid

    const result = await next();
    return result;
  };
  