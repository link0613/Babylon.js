﻿module BABYLON {
    export class StickValues {
        constructor(public x, public y) {
        }
    }
    export class Gamepad {

        public type: number;

        private _leftStick: StickValues;
        private _rightStick: StickValues;

        private _leftStickAxisX: number;
        private _leftStickAxisY: number;
        private _rightStickAxisX: number;
        private _rightStickAxisY: number;

        private _onleftstickchanged: (values: StickValues) => void;
        private _onrightstickchanged: (values: StickValues) => void;

        public static GAMEPAD = 0;
        public static GENERIC = 1;
        public static XBOX = 2;
        public static POSE_ENABLED = 3;

        constructor(public id: string, public index: number, public browserGamepad, leftStickX: number = 0, leftStickY: number = 1, rightStickX: number = 2, rightStickY: number = 3) {
            this.type = Gamepad.GAMEPAD;
            this._leftStickAxisX = leftStickX;
            this._leftStickAxisY = leftStickY;
            this._rightStickAxisX = rightStickX;
            this._rightStickAxisY = rightStickY;
            if (this.browserGamepad.axes.length >= 2) {
                this._leftStick = { x: this.browserGamepad.axes[this._leftStickAxisX], y: this.browserGamepad.axes[this._leftStickAxisY] };
            }
            if (this.browserGamepad.axes.length >= 4) {
                this._rightStick = { x: this.browserGamepad.axes[this._rightStickAxisX], y: this.browserGamepad.axes[this._rightStickAxisY] };
            }
        }

        public onleftstickchanged(callback: (values: StickValues) => void) {
            this._onleftstickchanged = callback;
        }

        public onrightstickchanged(callback: (values: StickValues) => void) {
            this._onrightstickchanged = callback;
        }

        public get leftStick(): StickValues {
            return this._leftStick;
        }
        public set leftStick(newValues: StickValues) {
            if (this._onleftstickchanged && (this._leftStick.x !== newValues.x || this._leftStick.y !== newValues.y)) {
                this._onleftstickchanged(newValues);
            }
            this._leftStick = newValues;
        }
        public get rightStick(): StickValues {
            return this._rightStick;
        }
        public set rightStick(newValues: StickValues) {
            if (this._onrightstickchanged && (this._rightStick.x !== newValues.x || this._rightStick.y !== newValues.y)) {
                this._onrightstickchanged(newValues);
            }
            this._rightStick = newValues;
        }

        public update() {
            if (this._leftStick) {
                this.leftStick = { x: this.browserGamepad.axes[this._leftStickAxisX], y: this.browserGamepad.axes[this._leftStickAxisY] };
            }
            if (this._rightStick) {
                this.rightStick = { x: this.browserGamepad.axes[this._rightStickAxisX], y: this.browserGamepad.axes[this._rightStickAxisY] };
            }
        }
    }

    export class GenericPad extends Gamepad {
        private _buttons: Array<number>;
        private _onbuttondown: (buttonPressed: number) => void;
        private _onbuttonup: (buttonReleased: number) => void;

        public onbuttondown(callback: (buttonPressed: number) => void) {
            this._onbuttondown = callback;
        }
        public onbuttonup(callback: (buttonReleased: number) => void) {
            this._onbuttonup = callback;
        }

        constructor(id: string, index: number, browserGamepad) {
            super(id, index, browserGamepad);
            this.type = Gamepad.GENERIC;
            this._buttons = new Array(browserGamepad.buttons.length);
        }

        private _setButtonValue(newValue: number, currentValue: number, buttonIndex: number): number {
            if (newValue !== currentValue) {
                if (this._onbuttondown && newValue === 1) {
                    this._onbuttondown(buttonIndex);
                }
                if (this._onbuttonup && newValue === 0) {
                    this._onbuttonup(buttonIndex);
                }
            }
            return newValue;
        }

        public update() {
            super.update();
            for (var index = 0; index < this._buttons.length; index++) {
                this._buttons[index] = this._setButtonValue(this.browserGamepad.buttons[index].value, this._buttons[index], index);
            }
        }
    }

    export enum Xbox360Button {
        A,
        B,
        X,
        Y,
        Start,
        Back,
        LB,
        RB,
        LeftStick,
        RightStick
    }

    export enum Xbox360Dpad {
        Up,
        Down,
        Left,
        Right
    }

    export class Xbox360Pad extends Gamepad {
        private _leftTrigger: number = 0;
        private _rightTrigger: number = 0;

        private _onlefttriggerchanged: (value: number) => void;
        private _onrighttriggerchanged: (value: number) => void;

        private _onbuttondown: (buttonPressed: Xbox360Button) => void;
        private _onbuttonup: (buttonReleased: Xbox360Button) => void;
        private _ondpaddown: (dPadPressed: Xbox360Dpad) => void;
        private _ondpadup: (dPadReleased: Xbox360Dpad) => void;

        private _buttonA: number = 0;
        private _buttonB: number = 0;
        private _buttonX: number = 0;
        private _buttonY: number = 0;
        private _buttonBack: number = 0;
        private _buttonStart: number = 0;
        private _buttonLB: number = 0;
        private _buttonRB: number = 0;

        private _buttonLeftStick: number = 0;
        private _buttonRightStick: number = 0;
        private _dPadUp: number = 0;
        private _dPadDown: number = 0;
        private _dPadLeft: number = 0;
        private _dPadRight: number = 0;

        private _isXboxOnePad: boolean = false;

        constructor(id: string, index: number, gamepad: any, xboxOne: boolean = false) {
            super(id, index, gamepad, 0, 1, (xboxOne ? 3 : 2), (xboxOne ? 4 : 3));
            this.type = Gamepad.XBOX;
            this._isXboxOnePad = xboxOne;
        }

        public onlefttriggerchanged(callback: (value: number) => void) {
            this._onlefttriggerchanged = callback;
        }

        public onrighttriggerchanged(callback: (value: number) => void) {
            this._onrighttriggerchanged = callback;
        }

        public get leftTrigger(): number {
            return this._leftTrigger;
        }
        public set leftTrigger(newValue: number) {
            if (this._onlefttriggerchanged && this._leftTrigger !== newValue) {
                this._onlefttriggerchanged(newValue);
            }
            this._leftTrigger = newValue;
        }

        public get rightTrigger(): number {
            return this._rightTrigger;
        }
        public set rightTrigger(newValue: number) {
            if (this._onrighttriggerchanged && this._rightTrigger !== newValue) {
                this._onrighttriggerchanged(newValue);
            }
            this._rightTrigger = newValue;
        }

        public onbuttondown(callback: (buttonPressed: Xbox360Button) => void) {
            this._onbuttondown = callback;
        }
        public onbuttonup(callback: (buttonReleased: Xbox360Button) => void) {
            this._onbuttonup = callback;
        }
        public ondpaddown(callback: (dPadPressed: Xbox360Dpad) => void) {
            this._ondpaddown = callback;
        }
        public ondpadup(callback: (dPadReleased: Xbox360Dpad) => void) {
            this._ondpadup = callback;
        }

        private _setButtonValue(newValue: number, currentValue: number, buttonType: Xbox360Button): number {
            if (newValue !== currentValue) {
                if (this._onbuttondown && newValue === 1) {
                    this._onbuttondown(buttonType);
                }
                if (this._onbuttonup && newValue === 0) {
                    this._onbuttonup(buttonType);
                }
            }
            return newValue;
        }

        private _setDPadValue(newValue: number, currentValue: number, buttonType: Xbox360Dpad): number {
            if (newValue !== currentValue) {
                if (this._ondpaddown && newValue === 1) {
                    this._ondpaddown(buttonType);
                }
                if (this._ondpadup && newValue === 0) {
                    this._ondpadup(buttonType);
                }
            }
            return newValue;
        }

        public get buttonA(): number {
            return this._buttonA;
        }
        public set buttonA(value) {
            this._buttonA = this._setButtonValue(value, this._buttonA, Xbox360Button.A);
        }
        public get buttonB(): number {
            return this._buttonB;
        }
        public set buttonB(value) {
            this._buttonB = this._setButtonValue(value, this._buttonB, Xbox360Button.B);
        }
        public get buttonX(): number {
            return this._buttonX;
        }
        public set buttonX(value) {
            this._buttonX = this._setButtonValue(value, this._buttonX, Xbox360Button.X);
        }
        public get buttonY(): number {
            return this._buttonY;
        }
        public set buttonY(value) {
            this._buttonY = this._setButtonValue(value, this._buttonY, Xbox360Button.Y);
        }
        public get buttonStart(): number {
            return this._buttonStart;
        }
        public set buttonStart(value) {
            this._buttonStart = this._setButtonValue(value, this._buttonStart, Xbox360Button.Start);
        }
        public get buttonBack(): number {
            return this._buttonBack;
        }
        public set buttonBack(value) {
            this._buttonBack = this._setButtonValue(value, this._buttonBack, Xbox360Button.Back);
        }
        public get buttonLB(): number {
            return this._buttonLB;
        }
        public set buttonLB(value) {
            this._buttonLB = this._setButtonValue(value, this._buttonLB, Xbox360Button.LB);
        }
        public get buttonRB(): number {
            return this._buttonRB;
        }
        public set buttonRB(value) {
            this._buttonRB = this._setButtonValue(value, this._buttonRB, Xbox360Button.RB);
        }
        public get buttonLeftStick(): number {
            return this._buttonLeftStick;
        }
        public set buttonLeftStick(value) {
            this._buttonLeftStick = this._setButtonValue(value, this._buttonLeftStick, Xbox360Button.LeftStick);
        }
        public get buttonRightStick(): number {
            return this._buttonRightStick;
        }
        public set buttonRightStick(value) {
            this._buttonRightStick = this._setButtonValue(value, this._buttonRightStick, Xbox360Button.RightStick);
        }
        public get dPadUp(): number {
            return this._dPadUp;
        }
        public set dPadUp(value) {
            this._dPadUp = this._setDPadValue(value, this._dPadUp, Xbox360Dpad.Up);
        }
        public get dPadDown(): number {
            return this._dPadDown;
        }
        public set dPadDown(value) {
            this._dPadDown = this._setDPadValue(value, this._dPadDown, Xbox360Dpad.Down);
        }
        public get dPadLeft(): number {
            return this._dPadLeft;
        }
        public set dPadLeft(value) {
            this._dPadLeft = this._setDPadValue(value, this._dPadLeft, Xbox360Dpad.Left);
        }
        public get dPadRight(): number {
            return this._dPadRight;
        }
        public set dPadRight(value) {
            this._dPadRight = this._setDPadValue(value, this._dPadRight, Xbox360Dpad.Right);
        }
        public update() {
            super.update();
            if (this._isXboxOnePad) {
                this.buttonA = this.browserGamepad.buttons[0].value;
                this.buttonB = this.browserGamepad.buttons[1].value;
                this.buttonX = this.browserGamepad.buttons[2].value;
                this.buttonY = this.browserGamepad.buttons[3].value;
                this.buttonLB = this.browserGamepad.buttons[4].value;
                this.buttonRB = this.browserGamepad.buttons[5].value;
                this.leftTrigger = this.browserGamepad.axes[2];
                this.rightTrigger = this.browserGamepad.axes[5];
                this.buttonBack = this.browserGamepad.buttons[9].value;
                this.buttonStart = this.browserGamepad.buttons[8].value;
                this.buttonLeftStick = this.browserGamepad.buttons[6].value;
                this.buttonRightStick = this.browserGamepad.buttons[7].value;
                this.dPadUp = this.browserGamepad.buttons[11].value;
                this.dPadDown = this.browserGamepad.buttons[12].value;
                this.dPadLeft = this.browserGamepad.buttons[13].value;
                this.dPadRight = this.browserGamepad.buttons[14].value;
            } else {
                this.buttonA = this.browserGamepad.buttons[0].value;
                this.buttonB = this.browserGamepad.buttons[1].value;
                this.buttonX = this.browserGamepad.buttons[2].value;
                this.buttonY = this.browserGamepad.buttons[3].value;
                this.buttonLB = this.browserGamepad.buttons[4].value;
                this.buttonRB = this.browserGamepad.buttons[5].value;
                this.leftTrigger = this.browserGamepad.buttons[6].value;
                this.rightTrigger = this.browserGamepad.buttons[7].value;
                this.buttonBack = this.browserGamepad.buttons[8].value;
                this.buttonStart = this.browserGamepad.buttons[9].value;
                this.buttonLeftStick = this.browserGamepad.buttons[10].value;
                this.buttonRightStick = this.browserGamepad.buttons[11].value;
                this.dPadUp = this.browserGamepad.buttons[12].value;
                this.dPadDown = this.browserGamepad.buttons[13].value;
                this.dPadLeft = this.browserGamepad.buttons[14].value;
                this.dPadRight = this.browserGamepad.buttons[15].value;
            }
        }
    }
}