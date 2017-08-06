// Global Error handler
import { ErrorHandler}                from '@angular/core';
import { Injectable}                  from '@angular/core';

// Our Services
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService, 
        ) { }

  handleError(error) {
      // Reacts to and Logs errors globally
      this.globalFunctionService.printToConsole(this.constructor.name, 'handleError', 'Error Handler');
console.log('ERROR IN ---------------- handleError ------------- ERROR --------------- ERROR', error)
      // ErrorTypes:

        // EvalError --- Creates an instance representing an error that occurs regarding the global function eval().

        // InternalError --- Creates an instance representing an error that occurs when an internal error in the 
        //   JavaScript engine is thrown. E.g. "too much recursion".

        // RangeError --- Creates an instance representing an error that occurs when a numeric variable or 
        //   parameter is outside of its valid range.

        // ReferenceError --- Creates an instance representing an error that occurs when de-referencing an 
        //   invalid reference.

        // SyntaxError --- Creates an instance representing a syntax error that occurs while parsing code in eval().

        // TypeError --- Creates an instance representing an error that occurs when a variable or parameter 
        //   is not of a valid type.

        // URIError --- Creates an instance representing an error that occurs when encodeURI() or decodeURI() are 
        //   passed invalid parameters.

     // IMPORTANT: Rethrow the error otherwise it gets swallowed
     throw error;
  }
  
}