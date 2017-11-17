'use strict'

// Packages
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Sharp = require('sharp');

exports.handler = (event, context, callback) => {
    // Get requested image and size from url pathParameters
    const bucket = event.pathParameters.bucket;
    const image = event.pathParameters.img;
    const size = event.pathParameters.dimensions;
    const dimensions = size.split('x');
    const width = parseInt(dimensions[0]);
    const height = parseInt(dimensions[1]);

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
            statusCode: 200,
            headers: { "x-custom-header": "Custom header value" },
            body: `Resized ${bucket} ${image} to width: ${width} height: ${height}`
        })
    })
        .catch(err => callback(err))
    }