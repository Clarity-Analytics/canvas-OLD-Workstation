// Global functions
import { GlobalVariableService }       from './global.variable.service';
import { Injectable }                  from '@angular/core';

// Our Services 

@Injectable()
export class GlobalFunctionService {
  sessionDebugging: boolean;
  sessionLogging: boolean;

  constructor(
      // private alertService: AlertService,
      private globalVariableService: GlobalVariableService) { }

      // Prints a message to the console if in debugging mode GLOBALLY
      printToConsole(componentName: string, functionName: string, message: string) {

          // Clean alerts
          this.sessionDebugging = this.globalVariableService.sessionDebugging.getValue();
          this.sessionLogging = this.globalVariableService.sessionLogging.getValue();

          // Note: has to use Console log here !
          if (this.sessionDebugging === true) {
            console.log('@' + componentName + ' - ' + functionName + ': ' + message);
          }

          // Log to DB if loggin switched on GLOBALLY
          if (this.sessionLogging == true) {
            console.log('-- Later on Logging to DB / File: @' + componentName + ' - ' + functionName + ': ' + message);
          }
      }
}
