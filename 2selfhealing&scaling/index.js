import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('the website is up and running');
});


app.get('/stop',(req,res)=>{
    res.send('the website is stopping');
    process.exit(1);
})




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});