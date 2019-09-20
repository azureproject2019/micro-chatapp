var http = require('http');
const axios = require('axios');
var request = require('request');
var qs = require('querystring')
var server = http.createServer(function (req, res) {
    if (req.url == '/axios') {

        const requestBody = {
            grant_type: 'password',
            username: 'healthcareletters@gmail.com',
            password: 'Health@2019'
        }

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        let apiUrl = 'https://apikw.myfatoorah.com/Token';
        console.log(qs.stringify(requestBody));
        axios.post(apiUrl, qs.stringify(requestBody), config)
            .then((result) => {
                // Do somthing
                //console.log(result);
            })
            .catch((err) => {
                // Do somthing
                //console.log(err);
            });


        //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        //axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        //check the URL of the current request

        /*axios({
            method: 'post',
            url: apiUrl,
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: {

            }
        }
        )
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });*/
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ Using: 'axios' }));
        res.end();
    }
    if (req.url == '/request') {
        var reqBody = {
            grant_type: 'password',
            username: 'healthcarele',
            password: 'Health@2019'
        };
        // request({
        //     url: "https://apikw.myfatoorah.com/Token",
        //     method: "POST",
        //     json: true,
        //     body: reqBody
        // }, function (error, response, body) {
        //     console.log(response);
        // });
        request.post(
            'https://apikw.myfatoorah.com/Token',
            {
                json: {
                    grant_type: 'password',
                    username: 'healthcarele',
                    password: 'Health@2019'
                }
            },
            function (error, response, body) {
                    console.log(response);
            }
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ using: 'request' }));
        res.end();
    }
});



server.listen(5000);

console.log('Server running at port 5000...')