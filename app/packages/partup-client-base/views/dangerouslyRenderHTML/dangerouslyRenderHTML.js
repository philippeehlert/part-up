/**
 * Sanitize and set HTML dangerously
 *
 * this template is dependant on the following parameters to be given:
 *
 * @param {String} HTML The html string that needs to be sanitized
 * @param {Function} transform [OPTIONAL] A function that modifies the html before it get's rendered
 * @param {String} access [OPTIONAL=STANDARD] access used to determine which tags need sanitizing
 * @example {{> dangerouslyRenderHTML
 *  HTML=htmlString
 *  transform=transformFunc
 *  access="sanitize_access" }}
 */
Template.dangerouslyRenderHTML.onCreated(function() {
    const { transform = html => html } = this.data;
    this.transform = transform;
    this.access = this.data.access;
});

Template.dangerouslyRenderHTML.helpers({
    render() {
        const template = Template.instance();
        const transformFunc = template.transform;
        const transformedHTML = transformFunc(template.data.HTML);
        const sanitizeAccess = template.access || Partup.client.html.SANITIZE_ACCESS.STANDARD;
        const sanitizedHTML = Partup.client.html.sanitize(transformedHTML, sanitizeAccess);

        return sanitizedHTML;
    },
});
