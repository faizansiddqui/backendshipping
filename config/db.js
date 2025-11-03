require('dotenv').config();
const { Sequelize, DataTypes, Op } = require('sequelize')


const db = new Sequelize('postgresql://postgres:e6ATFohYFd8cRWSY@db.xcuaqiyzrgrtomculvww.supabase.co:5432/postgres',{
     host: process.env.SUPABASE_URL,
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

    db.sync({alter:true,force:true})
} catch (error) {

    console.error('unable to connect supabase', error);
    
    
}
   
module.exports = {db,DataTypes,Op}

