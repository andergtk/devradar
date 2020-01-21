const Dev = require('../models/Dev');

const stringToArray = require('../utils/stringToArray');

module.exports = {
    async index(req, res) {
        const { techs, latitude, longitude } = req.query;

        const techsArray = stringToArray(techs);

        const devs = await Dev.find({
            ...(techsArray.length && {
                techs: {
                    $in: techsArray.map(tech => new RegExp(tech, 'i')),
                }
            }),
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                }
            }
        });

        return res.json({
            search_criteria: {
                techs,
                latitude,
                longitude
            },
            result: devs
        });
    }
};