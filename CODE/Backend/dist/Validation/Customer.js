"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const register = [
    (0, express_validator_2.body)('name')
        .notEmpty()
        .withMessage('name is required'),
    (0, express_validator_2.body)('email')
        .notEmpty()
        .withMessage('email is required'),
    (0, express_validator_2.body)('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be 8 charectar'),
];
const login = [
    (0, express_validator_2.body)('email')
        .notEmpty()
        .withMessage('email is required'),
    (0, express_validator_2.body)('password')
        .notEmpty()
        .withMessage('password is required')
];
const validate = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (const validation of validations) {
                yield validation.run(req);
            }
            const errors = (0, express_validator_1.validationResult)(req);
            if (errors.isEmpty()) { // if the errors are empty
                return next(); // we are going to next function or controller
            }
            let message = '';
            for (const err of errors.array()) {
                message += err.msg;
            }
            res.status(400).json({ message });
        }
        catch (error) {
            res.status(500).json({ error });
        }
    });
};
module.exports = { validate, register, login };
