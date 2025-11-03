require('dotenv').config();
const dns = require('dns');
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}
const { Sequelize, DataTypes, Op } = require('sequelize')


const db = new Sequelize('postgresql://postgres:e6ATFohYFd8cRWSY@db.xcuaqiyzrgrtomculvww.supabase.co:5432/postgres',{
   
     port:5432,
     dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Render requires SSL
    }
  },
  logging: false,
})

try {
    db.authenticate().then(()=>{
        console.log('supabase connect sucessfully');
    })

    db.sync({alter:true})
} catch (error) {

    console.error('unable to connect supabase', error);
    
    
}
   
module.exports = {db,DataTypes,Op}

