'use strict'

// Packages
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Sharp = require('sharp');

// Config
const URL = 'https://s3-ap-southeast-2.amazonaws.com';

exports.handler = (event, context, callback) => {
    // Get requested image and size from url pathParameters
    const bucket = event['pathParameters']['bucket'];
    const image = event['pathParameters']['img'];
    const size = event['pathParameters']['dimensions'];
    const dimensions = size.split('x');
    const width = parseInt(dimensions[0]);
    const height = parseInt(dimensions[1]);
    const PATH = `${bucket}/${size}/${image}`;

    S3.getObject({
        Bucket: bucket, Key: image
    })
    .promise()
    .then(data => Sharp(data.Body)
        .resize(width, height)
        .toBuffer()
    )
    .then(buffer => S3.putObject({
        Body: buffer,
        Bucket: bucket,
        ContentType: 'image/jpg',
        Key: size + '/' + image,
    }).promise())
    .then(() => {
        callback(null, {
            statusCode: 301,
            headers: { 'location': `${URL}/${PATH}` },
            body: ''
        })
    })
        .catch(err => callback(err))
    }