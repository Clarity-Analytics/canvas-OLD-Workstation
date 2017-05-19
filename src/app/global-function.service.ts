// Global functions
import { GlobalVariableService }       from './global-variable.service';
import { Injectable }                  from '@angular/core';

// Our Models
import { EazlUser }                    from './model.user';
import { CanvasUser }                  from './model.user';

@Injectable()
export class GlobalFunctionService {
    sessionDebugging: boolean;
    sessionLogging: boolean;
    gridSize: number;                           // Size of grid blocks, ie 3px x 3px
    snapToGrid: boolean = true;                 // If true, snap widgets to gridSize

  constructor(
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

    alignToGripPoint(inputValue: number) {
        // This routine recalcs a value to a gridpoint IF if snapping is enabled
        this.printToConsole(this.constructor.name, 'snapToGrid', '@Start');

        // Set startup stuffies
        this.snapToGrid = this.globalVariableService.snapToGrid.getValue();
        this.gridSize = this.globalVariableService.gridSize.getValue();

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

    setCanvasUser(eazlUser: EazlUser) {
        // This routine stores the current Canvas User stuffies
        this.printToConsole(this.constructor.name, 'setCanvasUser', '@Start');

        this.globalVariableService.canvasUser.next({
            pk: eazlUser.pk,
            username: eazlUser.username,
            first_name: eazlUser.first_name,
            last_name: eazlUser.last_name,
            email: eazlUser.email,
            password: eazlUser.password,
            is_superuser: eazlUser.is_superuser,
            is_staff: eazlUser.is_staff,
            is_active: eazlUser.is_active,
            date_joined: eazlUser.date_joined,
            last_login: eazlUser.last_login 
        });
    }
}
