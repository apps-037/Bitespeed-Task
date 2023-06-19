"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Well done!');
});
app.post('/', (req, res) => {
    res.send({
        data: req.body
    });
});
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
