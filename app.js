const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const BaseURL = 'http://mycinema.asia/';
app.get('/items', (req, res, next) => {
    async function getMovies() {
        try {
            const movieItems = [];
            for (let i = 1; i <= 3; i++) {
                const response = await axios.get(`${BaseURL}film?page=${i}`);
                const $ = cheerio.load(response.data);
                $('.w3-tooltip').each((index, element) => {
                    const title = $(element).text().trim();
                    const title1 = title.replace(/\t|\n/g,"");
                    const Title = title1.replace(/\s\d+$/,'');
                    const Img = $(element).find('img').attr('src');
                    const MovieId = $(element).find('a').attr('href');
                   var movieUrl = `http://mycinema.asia${MovieId}`;
                 axios(movieUrl).then(response => {
                        const $ = cheerio.load(response.data);
                        const regex = /.*.m3u8"]/;
                        const match = $('body').html().match(regex);
                        if (match) {
                            var video = match[0];
                            const regex1 = /"([^"]+)"/;
                            const match1 = regex1.exec(video);
                            const result = match1 && match1[1];
                            const link = 'http://media1.mycinema.asia/media/' + result;
                            movieItems.push({Title,Img,link});
                        
                        }
                        
                        });
             
                });
            }
            res.json({
                status: true,
                data: movieItems
            });
        } catch (e) {
            res.json({
                status: false,
                msg: e.message || "Unknown Error",
                data: null
            });
        }
    } getMovies();
});
app.listen(3000,console.log("sercer is searching"));