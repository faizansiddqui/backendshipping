const e = require('express');
const cors = require('cors');

const app = e();
app.use(cors({
    origin:['http://localhost:3000', 'https://tatamart.in']
}))
app.use(e.json());
app.use(e.urlencoded({extended:true}));


const router = e.Router();

module.exports ={app,router};