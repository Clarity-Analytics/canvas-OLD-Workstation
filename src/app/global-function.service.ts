// Global functions
import { Injectable }                 from '@angular/core';

// Our Services
import { GlobalVariableService }      from './global-variable.service';

// Our Models
import { CanvasUser }                 from './model.user';

@Injectable()
export class GlobalFunctionService {
    sessionDebugging: boolean;
    sessionLogging: boolean;
    gridSize: number;                           // Size of grid blocks, ie 3px x 3px
    snapToGrid: boolean = true;                 // If true, snap widgets to gridSize

    constructor(
      private globalVariableService: GlobalVariableService) { 
    }

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

    alignToGripPoint(inputValue: number) {
        // This routine recalcs a value to a gridpoint IF if snapping is enabled
        this.printToConsole(this.constructor.name, 'snapToGrid', '@Start');

        // Set startup stuffies
        this.snapToGrid = this.globalVariableService.snapToGrid;
        this.gridSize = this.globalVariableService.gridSize;

        if (this.snapToGrid) {
            if ( (inputValue % this.gridSize) >= (this.gridSize / 2)) {
                inputValue = inputValue + this.gridSize - (inputValue % this.gridSize);
            } else {
                inputValue = inputValue - (inputValue % this.gridSize);
            }
        }

        // Return the value
        return inputValue;
    }

    currentUser(): string {
        // Returns the current username as a string (not Observable)
        this.printToConsole(this.constructor.name, 'currentUser', '@Start');

        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }
        return currentUser;
    }

}
