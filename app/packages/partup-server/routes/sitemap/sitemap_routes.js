/*
 * Main sitemap route
 */
Router.route('/sitemap.xml', {where: 'server'}).get(function() {
    var response = this.response;
    var baseUrl = 'https://part-up.com/';

    // Main XML sitemap generation starts here
    var xml = '<sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">';

    // Set homepage
    xml += '<url>';
    xml += '<loc>' + baseUrl + '</loc>';
    xml += '<changefreq>daily</changefreq>';
    xml += '<priority>1.0</priority>';
    xml += '</url>';

    xml += '<sitemap>';
    xml += '<loc>' + baseUrl + 'tribes.xml</loc>';
    xml += '</sitemap>';

    xml += '<sitemap>';
    xml += '<loc>' + baseUrl + 'part-ups.xml</loc>';
    xml += '</sitemap>';

    xml += '<sitemap>';
    xml += '<loc>' + baseUrl + 'profiles.xml</loc>';
    xml += '</sitemap>';

    xml += '</sitemapindex>';

    // We are going to respond in XML format
    response.setHeader('Content-Type', 'application/xml');

    return response.end(xml);
});

/*
 * Network sitemap route
 */
Router.route('/tribes.xml', {where: 'server'}).get(function() {
    var response = this.response;
    var s3 = new AWS.S3({params: {Bucket: process.env.AWS_BUCKET_NAME}});

    // Retrieve sitemap from S3
    var xml = s3.getObjectSync({Key: 'tribes.xml'});

    // We are going to respond in XML format
    response.setHeader('Content-Type', 'application/xml');

    return response.end(xml.Body.toString());
});

/*
 * Part-ups sitemap route
 */
Router.route('/part-ups.xml', {where: 'server'}).get(function() {
    var response = this.response;
    var s3 = new AWS.S3({params: {Bucket: process.env.AWS_BUCKET_NAME}});

    // Retrieve sitemap from S3
    var xml = s3.getObjectSync({Key: 'part-ups.xml'});

    // We are going to respond in XML format
    response.setHeader('Content-Type', 'application/xml');

    return response.end(xml.Body.toString());
});

/*
 * Profiles sitemap route
 */
Router.route('/profiles.xml', {where: 'server'}).get(function() {
    var response = this.response;
    var s3 = new AWS.S3({params: {Bucket: process.env.AWS_BUCKET_NAME}});

    // Retrieve sitemap from S3
    var xml = s3.getObjectSync({Key: 'profiles.xml'});

    // We are going to respond in XML format
    response.setHeader('Content-Type', 'application/xml');

    return response.end(xml.Body.toString());
});
