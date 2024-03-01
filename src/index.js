import app from './app.js'

app.listen(app.get('port'), ()=>{
    console.log('server is runnig in Port ' + app.get('port'))
})